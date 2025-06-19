-- Country Club Database Schema
-- Ejecutar este script en PostgreSQL para crear la base de datos completa

-- 1. Crear tabla de roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Insertar roles básicos
INSERT INTO roles (name) VALUES 
('admin'),
('manager'),
('event_coordinator');

-- 2. Crear tabla de usuarios
CREATE TABLE users (
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

-- Insertar usuarios de ejemplo (las contraseñas están hasheadas con bcrypt)
INSERT INTO users (DNI, first_name, last_name, email, password, role_id, status, phone, birth_date) VALUES
(10000001, 'Admin', 'Sistema', 'admin@club.com', '$2a$10$hashedpassword1', 1, 'active', '555-1001', '1980-01-01'),
(10000002, 'Gerente', 'Club', 'manager@club.com', '$2a$10$hashedpassword2', 2, 'active', '555-1002', '1985-05-15'),
(10000003, 'Coordinador', 'Eventos', 'events@club.com', '$2a$10$hashedpassword3', 3, 'active', '555-1003', '1990-10-20');

-- 3. Crear tabla de empleados
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) UNIQUE NOT NULL,
    hire_date DATE NOT NULL,
    position VARCHAR(100) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    emergency_contact VARCHAR(100),
    phone VARCHAR(20)
);

-- Insertar empleados
INSERT INTO employees (user_id, hire_date, position, salary, emergency_contact, phone) VALUES
(2, '2020-01-15', 'Gerente General', 5000.00, 'Contacto Emergencia 1', '555-2001'),
(3, '2021-03-10', 'Coordinador de Eventos', 3500.00, 'Contacto Emergencia 2', '555-2002');

-- 4. Crear tabla de miembros
CREATE TABLE members (
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
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Secuencia para membership_number autoincremental
CREATE SEQUENCE membership_number_seq START WITH 1000;

-- Insertar miembros
INSERT INTO members (registrator_id, DNI, first_name, last_name, phone, email, membership_number, status, start_date, end_date) VALUES
(1, 20000001, 'Socio', 'Ejemplo 1', '555-3001', 'member1@club.com', 'MEM-' || nextval('membership_number_seq'), 'active', '2023-01-01', '2023-12-31'),
(2, 20000002, 'Socio', 'Ejemplo 2', '555-3002', 'member2@club.com', 'MEM-' || nextval('membership_number_seq'), 'active', '2023-01-01', '2023-12-31');

-- 5. Crear tabla de tipos de evento
CREATE TABLE event_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    required_resources TEXT
);

-- Insertar tipos de evento
INSERT INTO event_types (name, description, required_resources) VALUES
('Conferencia', 'Evento educativo con ponentes', 'Proyector, sonido, sillas'),
('Taller', 'Evento práctico de aprendizaje', 'Mesas, materiales específicos'),
('Social', 'Evento recreativo para socios', 'Barra de bebidas, música');

-- 6. Crear tabla de eventos
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date TIMESTAMP NOT NULL,
    description TEXT,
    location VARCHAR(200) NOT NULL,
    budget DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    status VARCHAR(20) NOT NULL CHECK (status IN ('scheduled', 'ongoing', 'completed', 'canceled')),
    organizer_id INT REFERENCES users(id) NOT NULL,
    event_type_id INT REFERENCES event_types(id) NOT NULL,
    max_attendees INT
);

-- Insertar eventos
INSERT INTO events (name, date, description, location, budget, actual_cost, status, organizer_id, event_type_id, max_attendees) VALUES
('Taller de Cocina', '2023-06-15 18:00:00', 'Aprende a cocinar platos italianos', 'Salón Principal', 1200.00, 1150.50, 'completed', 3, 2, 20),
('Conferencia de Tecnología', '2023-07-20 16:00:00', 'Novedades en desarrollo web', 'Auditorio', 2500.00, NULL, 'scheduled', 3, 1, 50);

-- 7. Crear tabla de tareas de mantenimiento
CREATE TABLE maintenance_tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    assigned_to INT REFERENCES employees(id) NOT NULL,
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    estimated_cost DECIMAL(10,2)
);

-- Insertar tareas de mantenimiento
INSERT INTO maintenance_tasks (title, description, status, priority, assigned_to, scheduled_date, estimated_cost) VALUES
('Reparación piscina', 'Cambio de filtros y limpieza general', 'pending', 'high', 1, '2023-06-20', 850.00),
('Mantenimiento jardines', 'Podar árboles y regar plantas', 'pending', 'medium', 2, '2023-06-25', 350.00);

-- 8. Crear tabla de proveedores
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    address TEXT,
    service_type VARCHAR(100)
);

-- 9. Crear tabla de categorías de inventario
CREATE TABLE inventory_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 10. Crear tabla de ítems de inventario
CREATE TABLE inventory_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_id INT REFERENCES inventory_categories(id) NOT NULL,
    quantity INT NOT NULL,
    condition VARCHAR(20) NOT NULL CHECK (condition IN ('excellent', 'good', 'fair', 'poor', 'needs_replacement')),
    location VARCHAR(255),
    purchase_date DATE,
    last_maintenance_date DATE,
    supplier_id INT REFERENCES suppliers(id),
    cost DECIMAL(10,2)
);

-- 11. Crear tabla de materiales de mantenimiento
CREATE TABLE maintenance_materials (
    id SERIAL PRIMARY KEY,
    maintenance_id INT REFERENCES maintenance_tasks(id) NOT NULL,
    item_id INT REFERENCES inventory_items(id) NOT NULL,
    quantity_used INT NOT NULL
);

-- 12. Crear tabla de pagos
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    member_id INT REFERENCES members(id) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'credit_card', 'debit_card', 'bank_transfer')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    invoice_number VARCHAR(50),
    description VARCHAR(255)
);

-- 13. Crear tabla de compras
CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    supplier_id INT REFERENCES suppliers(id) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    purchase_date DATE NOT NULL,
    approved_by INT REFERENCES users(id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('requested', 'approved', 'ordered', 'received', 'canceled'))
);

-- 14. Crear tabla de ítems de compra
CREATE TABLE purchase_items (
    id SERIAL PRIMARY KEY,
    purchase_id INT REFERENCES purchases(id) NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    category_id INT REFERENCES inventory_categories(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL
);

-- 15. Crear tabla de asistencia a eventos
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    event_id INT REFERENCES events(id) NOT NULL,
    member_id INT REFERENCES members(id) NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'confirmed', 'canceled', 'attended')),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    check_in_time TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_dni ON users(DNI);
CREATE INDEX idx_members_dni ON members(DNI);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_payments_member_id ON payments(member_id);
CREATE INDEX idx_attendance_event_id ON attendance(event_id);
CREATE INDEX idx_attendance_member_id ON attendance(member_id); 