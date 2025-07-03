import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function checkTableStructure() {
  try {
    // Verificar estructura de maintenance_tasks
    const tasksStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'maintenance_tasks'
      ORDER BY ordinal_position;
    `)
    console.log('maintenance_tasks structure:')
    tasksStructure.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`)
    })
    
    // Verificar estructura de incident_reports
    const incidentsStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'incident_reports'
      ORDER BY ordinal_position;
    `)
    console.log('\nincident_reports structure:')
    incidentsStructure.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`)
    })
    
    // Verificar estructura de maintenance_materials
    const materialsStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'maintenance_materials'
      ORDER BY ordinal_position;
    `)
    console.log('\nmaintenance_materials structure:')
    materialsStructure.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await pool.end()
  }
}

checkTableStructure() 