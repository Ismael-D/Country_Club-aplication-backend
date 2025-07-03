import 'dotenv/config';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './database/connection.database.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

console.log('🚀 Setting up Country Club Database...\n');

// Configuración para conectar a PostgreSQL (sin especificar base de datos)
const setupPool = new Pool({
    connectionString: process.env.DATABASE_URL.replace(/\/[^\/]+$/, '/postgres'), // Conectar a postgres por defecto
    allowExitOnIdle: true
});

// Función para crear la base de datos
const createDatabase = async () => {
    try {
        console.log('📊 Creating database "proyecto"...');
        
        // Verificar si la base de datos ya existe
        const checkDbQuery = "SELECT 1 FROM pg_database WHERE datname = 'proyecto'";
        const checkResult = await setupPool.query(checkDbQuery);
        
        if (checkResult.rows.length > 0) {
            console.log('✅ Database "proyecto" already exists');
            return true;
        }
        
        // Crear la base de datos
        await setupPool.query('CREATE DATABASE proyecto');
        console.log('✅ Database "proyecto" created successfully');
        return true;
        
    } catch (error) {
        console.error('❌ Error creating database:', error.message);
        return false;
    }
};

// Función para ejecutar el esquema
const runSchema = async () => {
    try {
        console.log('\n📋 Running database schema...');
        
        // Leer el archivo de esquema
        const schemaPath = path.join(__dirname, 'database', 'complete_schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Conectar a la base de datos proyecto
        const proyectoPool = new Pool({
            connectionString: process.env.DATABASE_URL,
            allowExitOnIdle: true
        });
        
        // Ejecutar el esquema
        await proyectoPool.query(schema);
        console.log('✅ Database schema executed successfully');
        
        await proyectoPool.end();
        return true;
        
    } catch (error) {
        console.error('❌ Error running schema:', error.message);
        return false;
    }
};

// Función principal
const setupDatabase = async () => {
    try {
        // Crear base de datos
        const dbCreated = await createDatabase();
        if (!dbCreated) {
            console.log('❌ Failed to create database');
            return;
        }
        
        // Ejecutar esquema
        const schemaRun = await runSchema();
        if (!schemaRun) {
            console.log('❌ Failed to run schema');
            return;
        }
        
        console.log('\n🎉 Database setup completed successfully!');
        console.log('📊 Database: proyecto');
        console.log('🔗 Connection: DATABASE_URL');
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
    } finally {
        await setupPool.end();
    }
};

// Ejecutar setup
setupDatabase();

async function setupCompleteDatabase() {
    try {
        console.log('🗄️ Configurando base de datos completa del Country Club...')
        console.log('='.repeat(60))
        
        // Leer el archivo SQL completo
        const sqlPath = path.join(process.cwd(), 'database', 'complete_schema.sql')
        const sqlContent = fs.readFileSync(sqlPath, 'utf8')
        
        console.log('📝 Ejecutando esquema completo...')
        
        // Ejecutar el SQL completo
        await db.query(sqlContent)
        
        console.log('✅ Esquema completo ejecutado correctamente')
        
        // Verificar tablas principales
        console.log('\n🔍 Verificando tablas principales...')
        const mainTables = [
            'users', 'roles', 'employees', 'members', 
            'events', 'event_types', 'attendance',
            'inventory_products', 'inventory_categories', 'inventory_suppliers',
            'maintenance_tasks', 'incident_reports', 'equipment',
            'payments', 'saved_reports'
        ]
        
        for (const table of mainTables) {
            try {
                const result = await db.query(`SELECT COUNT(*) FROM ${table}`)
                console.log(`✅ Tabla ${table}: ${result.rows[0].count} registros`)
            } catch (error) {
                console.log(`❌ Tabla ${table}: ${error.message}`)
            }
        }
        
        console.log('\n🎉 Base de datos configurada completamente')
        console.log('📊 Total de tablas verificadas:', mainTables.length)
        
    } catch (error) {
        console.error('❌ Error configurando base de datos:', error)
    } finally {
        await db.end()
    }
}

setupCompleteDatabase() 