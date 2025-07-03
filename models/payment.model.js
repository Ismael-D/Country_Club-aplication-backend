import { db } from '../database/connection.database.js'

export const PaymentModel = {
    // =====================================================
    // MÉTODOS CRUD BÁSICOS
    // =====================================================

    async create(paymentData) {
        const {
            member_id,
            amount,
            payment_method,
            status = 'completed',
            invoice_number,
            description,
            processed_by
        } = paymentData

        const query = `
            INSERT INTO payments (
                member_id, amount, payment_method, status, 
                invoice_number, description, processed_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `

        const values = [
            member_id, amount, payment_method, status,
            invoice_number, description, processed_by
        ]

        const result = await db.query(query, values)
        return result.rows[0]
    },

    async findById(id) {
        const query = `
            SELECT p.*, 
                   m.first_name as member_first_name,
                   m.last_name as member_last_name,
                   u.first_name as processor_first_name,
                   u.last_name as processor_last_name
            FROM payments p
            LEFT JOIN members m ON p.member_id = m.id
            LEFT JOIN users u ON p.processed_by = u.id
            WHERE p.id = $1
        `
        const result = await db.query(query, [id])
        return result.rows[0]
    },

    async update(id, updateData) {
        const fields = Object.keys(updateData)
        const values = Object.values(updateData)
        
        const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ')
        const query = `
            UPDATE payments 
            SET ${setClause}, payment_date = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `

        const result = await db.query(query, [id, ...values])
        return result.rows[0]
    },

    async remove(id) {
        const query = 'DELETE FROM payments WHERE id = $1 RETURNING *'
        const result = await db.query(query, [id])
        return result.rows[0]
    },

    // =====================================================
    // MÉTODOS DE BÚSQUEDA POR MIEMBRO
    // =====================================================

    async findByMemberId(memberId) {
        const query = `
            SELECT p.*, 
                   u.first_name as processor_first_name,
                   u.last_name as processor_last_name
            FROM payments p
            LEFT JOIN users u ON p.processed_by = u.id
            WHERE p.member_id = $1
            ORDER BY p.payment_date DESC
        `
        const result = await db.query(query, [memberId])
        return result.rows
    },

    async findByMemberIdWithPagination(memberId, limit, offset, filters = {}) {
        let query = `
            SELECT p.*, 
                   u.first_name as processor_first_name,
                   u.last_name as processor_last_name
            FROM payments p
            LEFT JOIN users u ON p.processed_by = u.id
            WHERE p.member_id = $1
        `
        
        const values = [memberId]
        let valueIndex = 2

        // Aplicar filtros
        if (filters.status) {
            query += ` AND p.status = $${valueIndex}`
            values.push(filters.status)
            valueIndex++
        }

        // Contar total
        const countQuery = query.replace('SELECT p.*, u.first_name as processor_first_name, u.last_name as processor_last_name', 'SELECT COUNT(*)')
        const countResult = await db.query(countQuery, values)
        const total = parseInt(countResult.rows[0].count)

        // Aplicar paginación
        query += ` ORDER BY p.payment_date DESC LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`
        values.push(limit, offset)

        const result = await db.query(query, values)
        
        return {
            payments: result.rows,
            total
        }
    },

    async findPendingByMemberId(memberId) {
        const query = `
            SELECT * FROM payments 
            WHERE member_id = $1 AND status = 'pending'
            ORDER BY payment_date DESC
        `
        const result = await db.query(query, [memberId])
        return result.rows
    },

    // =====================================================
    // MÉTODOS DE ESTADÍSTICAS Y ANÁLISIS
    // =====================================================

    async getPaymentStatistics(memberId = null) {
        let query = `
            SELECT 
                COUNT(*) as total_payments,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_payments,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_payments,
                SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_payments,
                SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_amount,
                AVG(CASE WHEN status = 'completed' THEN amount ELSE NULL END) as average_amount
            FROM payments
        `
        
        const values = []
        if (memberId) {
            query += ' WHERE member_id = $1'
            values.push(memberId)
        }

        const result = await db.query(query, values)
        return result.rows[0]
    },

    async getPaymentsByMethod(memberId = null) {
        let query = `
            SELECT 
                payment_method,
                COUNT(*) as count,
                SUM(amount) as total_amount
            FROM payments
            WHERE status = 'completed'
        `
        
        const values = []
        if (memberId) {
            query += ' AND member_id = $1'
            values.push(memberId)
        }

        query += ' GROUP BY payment_method ORDER BY total_amount DESC'

        const result = await db.query(query, values)
        return result.rows
    },

    async getPaymentsByMonth(year, memberId = null) {
        let query = `
            SELECT 
                EXTRACT(MONTH FROM payment_date) as month,
                COUNT(*) as count,
                SUM(amount) as total_amount
            FROM payments
            WHERE status = 'completed' 
            AND EXTRACT(YEAR FROM payment_date) = $1
        `
        
        const values = [year]
        if (memberId) {
            query += ' AND member_id = $2'
            values.push(memberId)
        }

        query += ' GROUP BY EXTRACT(MONTH FROM payment_date) ORDER BY month'

        const result = await db.query(query, values)
        return result.rows
    },

    // =====================================================
    // MÉTODOS DE VALIDACIÓN Y UTILIDADES
    // =====================================================

    async validatePayment(paymentData) {
        const { amount, payment_method, member_id } = paymentData

        if (!amount || amount <= 0) {
            return {
                isValid: false,
                message: 'El monto debe ser mayor a 0'
            }
        }

        if (!payment_method) {
            return {
                isValid: false,
                message: 'El método de pago es requerido'
            }
        }

        if (!member_id) {
            return {
                isValid: false,
                message: 'El ID del miembro es requerido'
            }
        }

        // Verificar que el miembro existe
        const memberQuery = 'SELECT id FROM members WHERE id = $1'
        const memberResult = await db.query(memberQuery, [member_id])
        
        if (memberResult.rows.length === 0) {
            return {
                isValid: false,
                message: 'El miembro no existe'
            }
        }

        return {
            isValid: true,
            message: 'Datos válidos'
        }
    },

    async generateInvoiceNumber() {
        const year = new Date().getFullYear()
        const query = `
            SELECT COUNT(*) as count 
            FROM payments 
            WHERE EXTRACT(YEAR FROM payment_date) = $1
        `
        const result = await db.query(query, [year])
        const count = parseInt(result.rows[0].count) + 1
        return `INV-${year}-${count.toString().padStart(6, '0')}`
    },

    async getRecentPayments(limit = 10) {
        const query = `
            SELECT p.*, 
                   m.first_name as member_first_name,
                   m.last_name as member_last_name,
                   u.first_name as processor_first_name,
                   u.last_name as processor_last_name
            FROM payments p
            LEFT JOIN members m ON p.member_id = m.id
            LEFT JOIN users u ON p.processed_by = u.id
            ORDER BY p.payment_date DESC
            LIMIT $1
        `
        const result = await db.query(query, [limit])
        return result.rows
    },

    async getOverduePayments() {
        const query = `
            SELECT p.*, 
                   m.first_name as member_first_name,
                   m.last_name as member_last_name,
                   m.membership_number
            FROM payments p
            JOIN members m ON p.member_id = m.id
            WHERE p.status = 'pending' 
            AND p.payment_date < CURRENT_DATE - INTERVAL '30 days'
            ORDER BY p.payment_date ASC
        `
        const result = await db.query(query)
        return result.rows
    }
} 
