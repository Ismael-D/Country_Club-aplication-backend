import 'dotenv/config';
import { testConnection, db } from './database/connection.database.js';

console.log('🔍 Testing Database Connection...\n');

// Mostrar configuración actual
console.log('📋 Current Database Configuration:');
console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '***SET***' : '***NOT SET***'}`);
console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);

// Probar conexión
const isConnected = await testConnection();

if (isConnected) {
    console.log('\n✅ Database connection test completed successfully!');
    
    // Probar algunas consultas básicas
    try {
        console.log('\n🔍 Testing basic queries...');
        
        // Verificar si las tablas principales existen
        const tablesQuery = `
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('users', 'members', 'employees', 'events', 'maintenance_tasks')
            ORDER BY table_name
        `;
        
        const tablesResult = await db.query(tablesQuery);
        console.log('📊 Existing tables:');
        tablesResult.rows.forEach(row => {
            console.log(`   ✅ ${row.table_name}`);
        });
        
        // Contar registros en tablas principales
        console.log('\n📈 Record counts:');
        const countQueries = [
            'SELECT COUNT(*) as count FROM users',
            'SELECT COUNT(*) as count FROM members',
            'SELECT COUNT(*) as count FROM employees',
            'SELECT COUNT(*) as count FROM events',
            'SELECT COUNT(*) as count FROM maintenance_tasks'
        ];
        
        for (const query of countQueries) {
            try {
                const result = await db.query(query);
                const tableName = query.split('FROM ')[1];
                console.log(`   ${tableName}: ${result.rows[0].count} records`);
            } catch (error) {
                console.log(`   ${query.split('FROM ')[1]}: Table not found`);
            }
        }
        
    } catch (error) {
        console.error('❌ Error testing queries:', error.message);
    }
    
} else {
    console.log('\n❌ Database connection test failed!');
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check if PostgreSQL is running');
    console.log('2. Verify DATABASE_URL in .env file');
    console.log('3. Ensure database "proyecto" exists');
    console.log('4. Check if user has proper permissions');
    console.log('5. Verify network connectivity to database server');
}

// Cerrar conexión
await db.end();
console.log('\n🔌 Database connection closed.'); 