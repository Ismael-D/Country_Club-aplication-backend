import { db } from './database/connection.database.js'

async function createInventoryTables() {
    try {
        console.log('🔧 Creando tablas de inventario...')
        
        // 1. Categorías de inventario
        await db.query(`
            CREATE TABLE IF NOT EXISTS inventory_categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                parent_category_id INT REFERENCES inventory_categories(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `)
        console.log('✅ Tabla inventory_categories creada')

        // 2. Proveedores de inventario
        await db.query(`
            CREATE TABLE IF NOT EXISTS inventory_suppliers (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                contact_person VARCHAR(100),
                phone VARCHAR(20),
                email VARCHAR(100) UNIQUE,
                address TEXT,
                tax_id VARCHAR(50),
                payment_terms VARCHAR(100),
                status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
                created_by INT REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `)
        console.log('✅ Tabla inventory_suppliers creada')

        // 3. Productos de inventario
        await db.query(`
            CREATE TABLE IF NOT EXISTS inventory_products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(200) NOT NULL,
                description TEXT,
                sku VARCHAR(50) UNIQUE,
                category_id INT REFERENCES inventory_categories(id),
                supplier_id INT REFERENCES inventory_suppliers(id),
                unit_price DECIMAL(10,2) NOT NULL,
                cost_price DECIMAL(10,2),
                min_stock INT DEFAULT 0,
                max_stock INT,
                current_stock INT DEFAULT 0,
                unit_of_measure VARCHAR(20) NOT NULL CHECK (unit_of_measure IN ('units', 'kg', 'liters', 'meters', 'boxes', 'pairs', 'sets', 'pieces', 'bottles', 'cans', 'bags', 'rolls', 'sheets', 'other')),
                barcode VARCHAR(50),
                location VARCHAR(100),
                expiry_date DATE,
                status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
                created_by INT REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `)
        console.log('✅ Tabla inventory_products creada')

        // 4. Movimientos de inventario
        await db.query(`
            CREATE TABLE IF NOT EXISTS inventory_movements (
                id SERIAL PRIMARY KEY,
                product_id INT REFERENCES inventory_products(id) NOT NULL,
                movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment', 'transfer')),
                quantity INT NOT NULL,
                previous_stock INT NOT NULL,
                new_stock INT NOT NULL,
                reference_number VARCHAR(50),
                reference_type VARCHAR(50),
                notes TEXT,
                created_by INT REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `)
        console.log('✅ Tabla inventory_movements creada')

        // 5. Compras de inventario
        await db.query(`
            CREATE TABLE IF NOT EXISTS inventory_purchases (
                id SERIAL PRIMARY KEY,
                supplier_id INT REFERENCES inventory_suppliers(id) NOT NULL,
                purchase_number VARCHAR(50) UNIQUE,
                total_amount DECIMAL(10,2) NOT NULL,
                status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'ordered', 'received', 'cancelled')),
                order_date DATE,
                expected_delivery_date DATE,
                actual_delivery_date DATE,
                notes TEXT,
                created_by INT REFERENCES users(id),
                approved_by INT REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `)
        console.log('✅ Tabla inventory_purchases creada')

        // 6. Items de compra
        await db.query(`
            CREATE TABLE IF NOT EXISTS inventory_purchase_items (
                id SERIAL PRIMARY KEY,
                purchase_id INT REFERENCES inventory_purchases(id) NOT NULL,
                product_id INT REFERENCES inventory_products(id),
                product_name VARCHAR(200) NOT NULL,
                quantity INT NOT NULL,
                unit_price DECIMAL(10,2) NOT NULL,
                total_price DECIMAL(10,2) NOT NULL,
                received_quantity INT DEFAULT 0,
                notes TEXT
            )
        `)
        console.log('✅ Tabla inventory_purchase_items creada')

        console.log('🎉 Todas las tablas de inventario creadas correctamente')
        
    } catch (error) {
        console.error('❌ Error creando tablas:', error)
    } finally {
        await db.end()
    }
}

createInventoryTables() 