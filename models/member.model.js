import { db } from '../database/connection.database.js'

const create = async ({ registrator_id, DNI, first_name, last_name, phone, email, status = "active", start_date, end_date }) => {
    try {
        // Generar membership_number automáticamente
        const membershipQuery = "SELECT nextval('membership_number_seq') as next_num"
        const membershipResult = await db.query(membershipQuery)
        const membershipNumber = `MEM-${membershipResult.rows[0].next_num}`
        
        const query = `
            INSERT INTO members (registrator_id, DNI, first_name, last_name, phone, email, membership_number, status, start_date, end_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id, registrator_id, DNI, first_name, last_name, phone, email, membership_number, status, start_date, end_date, registration_date
        `
        
        const values = [registrator_id, DNI, first_name, last_name, phone, email, membershipNumber, status, start_date, end_date]
        const result = await db.query(query, values)
        
        return result.rows[0]
    } catch (error) {
        throw new Error(`Error creating member: ${error.message}`)
    }
}

const findAll = async () => {
    try {
        const query = `
            SELECT m.id, m.registrator_id, m.DNI, m.first_name, m.last_name, m.phone, m.email, 
                   m.membership_number, m.status, m.start_date, m.end_date, m.registration_date,
                   u.first_name as registrator_first_name, u.last_name as registrator_last_name
            FROM members m
            LEFT JOIN users u ON m.registrator_id = u.id
            ORDER BY m.id
        `
        const result = await db.query(query)
        return result.rows
    } catch (error) {
        throw new Error(`Error finding all members: ${error.message}`)
    }
}

const findOneById = async (id) => {
    try {
        const query = `
            SELECT m.id, m.registrator_id, m.DNI, m.first_name, m.last_name, m.phone, m.email, 
                   m.membership_number, m.status, m.start_date, m.end_date, m.registration_date,
                   u.first_name as registrator_first_name, u.last_name as registrator_last_name
            FROM members m
            LEFT JOIN users u ON m.registrator_id = u.id
            WHERE m.id = $1
        `
        const result = await db.query(query, [id])
        return result.rows[0] || null
    } catch (error) {
        throw new Error(`Error finding member by id: ${error.message}`)
    }
}

const update = async (id, data) => {
    try {
        // Construir la consulta dinámicamente basada en los campos proporcionados
        const fields = Object.keys(data)
        if (fields.length === 0) {
            throw new Error('No fields to update')
        }
        
        const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ')
        const query = `
            UPDATE members 
            SET ${setClause}
            WHERE id = $1
            RETURNING id, registrator_id, DNI, first_name, last_name, phone, email, membership_number, status, start_date, end_date, registration_date
        `
        
        const values = [id, ...fields.map(field => data[field])]
        const result = await db.query(query, values)
        
        return result.rows[0] || null
    } catch (error) {
        throw new Error(`Error updating member: ${error.message}`)
    }
}

const remove = async (id) => {
    try {
        const query = 'DELETE FROM members WHERE id = $1 RETURNING id'
        const result = await db.query(query, [id])
        return result.rows.length > 0
    } catch (error) {
        throw new Error(`Error removing member: ${error.message}`)
    }
}

export const MemberModel = {
    create,
    findAll,
    findOneById,
    update,
    remove
}