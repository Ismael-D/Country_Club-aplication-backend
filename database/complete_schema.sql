-- Country Club Database Schema - Complete Version
-- Script completo para crear toda la base de datos del sistema
-- Ejecutar este script en PostgreSQL para crear la base de datos completa

-- =====================================================
-- TABLAS PRINCIPALES DEL SISTEMA
-- =====================================================

-- 1. Roles de usuario
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Insertar roles básicos
INSERT INTO roles (name) VALUES 
('admin'),
('manager'),
('event_coordinator')
ON CONFLICT DO NOTHING;

-- 2. Usuarios del sistema
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    DNI INT UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT REFERENCES roles(id),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'suspended')),
    phone VARCHAR(20),
    birth_date DATE
);

-- 3. Empleados
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    DNI INT UNIQUE NOT NULL,
    hire_date DATE NOT NULL,
    position VARCHAR(100) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    phone VARCHAR(20),
    supervisor_id INT REFERENCES employees(id)
);

-- 4. Miembros del club
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    registrator_id INT REFERENCES users(id) NOT NULL,
    DNI INT UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    membership_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'suspended')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    membership_type VARCHAR(50) DEFAULT 'standard',
    emergency_contact VARCHAR(100),
    address TEXT,
    occupation VARCHAR(100),
    company VARCHAR(100)
);

-- Secuencia para membership_number
CREATE SEQUENCE IF NOT EXISTS membership_number_seq START WITH 1000;

-- =====================================================
-- MÓDULO DE EVENTOS
-- =====================================================

-- 5. Tipos de evento
CREATE TABLE IF NOT EXISTS event_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    required_resources TEXT,
    color VARCHAR(7) DEFAULT '#007bff'
);

-- 6. Eventos
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    description TEXT,
    location VARCHAR(200) NOT NULL,
    budget DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    status VARCHAR(20) NOT NULL CHECK (status IN ('scheduled', 'ongoing', 'completed', 'canceled')),
    organizer_id INT REFERENCES users(id) NOT NULL,
    event_type_id INT REFERENCES event_types(id) NOT NULL,
    max_attendees INT,
    current_attendees INT DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    requires_approval BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Recursos para eventos
CREATE TABLE IF NOT EXISTS event_resources (
    id SERIAL PRIMARY KEY,
    event_id INT REFERENCES events(id) ON DELETE CASCADE,
    resource_name VARCHAR(100) NOT NULL,
    quantity_required INT NOT NULL,
    quantity_available INT DEFAULT 0,
    cost_per_unit DECIMAL(10,2),
    supplier_id INT,
    notes TEXT
);

-- 8. Asistencia a eventos
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    event_id INT REFERENCES events(id) ON DELETE CASCADE,
    member_id INT REFERENCES members(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'confirmed', 'canceled', 'attended')),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    UNIQUE(event_id, member_id)
);

-- =====================================================
-- MÓDULO DE INVENTARIO
-- =====================================================

-- 9. Categorías de inventario
CREATE TABLE IF NOT EXISTS inventory_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id INT REFERENCES inventory_categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Proveedores de inventario
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
);

-- 11. Productos de inventario
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
);

-- 12. Movimientos de inventario
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
);

-- 13. Compras de inventario
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
);

-- 14. Items de compra
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
);

-- =====================================================
-- MÓDULO DE MANTENIMIENTO
-- =====================================================

-- 15. Tareas de mantenimiento
CREATE TABLE IF NOT EXISTS maintenance_tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category VARCHAR(100) NOT NULL CHECK (category IN ('electrical', 'plumbing', 'hvac', 'structural', 'landscaping', 'equipment', 'general', 'cleaning', 'security', 'other')),
    location VARCHAR(200) NOT NULL,
    assigned_to INT REFERENCES employees(id),
    reported_by INT REFERENCES users(id),
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    estimated_duration INT,
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    requirements TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. Incidencias
CREATE TABLE IF NOT EXISTS incident_reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200) NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category VARCHAR(100) NOT NULL CHECK (category IN ('electrical', 'plumbing', 'hvac', 'structural', 'landscaping', 'equipment', 'general', 'cleaning', 'security', 'other')),
    status VARCHAR(20) DEFAULT 'reported' CHECK (status IN ('reported', 'assigned', 'in_progress', 'resolved', 'closed')),
    reported_by INT REFERENCES users(id),
    assigned_to INT REFERENCES employees(id),
    reported_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_date TIMESTAMP,
    resolution_notes TEXT
);

-- 17. Equipos
CREATE TABLE IF NOT EXISTS equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN ('herramientas', 'maquinaria', 'electrónicos', 'mobiliario', 'deportivo', 'limpieza', 'seguridad', 'otros')),
    serial_number VARCHAR(100) UNIQUE,
    location VARCHAR(200),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'out_of_service', 'retired')),
    purchase_date DATE,
    warranty_expiry DATE,
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    registered_by INT REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. Mantenimiento preventivo
CREATE TABLE IF NOT EXISTS preventive_maintenance (
    id SERIAL PRIMARY KEY,
    equipment_id INT REFERENCES equipment(id),
    task_description TEXT NOT NULL,
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    next_maintenance_date DATE NOT NULL,
    estimated_duration INT,
    estimated_cost DECIMAL(10,2),
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MÓDULO DE PAGOS Y FINANZAS
-- =====================================================

-- 19. Pagos
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    member_id INT REFERENCES members(id) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'credit_card', 'debit_card', 'bank_transfer')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    invoice_number VARCHAR(50),
    description VARCHAR(255),
    processed_by INT REFERENCES users(id)
);

-- =====================================================
-- MÓDULO DE REPORTES
-- =====================================================

-- 20. Reportes guardados
CREATE TABLE IF NOT EXISTS saved_reports (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    parameters JSONB,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar tipos de evento básicos
INSERT INTO event_types (name, description, required_resources) VALUES
('Conferencia', 'Evento educativo con ponentes', 'Proyector, sonido, sillas'),
('Taller', 'Evento práctico de aprendizaje', 'Mesas, materiales específicos'),
('Social', 'Evento recreativo para socios', 'Barra de bebidas, música')
ON CONFLICT DO NOTHING;

-- Insertar categorías de inventario básicas
INSERT INTO inventory_categories (name, description) VALUES
('Equipos Deportivos', 'Equipos y materiales para actividades deportivas'),
('Mobiliario', 'Muebles y elementos de decoración'),
('Limpieza', 'Productos de limpieza y mantenimiento'),
('Tecnología', 'Equipos electrónicos y tecnológicos'),
('Alimentos y Bebidas', 'Productos para catering y eventos')
ON CONFLICT DO NOTHING;

-- Insertar proveedores básicos
INSERT INTO inventory_suppliers (name, contact_person, phone, email, status) VALUES
('Proveedor General', 'Juan Pérez', '555-1001', 'contacto@proveedor.com', 'active'),
('Equipos Deportivos S.A.', 'María García', '555-1002', 'ventas@deportes.com', 'active'),
('Mobiliario Express', 'Carlos López', '555-1003', 'info@mobiliario.com', 'active')
ON CONFLICT DO NOTHING;

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices de usuarios
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_dni ON users(DNI);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);

-- Índices de miembros
CREATE INDEX IF NOT EXISTS idx_members_dni ON members(DNI);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);

-- Índices de empleados
CREATE INDEX IF NOT EXISTS idx_employees_dni ON employees(DNI);
CREATE INDEX IF NOT EXISTS idx_employees_position ON employees(position);

-- Índices de eventos
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);

-- Índices de asistencia
CREATE INDEX IF NOT EXISTS idx_attendance_event_member ON attendance(event_id, member_id);

-- Índices de inventario
CREATE INDEX IF NOT EXISTS idx_inventory_products_sku ON inventory_products(sku);
CREATE INDEX IF NOT EXISTS idx_inventory_products_category ON inventory_products(category_id);
CREATE INDEX IF NOT EXISTS idx_inventory_products_supplier ON inventory_products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_inventory_products_status ON inventory_products(status);
CREATE INDEX IF NOT EXISTS idx_inventory_products_stock ON inventory_products(current_stock);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_product ON inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_type ON inventory_movements(movement_type);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_date ON inventory_movements(created_at);
CREATE INDEX IF NOT EXISTS idx_inventory_purchases_supplier ON inventory_purchases(supplier_id);
CREATE INDEX IF NOT EXISTS idx_inventory_purchases_status ON inventory_purchases(status);
CREATE INDEX IF NOT EXISTS idx_inventory_purchases_date ON inventory_purchases(order_date);

-- Índices de mantenimiento
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_status ON maintenance_tasks(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_assigned ON maintenance_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_category ON maintenance_tasks(category);

-- Índices de pagos
CREATE INDEX IF NOT EXISTS idx_payments_member_id ON payments(member_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);

-- Índices de reportes
CREATE INDEX IF NOT EXISTS idx_saved_reports_created_by ON saved_reports(created_by);
CREATE INDEX IF NOT EXISTS idx_saved_reports_type ON saved_reports(report_type);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at en eventos
CREATE OR REPLACE FUNCTION update_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para eventos
DROP TRIGGER IF EXISTS trigger_update_events_updated_at ON events;
CREATE TRIGGER trigger_update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_events_updated_at();

-- Función para actualizar updated_at en tareas de mantenimiento
CREATE OR REPLACE FUNCTION update_maintenance_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para tareas de mantenimiento
DROP TRIGGER IF EXISTS trigger_update_maintenance_tasks_updated_at ON maintenance_tasks;
CREATE TRIGGER trigger_update_maintenance_tasks_updated_at
    BEFORE UPDATE ON maintenance_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_maintenance_tasks_updated_at();

-- Función para actualizar contador de asistentes en eventos
CREATE OR REPLACE FUNCTION update_event_attendees()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE events 
        SET current_attendees = current_attendees + 1 
        WHERE id = NEW.event_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE events 
        SET current_attendees = current_attendees - 1 
        WHERE id = OLD.event_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para asistencia
DROP TRIGGER IF EXISTS trigger_update_event_attendees ON attendance;
CREATE TRIGGER trigger_update_event_attendees
    AFTER INSERT OR DELETE ON attendance
    FOR EACH ROW
    EXECUTE FUNCTION update_event_attendees();

-- Función para actualizar updated_at en reportes guardados
CREATE OR REPLACE FUNCTION update_saved_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para reportes guardados
DROP TRIGGER IF EXISTS trigger_update_saved_reports_updated_at ON saved_reports;
CREATE TRIGGER trigger_update_saved_reports_updated_at
    BEFORE UPDATE ON saved_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_saved_reports_updated_at();

-- =====================================================
-- MENSAJE DE COMPLETADO
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Base de datos del Country Club creada exitosamente';
    RAISE NOTICE '📊 Tablas creadas: 20';
    RAISE NOTICE '🔍 Índices creados: 25+';
    RAISE NOTICE '⚙️ Triggers configurados: 4';
    RAISE NOTICE '📝 Datos iniciales insertados';
END $$; 