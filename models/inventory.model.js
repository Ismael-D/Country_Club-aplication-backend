import { db } from '../database/connection.database.js'

export const InventoryModel = {
    // =====================================================
    // MÉTODOS CRUD BÁSICOS DE PRODUCTOS
    // =====================================================

    async create(productData) {
        const {
            name,
            description,
            sku,
            category_id,
            supplier_id,
            unit_price,
            cost_price,
            min_stock,
            max_stock,
            current_stock = 0,
            unit_of_measure,
            barcode,
            location,
            expiry_date,
            status = 'active',
            created_by
        } = productData

        const query = `
            INSERT INTO inventory_products (
                name, description, sku, category_id, supplier_id,
                unit_price, cost_price, min_stock, max_stock, current_stock,
                unit_of_measure, barcode, location, expiry_date, status, created_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            RETURNING *
        `

        const values = [
            name, description, sku, category_id, supplier_id,
            unit_price, cost_price, min_stock, max_stock, current_stock,
            unit_of_measure, barcode, location, expiry_date, status, created_by
        ]

        const result = await db.query(query, values)
        return result.rows[0]
    },

    async findById(id) {
        const query = `
            SELECT p.*, 
                   c.name as category_name,
                   s.name as supplier_name,
                   s.contact_person as supplier_contact,
                   u.first_name as created_by_first_name,
                   u.last_name as created_by_last_name
            FROM inventory_products p
            LEFT JOIN inventory_categories c ON p.category_id = c.id
            LEFT JOIN inventory_suppliers s ON p.supplier_id = s.id
            LEFT JOIN users u ON p.created_by = u.id
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
            UPDATE inventory_products 
            SET ${setClause}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `

        const result = await db.query(query, [id, ...values])
        return result.rows[0]
    },

    async remove(id) {
        const query = 'DELETE FROM inventory_products WHERE id = $1 RETURNING *'
        const result = await db.query(query, [id])
        return result.rows[0]
    },

    // =====================================================
    // MÉTODOS DE BÚSQUEDA Y FILTRADO DE PRODUCTOS
    // =====================================================

    async findAllWithPagination(limit, offset, filters = {}) {
        let query = `
            SELECT p.*, 
                   c.name as category_name,
                   s.name as supplier_name,
                   u.first_name as created_by_first_name,
                   u.last_name as created_by_last_name
            FROM inventory_products p
            LEFT JOIN inventory_categories c ON p.category_id = c.id
            LEFT JOIN inventory_suppliers s ON p.supplier_id = s.id
            LEFT JOIN users u ON p.created_by = u.id
            WHERE 1=1
        `
        
        const values = []
        let valueIndex = 1

        // Aplicar filtros
        if (filters.category) {
            query += ` AND p.category_id = $${valueIndex}`
            values.push(filters.category)
            valueIndex++
        }

        if (filters.supplier) {
            query += ` AND p.supplier_id = $${valueIndex}`
            values.push(filters.supplier)
            valueIndex++
        }

        if (filters.status) {
            query += ` AND p.status = $${valueIndex}`
            values.push(filters.status)
            valueIndex++
        }

        if (filters.low_stock) {
            query += ` AND p.current_stock <= p.min_stock`
        }

        if (filters.search) {
            query += ` AND (p.name ILIKE $${valueIndex} OR p.description ILIKE $${valueIndex} OR p.sku ILIKE $${valueIndex})`
            values.push(`%${filters.search}%`)
            valueIndex++
        }

        // Contar total
        const countQuery = query.replace('SELECT p.*, c.name as category_name, s.name as supplier_name, u.first_name as created_by_first_name, u.last_name as created_by_last_name', 'SELECT COUNT(*)')
        const countResult = await db.query(countQuery, values)
        const total = parseInt(countResult.rows[0].count)

        // Aplicar ordenamiento y paginación
        query += ` ORDER BY p.name ASC LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`
        values.push(limit, offset)

        const result = await db.query(query, values)
        
        return {
            products: result.rows,
            total
        }
    },

    async search(searchTerm, limit, offset) {
        const query = `
            SELECT p.*, 
                   c.name as category_name,
                   s.name as supplier_name,
                   u.first_name as created_by_first_name,
                   u.last_name as created_by_last_name
            FROM inventory_products p
            LEFT JOIN inventory_categories c ON p.category_id = c.id
            LEFT JOIN inventory_suppliers s ON p.supplier_id = s.id
            LEFT JOIN users u ON p.created_by = u.id
            WHERE p.name ILIKE $1 
               OR p.description ILIKE $1 
               OR p.sku ILIKE $1
               OR p.barcode ILIKE $1
            ORDER BY p.name ASC
            LIMIT $2 OFFSET $3
        `

        const countQuery = `
            SELECT COUNT(*) FROM inventory_products 
            WHERE name ILIKE $1 
               OR description ILIKE $1 
               OR sku ILIKE $1
               OR barcode ILIKE $1
        `

        const searchPattern = `%${searchTerm}%`
        
        const [result, countResult] = await Promise.all([
            db.query(query, [searchPattern, limit, offset]),
            db.query(countQuery, [searchPattern])
        ])

        const total = parseInt(countResult.rows[0].count)

        return {
            products: result.rows,
            total
        }
    },

    // =====================================================
    // MÉTODOS DE CATEGORÍAS
    // =====================================================

    async getCategories() {
        const query = `
            SELECT c.*, 
                   COUNT(p.id) as product_count,
                   u.first_name as created_by_first_name,
                   u.last_name as created_by_last_name
            FROM inventory_categories c
            LEFT JOIN inventory_products p ON c.id = p.category_id
            LEFT JOIN users u ON c.created_by = u.id
            GROUP BY c.id, u.first_name, u.last_name
            ORDER BY c.name ASC
        `
        const result = await db.query(query)
        return result.rows
    },

    async createCategory(categoryData) {
        const {
            name,
            description,
            color,
            created_by
        } = categoryData

        const query = `
            INSERT INTO inventory_categories (name, description, color, created_by)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `

        const values = [name, description, color, created_by]
        const result = await db.query(query, values)
        return result.rows[0]
    },

    // =====================================================
    // MÉTODOS DE PROVEEDORES
    // =====================================================

    async getSuppliersWithPagination(limit, offset, filters = {}) {
        let query = `
            SELECT s.*, 
                   COUNT(p.id) as product_count,
                   u.first_name as created_by_first_name,
                   u.last_name as created_by_last_name
            FROM inventory_suppliers s
            LEFT JOIN inventory_products p ON s.id = p.supplier_id
            LEFT JOIN users u ON s.created_by = u.id
            WHERE 1=1
        `
        
        const values = []
        let valueIndex = 1

        // Aplicar filtros
        if (filters.status) {
            query += ` AND s.status = $${valueIndex}`
            values.push(filters.status)
            valueIndex++
        }

        if (filters.search) {
            query += ` AND (s.name ILIKE $${valueIndex} OR s.contact_person ILIKE $${valueIndex} OR s.email ILIKE $${valueIndex})`
            values.push(`%${filters.search}%`)
            valueIndex++
        }

        // Contar total
        const countQuery = query.replace('SELECT s.*, COUNT(p.id) as product_count, u.first_name as created_by_first_name, u.last_name as created_by_last_name', 'SELECT COUNT(*)')
        const countResult = await db.query(countQuery, values)
        const total = parseInt(countResult.rows[0].count)

        // Aplicar ordenamiento y paginación
        query += ` GROUP BY s.id, u.first_name, u.last_name ORDER BY s.name ASC LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`
        values.push(limit, offset)

        const result = await db.query(query, values)
        
        return {
            suppliers: result.rows,
            total
        }
    },

    async createSupplier(supplierData) {
        const {
            name,
            contact_person,
            email,
            phone,
            address,
            tax_id,
            payment_terms,
            status = 'active',
            created_by
        } = supplierData

        const query = `
            INSERT INTO inventory_suppliers (
                name, contact_person, email, phone, address, 
                tax_id, payment_terms, status, created_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `

        const values = [
            name, contact_person, email, phone, address,
            tax_id, payment_terms, status, created_by
        ]

        const result = await db.query(query, values)
        return result.rows[0]
    },

    async updateSupplier(id, updateData) {
        const fields = Object.keys(updateData)
        const values = Object.values(updateData)
        
        const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ')
        const query = `
            UPDATE inventory_suppliers 
            SET ${setClause}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `

        const result = await db.query(query, [id, ...values])
        return result.rows[0]
    },

    // =====================================================
    // MÉTODOS DE MOVIMIENTOS DE INVENTARIO
    // =====================================================

    async getMovementsWithPagination(limit, offset, filters = {}) {
        let query = `
            SELECT m.*, 
                   p.name as product_name,
                   p.sku as product_sku,
                   u.first_name as created_by_first_name,
                   u.last_name as created_by_last_name
            FROM inventory_movements m
            LEFT JOIN inventory_products p ON m.product_id = p.id
            LEFT JOIN users u ON m.created_by = u.id
            WHERE 1=1
        `
        
        const values = []
        let valueIndex = 1

        // Aplicar filtros
        if (filters.product_id) {
            query += ` AND m.product_id = $${valueIndex}`
            values.push(filters.product_id)
            valueIndex++
        }

        if (filters.movement_type) {
            query += ` AND m.movement_type = $${valueIndex}`
            values.push(filters.movement_type)
            valueIndex++
        }

        if (filters.date_from) {
            query += ` AND m.movement_date >= $${valueIndex}`
            values.push(filters.date_from)
            valueIndex++
        }

        if (filters.date_to) {
            query += ` AND m.movement_date <= $${valueIndex}`
            values.push(filters.date_to)
            valueIndex++
        }

        // Contar total
        const countQuery = query.replace('SELECT m.*, p.name as product_name, p.sku as product_sku, u.first_name as created_by_first_name, u.last_name as created_by_last_name', 'SELECT COUNT(*)')
        const countResult = await db.query(countQuery, values)
        const total = parseInt(countResult.rows[0].count)

        // Aplicar ordenamiento y paginación
        query += ` ORDER BY m.movement_date DESC LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`
        values.push(limit, offset)

        const result = await db.query(query, values)
        
        return {
            movements: result.rows,
            total
        }
    },

    async createMovement(movementData) {
        const {
            product_id,
            movement_type,
            quantity,
            unit_price,
            reference_number,
            notes,
            created_by
        } = movementData

        // Iniciar transacción
        const client = await db.connect()
        try {
            await client.query('BEGIN')

            // Crear el movimiento
            const movementQuery = `
                INSERT INTO inventory_movements (
                    product_id, movement_type, quantity, unit_price, 
                    reference_number, notes, created_by
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `
            const movementValues = [
                product_id, movement_type, quantity, unit_price,
                reference_number, notes, created_by
            ]
            const movementResult = await client.query(movementQuery, movementValues)
            const movement = movementResult.rows[0]

            // Actualizar stock del producto
            let stockUpdateQuery
            if (movement_type === 'in' || movement_type === 'purchase') {
                stockUpdateQuery = `
                    UPDATE inventory_products 
                    SET current_stock = current_stock + $1, updated_at = CURRENT_TIMESTAMP
                    WHERE id = $2
                `
            } else if (movement_type === 'out' || movement_type === 'sale' || movement_type === 'adjustment') {
                stockUpdateQuery = `
                    UPDATE inventory_products 
                    SET current_stock = current_stock - $1, updated_at = CURRENT_TIMESTAMP
                    WHERE id = $2
                `
            }

            if (stockUpdateQuery) {
                await client.query(stockUpdateQuery, [quantity, product_id])
            }

            await client.query('COMMIT')
            return movement
        } catch (error) {
            await client.query('ROLLBACK')
            throw error
        } finally {
            client.release()
        }
    },

    // =====================================================
    // MÉTODOS DE COMPRAS
    // =====================================================

    async getPurchasesWithPagination(limit, offset, filters = {}) {
        let query = `
            SELECT p.*, 
                   s.name as supplier_name,
                   s.contact_person as supplier_contact,
                   u.first_name as created_by_first_name,
                   u.last_name as created_by_last_name
            FROM inventory_purchases p
            LEFT JOIN inventory_suppliers s ON p.supplier_id = s.id
            LEFT JOIN users u ON p.created_by = u.id
            WHERE 1=1
        `
        
        const values = []
        let valueIndex = 1

        // Aplicar filtros
        if (filters.supplier_id) {
            query += ` AND p.supplier_id = $${valueIndex}`
            values.push(filters.supplier_id)
            valueIndex++
        }

        if (filters.status) {
            query += ` AND p.status = $${valueIndex}`
            values.push(filters.status)
            valueIndex++
        }

        if (filters.date_from) {
            query += ` AND p.purchase_date >= $${valueIndex}`
            values.push(filters.date_from)
            valueIndex++
        }

        if (filters.date_to) {
            query += ` AND p.purchase_date <= $${valueIndex}`
            values.push(filters.date_to)
            valueIndex++
        }

        // Contar total
        const countQuery = query.replace('SELECT p.*, s.name as supplier_name, s.contact_person as supplier_contact, u.first_name as created_by_first_name, u.last_name as created_by_last_name', 'SELECT COUNT(*)')
        const countResult = await db.query(countQuery, values)
        const total = parseInt(countResult.rows[0].count)

        // Aplicar ordenamiento y paginación
        query += ` ORDER BY p.purchase_date DESC LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`
        values.push(limit, offset)

        const result = await db.query(query, values)
        
        return {
            purchases: result.rows,
            total
        }
    },

    async createPurchase(purchaseData) {
        const {
            supplier_id,
            purchase_number,
            total_amount,
            purchase_date,
            expected_delivery,
            notes,
            created_by
        } = purchaseData

        const query = `
            INSERT INTO inventory_purchases (
                supplier_id, purchase_number, total_amount, purchase_date,
                expected_delivery, notes, created_by, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
            RETURNING *
        `

        const values = [
            supplier_id, purchase_number, total_amount, purchase_date,
            expected_delivery, notes, created_by
        ]

        const result = await db.query(query, values)
        return result.rows[0]
    },

    async updatePurchaseStatus(id, status, updated_by) {
        const query = `
            UPDATE inventory_purchases 
            SET status = $1, updated_by = $2, updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING *
        `

        const result = await db.query(query, [status, updated_by, id])
        return result.rows[0]
    },

    // =====================================================
    // MÉTODOS DE ESTADÍSTICAS Y ANÁLISIS
    // =====================================================

    async getStatistics() {
        const query = `
            SELECT 
                COUNT(*) as total_products,
                SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_products,
                SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_products,
                SUM(CASE WHEN current_stock <= min_stock THEN 1 ELSE 0 END) as low_stock_products,
                SUM(CASE WHEN current_stock = 0 THEN 1 ELSE 0 END) as out_of_stock_products,
                SUM(CASE WHEN expiry_date < CURRENT_DATE THEN 1 ELSE 0 END) as expired_products,
                AVG(unit_price) as average_unit_price,
                SUM(current_stock * unit_price) as total_inventory_value,
                SUM(current_stock * cost_price) as total_cost_value
            FROM inventory_products
        `
        const result = await db.query(query)
        return result.rows[0]
    },

    async getLowStockProducts(limit = 10) {
        const query = `
            SELECT p.*, 
                   c.name as category_name,
                   s.name as supplier_name
            FROM inventory_products p
            LEFT JOIN inventory_categories c ON p.category_id = c.id
            LEFT JOIN inventory_suppliers s ON p.supplier_id = s.id
            WHERE p.current_stock <= p.min_stock AND p.status = 'active'
            ORDER BY (p.min_stock - p.current_stock) DESC
            LIMIT $1
        `
        const result = await db.query(query, [limit])
        return result.rows
    },

    async getExpiredProducts() {
        const query = `
            SELECT p.*, 
                   c.name as category_name,
                   s.name as supplier_name
            FROM inventory_products p
            LEFT JOIN inventory_categories c ON p.category_id = c.id
            LEFT JOIN inventory_suppliers s ON p.supplier_id = s.id
            WHERE p.expiry_date < CURRENT_DATE AND p.current_stock > 0
            ORDER BY p.expiry_date ASC
        `
        const result = await db.query(query)
        return result.rows
    },

    async getProductsByCategory() {
        const query = `
            SELECT 
                c.name as category_name,
                COUNT(p.id) as product_count,
                SUM(p.current_stock) as total_stock,
                AVG(p.unit_price) as average_price
            FROM inventory_categories c
            LEFT JOIN inventory_products p ON c.id = p.category_id
            GROUP BY c.id, c.name
            ORDER BY product_count DESC
        `
        const result = await db.query(query)
        return result.rows
    },

    async getMovementsByMonth(year) {
        const query = `
            SELECT 
                EXTRACT(MONTH FROM movement_date) as month,
                movement_type,
                COUNT(*) as movement_count,
                SUM(quantity) as total_quantity,
                SUM(quantity * unit_price) as total_value
            FROM inventory_movements
            WHERE EXTRACT(YEAR FROM movement_date) = $1
            GROUP BY EXTRACT(MONTH FROM movement_date), movement_type
            ORDER BY month, movement_type
        `
        const result = await db.query(query, [year])
        return result.rows
    },

    async getTopProducts(limit = 10) {
        const query = `
            SELECT 
                p.name,
                p.sku,
                c.name as category_name,
                p.current_stock,
                p.unit_price,
                (p.current_stock * p.unit_price) as stock_value
            FROM inventory_products p
            LEFT JOIN inventory_categories c ON p.category_id = c.id
            WHERE p.status = 'active'
            ORDER BY stock_value DESC
            LIMIT $1
        `
        const result = await db.query(query, [limit])
        return result.rows
    },

    async getSupplierStatistics() {
        const query = `
            SELECT 
                s.name as supplier_name,
                COUNT(p.id) as product_count,
                SUM(p.current_stock) as total_stock,
                AVG(p.unit_price) as average_price
            FROM inventory_suppliers s
            LEFT JOIN inventory_products p ON s.id = p.supplier_id
            GROUP BY s.id, s.name
            ORDER BY product_count DESC
        `
        const result = await db.query(query)
        return result.rows
    }
} 
