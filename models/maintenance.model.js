import { db } from '../database/connection.database.js'

export const MaintenanceModel = {
    // =====================================================
    // MÉTODOS CRUD BÁSICOS DE TAREAS DE MANTENIMIENTO
    // =====================================================

    async create(taskData) {
        const {
            title,
            description,
            priority = 'medium',
            category,
            location,
            assigned_to,
            scheduled_date,
            estimated_cost,
            requested_by
        } = taskData

        const query = `
            INSERT INTO maintenance_tasks (
                title, description, priority, category, location,
                assigned_to, scheduled_date, estimated_cost, requested_by,
                status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
            RETURNING *
        `

        const values = [
            title, description, priority, category, location,
            assigned_to, scheduled_date, estimated_cost, requested_by
        ]

        const result = await db.query(query, values)
        return result.rows[0]
    },

    async findById(id) {
        const query = `
            SELECT mt.*, 
                   u1.first_name as requested_by_first_name,
                   u1.last_name as requested_by_last_name,
                   u2.first_name as assigned_to_first_name,
                   u2.last_name as assigned_to_last_name
            FROM maintenance_tasks mt
            LEFT JOIN users u1 ON mt.requested_by = u1.id
            LEFT JOIN users u2 ON mt.assigned_to = u2.id
            WHERE mt.id = $1
        `
        const result = await db.query(query, [id])
        return result.rows[0]
    },

    async update(id, updateData) {
        const fields = Object.keys(updateData)
        const values = Object.values(updateData)
        
        const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ')
        const query = `
            UPDATE maintenance_tasks 
            SET ${setClause}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `

        const result = await db.query(query, [id, ...values])
        return result.rows[0]
    },

    async remove(id) {
        const query = 'DELETE FROM maintenance_tasks WHERE id = $1 RETURNING *'
        const result = await db.query(query, [id])
        return result.rows[0]
    },

    // =====================================================
    // MÉTODOS DE BÚSQUEDA Y FILTRADO DE TAREAS
    // =====================================================

    async findAllWithPagination(limit, offset, filters = {}) {
        let query = `
            SELECT mt.*, 
                   u1.first_name as requested_by_first_name,
                   u1.last_name as requested_by_last_name,
                   u2.first_name as assigned_to_first_name,
                   u2.last_name as assigned_to_last_name
            FROM maintenance_tasks mt
            LEFT JOIN users u1 ON mt.requested_by = u1.id
            LEFT JOIN users u2 ON mt.assigned_to = u2.id
            WHERE 1=1
        `
        
        const values = []
        let valueIndex = 1

        // Aplicar filtros
        if (filters.status) {
            query += ` AND mt.status = $${valueIndex}`
            values.push(filters.status)
            valueIndex++
        }

        if (filters.priority) {
            query += ` AND mt.priority = $${valueIndex}`
            values.push(filters.priority)
            valueIndex++
        }

        if (filters.category) {
            query += ` AND mt.category = $${valueIndex}`
            values.push(filters.category)
            valueIndex++
        }

        if (filters.assigned_to) {
            query += ` AND mt.assigned_to = $${valueIndex}`
            values.push(filters.assigned_to)
            valueIndex++
        }

        if (filters.date_from) {
            query += ` AND mt.scheduled_date >= $${valueIndex}`
            values.push(filters.date_from)
            valueIndex++
        }

        if (filters.date_to) {
            query += ` AND mt.scheduled_date <= $${valueIndex}`
            values.push(filters.date_to)
            valueIndex++
        }

        // Contar total
        const countQuery = 'SELECT COUNT(*) FROM maintenance_tasks'
        const countResult = await db.query(countQuery)
        const total = parseInt(countResult.rows[0].count)

        // Aplicar ordenamiento y paginación
        query += ` ORDER BY mt.priority DESC, mt.scheduled_date ASC LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`
        values.push(limit, offset)

        const result = await db.query(query, values)
        
        return {
            tasks: result.rows,
            total
        }
    },

    async search(searchTerm, limit, offset) {
        const query = `
            SELECT mt.*, 
                   u1.first_name as requested_by_first_name,
                   u1.last_name as requested_by_last_name,
                   u2.first_name as assigned_to_first_name,
                   u2.last_name as assigned_to_last_name
            FROM maintenance_tasks mt
            LEFT JOIN users u1 ON mt.requested_by = u1.id
            LEFT JOIN users u2 ON mt.assigned_to = u2.id
            WHERE mt.title ILIKE $1 
               OR mt.description ILIKE $1 
               OR mt.location ILIKE $1
               OR mt.category ILIKE $1
            ORDER BY mt.priority DESC, mt.scheduled_date ASC
            LIMIT $2 OFFSET $3
        `

        const countQuery = `
            SELECT COUNT(*) FROM maintenance_tasks 
            WHERE title ILIKE $1 
               OR description ILIKE $1 
               OR location ILIKE $1
               OR category ILIKE $1
        `

        const searchPattern = `%${searchTerm}%`
        
        const [result, countResult] = await Promise.all([
            db.query(query, [searchPattern, limit, offset]),
            db.query(countQuery, [searchPattern])
        ])

        const total = parseInt(countResult.rows[0].count)

        return {
            tasks: result.rows,
            total
        }
    },

    async getPendingTasks(limit = 10) {
        const query = `
            SELECT mt.*, 
                   u1.first_name as requested_by_first_name,
                   u1.last_name as requested_by_last_name,
                   u2.first_name as assigned_to_first_name,
                   u2.last_name as assigned_to_last_name
            FROM maintenance_tasks mt
            LEFT JOIN users u1 ON mt.requested_by = u1.id
            LEFT JOIN users u2 ON mt.assigned_to = u2.id
            WHERE mt.status = 'pending'
            ORDER BY mt.priority DESC, mt.scheduled_date ASC
            LIMIT $1
        `
        const result = await db.query(query, [limit])
        return result.rows
    },

    async getOverdueTasks() {
        const query = `
            SELECT mt.*, 
                   u1.first_name as requested_by_first_name,
                   u1.last_name as requested_by_last_name,
                   u2.first_name as assigned_to_first_name,
                   u2.last_name as assigned_to_last_name
            FROM maintenance_tasks mt
            LEFT JOIN users u1 ON mt.requested_by = u1.id
            LEFT JOIN users u2 ON mt.assigned_to = u2.id
            WHERE mt.status IN ('pending', 'in_progress')
            AND mt.scheduled_date < CURRENT_DATE
            ORDER BY mt.scheduled_date ASC
        `
        const result = await db.query(query)
        return result.rows
    },

    // =====================================================
    // MÉTODOS DE INCIDENCIAS
    // =====================================================

    async getIncidentsWithPagination(limit, offset, filters = {}) {
        let query = `
            SELECT i.*, 
                   u.first_name as reported_by_first_name,
                   u.last_name as reported_by_last_name
            FROM incident_reports i
            LEFT JOIN users u ON i.reported_by = u.id
            WHERE 1=1
        `
        
        const values = []
        let valueIndex = 1

        // Aplicar filtros
        if (filters.priority) {
            query += ` AND i.priority = $${valueIndex}`
            values.push(filters.priority)
            valueIndex++
        }

        if (filters.status) {
            query += ` AND i.status = $${valueIndex}`
            values.push(filters.status)
            valueIndex++
        }

        if (filters.location) {
            query += ` AND i.location = $${valueIndex}`
            values.push(filters.location)
            valueIndex++
        }

        // Contar total
        const countQuery = 'SELECT COUNT(*) FROM incident_reports'
        const countResult = await db.query(countQuery)
        const total = parseInt(countResult.rows[0].count)

        // Aplicar ordenamiento y paginación
        query += ` ORDER BY i.priority DESC, i.incident_date DESC LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`
        values.push(limit, offset)

        const result = await db.query(query, values)
        
        return {
            incidents: result.rows,
            total
        }
    },

    async createIncident(incidentData) {
        const {
            title,
            description,
            priority = 'medium',
            location,
            equipment_id,
            reported_by,
            witnesses,
            damage_assessment,
            immediate_actions,
            notes
        } = incidentData

        const query = `
            INSERT INTO incident_reports (
                title, description, priority, location, equipment_id,
                reported_by, witnesses, damage_assessment, immediate_actions,
                notes, status, incident_date
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'open', CURRENT_TIMESTAMP)
            RETURNING *
        `

        const values = [
            title, description, priority, location, equipment_id,
            reported_by, witnesses, damage_assessment, immediate_actions, notes
        ]
        const result = await db.query(query, values)
        return result.rows[0]
    },

    // =====================================================
    // MÉTODOS DE EQUIPOS Y HERRAMIENTAS
    // =====================================================

    async getEquipmentWithPagination(limit, offset, filters = {}) {
        let query = `
            SELECT e.*, 
                   u.first_name as assigned_to_first_name,
                   u.last_name as assigned_to_last_name
            FROM maintenance_materials e
            LEFT JOIN users u ON e.assigned_to = u.id
            WHERE 1=1
        `
        
        const values = []
        let valueIndex = 1

        // Aplicar filtros
        if (filters.type) {
            query += ` AND e.type = $${valueIndex}`
            values.push(filters.type)
            valueIndex++
        }

        if (filters.status) {
            query += ` AND e.status = $${valueIndex}`
            values.push(filters.status)
            valueIndex++
        }

        if (filters.assigned_to) {
            query += ` AND e.assigned_to = $${valueIndex}`
            values.push(filters.assigned_to)
            valueIndex++
        }

        // Contar total
        const countQuery = 'SELECT COUNT(*) FROM maintenance_materials'
        const countResult = await db.query(countQuery)
        const total = parseInt(countResult.rows[0].count)

        // Aplicar ordenamiento y paginación
        query += ` ORDER BY e.name ASC LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`
        values.push(limit, offset)

        const result = await db.query(query, values)
        
        return {
            equipment: result.rows,
            total
        }
    },

    async createEquipment(equipmentData) {
        const {
            name,
            type,
            model,
            serial_number,
            purchase_date,
            warranty_expiry,
            assigned_to,
            location,
            status = 'available',
            notes
        } = equipmentData

        const query = `
            INSERT INTO maintenance_materials (
                name, type, model, serial_number, purchase_date,
                warranty_expiry, assigned_to, location, status, notes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `

        const values = [
            name, type, model, serial_number, purchase_date,
            warranty_expiry, assigned_to, location, status, notes
        ]
        const result = await db.query(query, values)
        return result.rows[0]
    },

    async updateEquipment(id, updateData) {
        const fields = Object.keys(updateData)
        const values = Object.values(updateData)
        
        const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ')
        const query = `
            UPDATE maintenance_materials 
            SET ${setClause}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `

        const result = await db.query(query, [id, ...values])
        return result.rows[0]
    },

    // =====================================================
    // MÉTODOS DE MANTENIMIENTO PREVENTIVO
    // =====================================================

    async getPreventiveMaintenanceWithPagination(limit, offset, filters = {}) {
        let query = `
            SELECT pm.*, 
                   u.first_name as assigned_to_first_name,
                   u.last_name as assigned_to_last_name
            FROM maintenance_tasks pm
            LEFT JOIN users u ON pm.assigned_to = u.id
            WHERE pm.category = 'preventive'
            AND 1=1
        `
        
        const values = []
        let valueIndex = 1

        // Aplicar filtros
        if (filters.status) {
            query += ` AND pm.status = $${valueIndex}`
            values.push(filters.status)
            valueIndex++
        }

        if (filters.frequency) {
            query += ` AND pm.frequency = $${valueIndex}`
            values.push(filters.frequency)
            valueIndex++
        }

        if (filters.date_from) {
            query += ` AND pm.scheduled_date >= $${valueIndex}`
            values.push(filters.date_from)
            valueIndex++
        }

        if (filters.date_to) {
            query += ` AND pm.scheduled_date <= $${valueIndex}`
            values.push(filters.date_to)
            valueIndex++
        }

        // Contar total
        const countQuery = 'SELECT COUNT(*) FROM maintenance_tasks WHERE category = \'preventive\''
        const countResult = await db.query(countQuery)
        const total = parseInt(countResult.rows[0].count)

        // Aplicar ordenamiento y paginación
        query += ` ORDER BY pm.scheduled_date ASC LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`
        values.push(limit, offset)

        const result = await db.query(query, values)
        
        return {
            preventive: result.rows,
            total
        }
    },

    async createPreventiveMaintenance(preventiveData) {
        const {
            title,
            description,
            frequency,
            next_scheduled_date,
            assigned_to,
            estimated_duration,
            estimated_cost,
            requirements,
            notes,
            requested_by
        } = preventiveData

        const query = `
            INSERT INTO maintenance_tasks (
                title, description, category, frequency, scheduled_date,
                assigned_to, estimated_duration, estimated_cost,
                requirements, notes, requested_by, status
            ) VALUES ($1, $2, 'preventive', $3, $4, $5, $6, $7, $8, $9, $10, 'scheduled')
            RETURNING *
        `

        const values = [
            title, description, frequency, next_scheduled_date,
            assigned_to, estimated_duration, estimated_cost,
            requirements, notes, requested_by
        ]
        const result = await db.query(query, values)
        return result.rows[0]
    },

    // =====================================================
    // MÉTODOS DE ESTADÍSTICAS
    // =====================================================

    async getStatistics() {
        const query = `
            SELECT 
                COUNT(*) as total_tasks,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_tasks,
                COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
                COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority_tasks,
                COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as urgent_tasks,
                AVG(estimated_cost) as avg_estimated_cost,
                AVG(actual_cost) as avg_actual_cost
            FROM maintenance_tasks
        `
        const result = await db.query(query)
        return result.rows[0]
    },

    async getTasksByCategory() {
        const query = `
            SELECT 
                category,
                COUNT(*) as total_tasks,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_tasks
            FROM maintenance_tasks
            GROUP BY category
            ORDER BY total_tasks DESC
        `
        const result = await db.query(query)
        return result.rows
    },

    async getTasksByMonth(year) {
        const query = `
            SELECT 
                EXTRACT(MONTH FROM scheduled_date) as month,
                COUNT(*) as total_tasks,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks
            FROM maintenance_tasks
            WHERE EXTRACT(YEAR FROM scheduled_date) = $1
            GROUP BY EXTRACT(MONTH FROM scheduled_date)
            ORDER BY month
        `
        const result = await db.query(query, [year])
        return result.rows
    },

    async getEquipmentStatistics() {
        const query = `
            SELECT 
                COUNT(*) as total_equipment,
                COUNT(CASE WHEN status = 'available' THEN 1 END) as available_equipment,
                COUNT(CASE WHEN status = 'in_use' THEN 1 END) as in_use_equipment,
                COUNT(CASE WHEN status = 'maintenance' THEN 1 END) as maintenance_equipment
            FROM maintenance_materials
        `
        const result = await db.query(query)
        return result.rows[0]
    },

    async getIncidentStatistics() {
        const query = `
            SELECT 
                COUNT(*) as total_incidents,
                COUNT(CASE WHEN status = 'open' THEN 1 END) as open_incidents,
                COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_incidents,
                COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority_incidents,
                COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as urgent_incidents
            FROM incident_reports
        `
        const result = await db.query(query)
        return result.rows[0]
    }
} 
