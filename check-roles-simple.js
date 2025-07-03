import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function checkRoles() {
  try {
    const rolesResult = await pool.query('SELECT * FROM roles')
    console.log('Roles disponibles:', rolesResult.rows)
    
    const usersResult = await pool.query(`
      SELECT u.id, u.email, r.name as role_name 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id
    `)
    console.log('Usuarios con roles:', usersResult.rows)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await pool.end()
  }
}

checkRoles() 