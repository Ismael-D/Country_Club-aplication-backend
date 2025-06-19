import bcrypt from 'bcryptjs'
import { db } from '../database/connection.database.js'

const create = async ({ first_name, last_name, email, phone, DNI, password, role_id = 3, status = "active", birth_date }) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const query = `
            INSERT INTO users (DNI, first_name, last_name, email, password, role_id, status, phone, birth_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id, DNI, first_name, last_name, email, role_id, status, phone, birth_date, registration_date
        `
        
        const values = [DNI, first_name, last_name, email, hashedPassword, role_id, status, phone, birth_date]
        const result = await db.query(query, values)
        
        // Get the created user with role_name
        const userWithRole = await findOneById(result.rows[0].id)
        
        return userWithRole
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`)
    }
}

const findOneByEmail = async (email) => {
    try {
        const query = `
            SELECT u.id, u.DNI, u.first_name, u.last_name, u.email, u.password, u.role_id, 
                   u.status, u.phone, u.birth_date, u.registration_date, r.name as role_name
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.email = $1
        `
        const result = await db.query(query, [email])
        return result.rows[0] || null
    } catch (error) {
        throw new Error(`Error finding user by email: ${error.message}`)
    }
}

const findOneById = async (id) => {
    try {
        const query = `
            SELECT u.id, u.DNI, u.first_name, u.last_name, u.email, u.role_id, 
                   u.status, u.phone, u.birth_date, u.registration_date, r.name as role_name
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = $1
        `
        const result = await db.query(query, [id])
        return result.rows[0] || null
    } catch (error) {
        throw new Error(`Error finding user by id: ${error.message}`)
    }
}

const findAll = async () => {
    try {
        const query = `
            SELECT u.id, u.DNI, u.first_name, u.last_name, u.email, u.role_id, 
                   u.status, u.phone, u.birth_date, u.registration_date, r.name as role_name
            FROM users u
            JOIN roles r ON u.role_id = r.id
            ORDER BY u.id
        `
        const result = await db.query(query)
        return result.rows
    } catch (error) {
        throw new Error(`Error finding all users: ${error.message}`)
    }
}

const updateRole = async (id, role_id) => {
    try {
        console.log('[updateRole] id:', id, 'role_id:', role_id)
        const query = `
            UPDATE users 
            SET role_id = $2
            WHERE id = $1
            RETURNING id
        `
        const result = await db.query(query, [id, role_id])
        console.log('[updateRole] result.rows:', result.rows)
        if (result.rows.length === 0) return null
        // Get the updated user with role_name
        return await findOneById(id)
    } catch (error) {
        throw new Error(`Error updating user role: ${error.message}`)
    }
}

const updateStatus = async (id, status) => {
    try {
        const query = `
            UPDATE users 
            SET status = $2
            WHERE id = $1
            RETURNING id
        `
        const result = await db.query(query, [id, status])
        
        if (result.rows.length === 0) return null
        
        // Get the updated user with role_name
        return await findOneById(id)
    } catch (error) {
        throw new Error(`Error updating user status: ${error.message}`)
    }
}

const remove = async (id) => {
    try {
        const query = 'DELETE FROM users WHERE id = $1 RETURNING id'
        const result = await db.query(query, [id])
        return result.rows.length > 0
    } catch (error) {
        throw new Error(`Error removing user: ${error.message}`)
    }
}

export const UserModel = {
    create,
    findOneByEmail,
    findOneById,
    findAll,
    updateRole,
    updateStatus,
    remove
}