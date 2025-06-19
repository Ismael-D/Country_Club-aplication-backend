import { db } from '../database/connection.database.js'

const create = async ({ name, date, description, location, budget, actual_cost, status, organizer_id, event_type_id, max_attendees }) => {
    const query = `
        INSERT INTO events (name, date, description, location, budget, actual_cost, status, organizer_id, event_type_id, max_attendees)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
    `
    const values = [name, date, description, location, budget, actual_cost, status, organizer_id, event_type_id, max_attendees]
    const result = await db.query(query, values)
    return result.rows[0]
}

const findAll = async () => {
    const query = `
        SELECT e.*, u.first_name as organizer_first_name, u.last_name as organizer_last_name, et.name as event_type_name
        FROM events e
        JOIN users u ON e.organizer_id = u.id
        JOIN event_types et ON e.event_type_id = et.id
        ORDER BY e.date DESC
    `
    const result = await db.query(query)
    return result.rows
}

const findOneById = async (id) => {
    const query = `
        SELECT e.*, u.first_name as organizer_first_name, u.last_name as organizer_last_name, et.name as event_type_name
        FROM events e
        JOIN users u ON e.organizer_id = u.id
        JOIN event_types et ON e.event_type_id = et.id
        WHERE e.id = $1
    `
    const result = await db.query(query, [id])
    return result.rows[0] || null
}

const update = async (id, data) => {
    const fields = Object.keys(data)
    if (fields.length === 0) throw new Error('No fields to update')
    const setClause = fields.map((field, idx) => `${field} = $${idx + 2}`).join(', ')
    const query = `
        UPDATE events SET ${setClause} WHERE id = $1 RETURNING *
    `
    const values = [id, ...fields.map(f => data[f])]
    const result = await db.query(query, values)
    return result.rows[0] || null
}

const remove = async (id) => {
    const query = 'DELETE FROM events WHERE id = $1 RETURNING id'
    const result = await db.query(query, [id])
    return result.rows.length > 0
}

export const EventModel = {
    create,
    findAll,
    findOneById,
    update,
    remove
} 