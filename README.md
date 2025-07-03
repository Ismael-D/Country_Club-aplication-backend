# Country Club Backend API

Backend completo para sistema de gestión de Country Club con autenticación JWT, validación Zod, PostgreSQL y manejo de errores enterprise-grade.

## 🚀 Características

- ✅ **PostgreSQL** - Base de datos completa sin datos quemados
- ✅ **JWT Authentication** - Control de acceso con tokens
- ✅ **Zod Validation** - Validación robusta de datos
- ✅ **Error Handling** - Manejo centralizado de errores
- ✅ **Role-based Access** - Control de acceso por roles
- ✅ **Separated Routes** - Autenticación separada de gestión de usuarios

## 📁 Estructura del Proyecto

```
Country_Club-aplication-backend/
├── auth/               # 🔐 Módulo de Autenticación
│   ├── controllers/    # Controladores de auth (register, login)
│   ├── routes/         # Rutas de autenticación
│   ├── schemas/        # Esquemas de validación para auth
│   ├── middlewares/    # Middlewares de auth y autorización
│   ├── models/         # (Reservado para futuros modelos de auth)
│   └── index.js        # Exportaciones del módulo auth
├── controllers/        # Lógica de negocio (usuarios, miembros, eventos)
├── database/          # Conexión y esquema de BD
├── middlewares/       # Validación y manejo de errores generales
├── models/           # Acceso a datos
├── routes/           # Definición de rutas
│   ├── user.route.js   # Gestión de usuarios (privado)
│   ├── member.route.js # Gestión de miembros
│   └── event.route.js  # Gestión de eventos
├── schemas/          # Esquemas de validación Zod
└── index.js          # Punto de entrada
```

## 🔧 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd Country_Club-aplication-backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# Ejecutar el esquema de base de datos
psql -U tu_usuario -d tu_base_de_datos -f database/schema.sql

# Iniciar el servidor
npm start
```

## 📚 API Endpoints

### 🔐 Autenticación (Público)
```
POST /api/v1/auth/register  - Registro de usuarios
POST /api/v1/auth/login     - Login de usuarios
```
*Nota: Las rutas de autenticación están ahora organizadas en el módulo `auth/`*

### 👤 Usuarios (Privado)
```
GET    /api/v1/users/profile     - Perfil del usuario
GET    /api/v1/users             - Listar usuarios (admin)
PUT    /api/v1/users/update-role - Actualizar rol (admin)
DELETE /api/v1/users/:id         - Eliminar usuario (admin)
```

### 👥 Miembros (Privado)
```
GET    /api/v1/members     - Listar miembros
GET    /api/v1/members/:id - Obtener miembro
POST   /api/v1/members     - Crear miembro
PUT    /api/v1/members/:id - Actualizar miembro
DELETE /api/v1/members/:id - Eliminar miembro
```

### 🎉 Eventos
```
GET    /api/v1/events     - Listar eventos (público)
GET    /api/v1/events/:id - Obtener evento (público)
POST   /api/v1/events     - Crear evento (privado)
PUT    /api/v1/events/:id - Actualizar evento (manager/admin)
DELETE /api/v1/events/:id - Eliminar evento (admin)
```

## 🔑 Autenticación

### Registro
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "phone": "555-1234",
    "DNI": 12345678,
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Usar Token
```bash
curl -X GET http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

## 🛡️ Roles y Permisos

- **admin**: Acceso completo a todas las funcionalidades
- **manager**: Puede gestionar eventos y miembros
- **event_coordinator**: Puede crear y gestionar eventos

## 🧪 Pruebas

```bash
# Pruebas generales del sistema
node test_complete_system.js

# Pruebas exhaustivas de manejo de errores
node test_error_handling.js
```

## 📊 Base de Datos

### Tablas Principales
- `users` - Usuarios del sistema
- `roles` - Roles de usuario
- `members` - Miembros del club
- `events` - Eventos del club
- `event_types` - Tipos de eventos

### Esquema Completo
Ver `database/schema.sql` para el esquema completo de la base de datos.

## ⚠️ Manejo de Errores

El sistema maneja automáticamente:

- **400** - Errores de validación y parámetros inválidos
- **401** - Errores de autenticación JWT
- **403** - Errores de autorización (roles insuficientes)
- **404** - Recursos no encontrados
- **405** - Métodos HTTP no permitidos
- **409** - Conflictos (recursos duplicados)
- **500** - Errores internos del servidor
- **503** - Servicio no disponible (base de datos)

## 🔒 Seguridad

- **Contraseñas hasheadas** con bcrypt
- **Tokens JWT** con expiración
- **Validación de entrada** con Zod
- **Control de acceso** basado en roles
- **Sanitización** de parámetros de URL

## 🚀 Producción

El sistema está listo para producción con:

- Manejo de errores enterprise-grade
- Validación robusta de datos
- Autenticación segura
- Arquitectura escalable
- Documentación completa

## 📝 Licencia

ISC License 