import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function checkMaintenanceTables() {
  try {
    // Verificar si la tabla maintenance_tasks existe
    const tasksResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'maintenance_tasks'
      );
    `)
    console.log('maintenance_tasks table exists:', tasksResult.rows[0].exists)

    // Verificar si la tabla maintenance_incidents existe
    const incidentsResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'maintenance_incidents'
      );
    `)
    console.log('maintenance_incidents table exists:', incidentsResult.rows[0].exists)

    // Verificar si la tabla maintenance_equipment existe
    const equipmentResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'maintenance_equipment'
      );
    `)
    console.log('maintenance_equipment table exists:', equipmentResult.rows[0].exists)

    // Verificar si la tabla maintenance_preventive existe
    const preventiveResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'maintenance_preventive'
      );
    `)
    console.log('maintenance_preventive table exists:', preventiveResult.rows[0].exists)

    // Listar todas las tablas que empiecen con 'maintenance'
    const allMaintenanceTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'maintenance%'
      ORDER BY table_name;
    `)
    console.log('All maintenance tables:', allMaintenanceTables.rows.map(r => r.table_name))

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await pool.end()
  }
}

checkMaintenanceTables() 