import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function checkAllTables() {
  try {
    // Listar todas las tablas
    const allTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `)
    console.log('All tables in database:')
    allTables.rows.forEach(row => console.log(`- ${row.table_name}`))
    
    // Verificar tablas específicas de mantenimiento
    console.log('\nChecking maintenance-related tables:')
    const maintenanceTables = allTables.rows.filter(row => 
      row.table_name.includes('maintenance') || 
      row.table_name.includes('incident') || 
      row.table_name.includes('equipment')
    )
    maintenanceTables.forEach(row => console.log(`- ${row.table_name}`))

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await pool.end()
  }
}

checkAllTables() 