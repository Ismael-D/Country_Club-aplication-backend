import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg

const connectionString = process.env.DATABASE_URL

export const db = new Pool({
    connectionString,
    allowExitOnIdle: true,
    max: 20, // máximo 20 conexiones
    idleTimeoutMillis: 30000, // cerrar conexiones inactivas después de 30 segundos
    connectionTimeoutMillis: 2000, // timeout de conexión de 2 segundos
});

// Función para probar la conexión
export const testConnection = async () => {
    try {
        const result = await db.query('SELECT NOW() as current_time, version() as db_version, current_database() as db_name');
        console.log('✅ DATABASE connected successfully');
        console.log(`📅 Current time: ${result.rows[0].current_time}`);
        console.log(`🗄️ Database: ${result.rows[0].db_version.split(' ')[0]} ${result.rows[0].db_version.split(' ')[1]}`);
        console.log(`📊 Connected to: ${result.rows[0].db_name}`);
        return true;
    } catch (error) {
        console.error('❌ DATABASE connection failed:', error.message);
        console.error('🔧 Check your DATABASE_URL in .env file');
        return false;
    }
};

// Probar conexión al importar el módulo
testConnection();