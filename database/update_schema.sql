-- Script para actualizar la base de datos existente
-- Ejecutar este script después de hacer backup de la base de datos actual

-- =====================================================
-- ACTUALIZAR USUARIOS EXISTENTES
-- =====================================================

-- Eliminar usuarios existentes (si existen)
DELETE FROM employees WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@club.com');
DELETE FROM users WHERE email LIKE '%@club.com';

-- Actualizar estructura de tabla employees si es necesario
ALTER TABLE employees ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS DNI INT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(100);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(20);

-- Eliminar columnas que ya no necesitamos
ALTER TABLE employees DROP COLUMN IF EXISTS user_id;
ALTER TABLE employees DROP COLUMN IF EXISTS department;

-- Renombrar columna emergency_contact si existe
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'employees' AND column_name = 'emergency_contact') THEN
        ALTER TABLE employees RENAME COLUMN emergency_contact TO emergency_contact_name;
    END IF;
END $$;

-- Insertar nuevos usuarios
INSERT INTO users (DNI, first_name, last_name, email, password, role_id, status, phone, birth_date) VALUES
(12345678, 'Ismael', 'Sanchez', 'ismael.sanchez@example.com', '$2a$10$hashedpassword1', 1, 'inactive', '0412-3456789', '1980-01-01'),
(87654321, 'Liliana', 'Sanchez', 'liliana.sanchez@example.com', '$2a$10$hashedpassword2', 2, 'inactive', '0412-9876543', '1985-05-15');

-- Insertar empleados correspondientes
INSERT INTO employees (first_name, last_name, DNI, hire_date, position, salary, emergency_contact_name, emergency_contact_phone, phone) VALUES
('Roberto', 'García', 11223344, '2020-01-15', 'Jefe de Mantenimiento', 3500.00, 'Ana García', '0412-1111111', '0412-3456789'),
('Carlos', 'López', 55667788, '2021-03-10', 'Técnico de Mantenimiento', 2800.00, 'María López', '0412-2222222', '0412-9876543');

-- =====================================================
-- AGREGAR NUEVAS TABLAS
-- =====================================================

-- Tabla de reportes guardados
CREATE TABLE IF NOT EXISTS saved_reports (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    report_type VARCHAR(50) NOT NULL,
    filters JSONB,
    columns JSONB,
    created_by INT REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    member_id INT REFERENCES members(id) NOT NULL,
    space_type VARCHAR(50) NOT NULL, -- 'court', 'room', 'pool', 'gym', 'restaurant'
    space_name VARCHAR(100) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_by INT REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- AGREGAR ÍNDICES
-- =====================================================

-- Índices para saved_reports
CREATE INDEX IF NOT EXISTS idx_saved_reports_created_by ON saved_reports(created_by);
CREATE INDEX IF NOT EXISTS idx_saved_reports_type ON saved_reports(report_type);

-- Índices para reservations
CREATE INDEX IF NOT EXISTS idx_reservations_member_id ON reservations(member_id);
CREATE INDEX IF NOT EXISTS idx_reservations_space_type ON reservations(space_type);
CREATE INDEX IF NOT EXISTS idx_reservations_start_time ON reservations(start_time);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);

-- Índices para employees
CREATE INDEX IF NOT EXISTS idx_employees_dni ON employees(DNI);
CREATE INDEX IF NOT EXISTS idx_employees_position ON employees(position);

-- =====================================================
-- AGREGAR TRIGGERS
-- =====================================================

-- Trigger para actualizar updated_at en saved_reports
CREATE OR REPLACE FUNCTION update_saved_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_saved_reports_updated_at ON saved_reports;
CREATE TRIGGER trigger_update_saved_reports_updated_at
    BEFORE UPDATE ON saved_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_saved_reports_updated_at();

-- Trigger para actualizar updated_at en reservations
CREATE OR REPLACE FUNCTION update_reservations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_reservations_updated_at ON reservations;
CREATE TRIGGER trigger_update_reservations_updated_at
    BEFORE UPDATE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_reservations_updated_at();

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Verificar que los usuarios se crearon correctamente
SELECT 'Usuarios creados:' as info;
SELECT id, first_name, last_name, email, status FROM users WHERE email LIKE '%@example.com';

-- Verificar que las tablas se crearon correctamente
SELECT 'Tablas nuevas creadas:' as info;
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('saved_reports', 'reservations') 
AND table_schema = 'public';

-- Verificar que los índices se crearon correctamente
SELECT 'Índices nuevos creados:' as info;
SELECT indexname FROM pg_indexes 
WHERE tablename IN ('saved_reports', 'reservations'); 