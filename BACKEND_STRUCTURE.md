# Estructura del Backend - Country Club Management System

## Organización del Proyecto

El backend está organizado por **tipo de archivo** en lugar de por módulos, siguiendo una estructura tradicional y clara:

```
Country_Club-aplication-backend/
├── auth/                          # Módulo de autenticación
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── schemas/
├── config/                        # Configuraciones del sistema
│   ├── index.js                   # Configuración principal
│   └── permissions.js             # Configuración de permisos
├── controllers/                   # Controladores de la aplicación
│   ├── member.controller.js       # Controlador de miembros
│   ├── user.controller.js         # Controlador de usuarios
│   ├── event.controller.js        # Controlador de eventos
│   └── [otros controladores...]
├── database/                      # Configuración de base de datos
│   ├── connection.database.js     # Conexión a PostgreSQL
│   ├── schema.sql                 # Esquema básico
│   └── extended_schema.sql        # Esquema extendido completo
├── middlewares/                   # Middlewares de la aplicación
│   ├── auth.middleware.js         # Middleware de autenticación
│   ├── error.middleware.js        # Manejo de errores
│   ├── jwt.middlware.js           # Validación de JWT
│   └── validation.middleware.js   # Validación de datos
├── models/                        # Modelos de datos
│   ├── member.model.js            # Modelo de miembros
│   ├── payment.model.js           # Modelo de pagos
│   ├── user.model.js              # Modelo de usuarios
│   ├── event.model.js             # Modelo de eventos
│   └── [otros modelos...]
├── routes/                        # Rutas de la API
│   ├── member.route.js            # Rutas de miembros
│   ├── user.route.js              # Rutas de usuarios
│   ├── event.route.js             # Rutas de eventos
│   └── [otras rutas...]
├── schemas/                       # Esquemas de validación
│   ├── member.schema.js           # Validación de miembros
│   ├── user.schema.js             # Validación de usuarios
│   ├── event.schema.js            # Validación de eventos
│   └── [otros esquemas...]
├── utils/                         # Utilidades y helpers
│   ├── error.catalog.js           # Catálogo de errores
│   └── error.util.js              # Utilidades de error
├── testing_and_docs/              # Documentación y pruebas
├── index.js                       # Punto de entrada principal
├── package.json                   # Dependencias del proyecto
└── README.md                      # Documentación principal
```

## Módulos del Sistema

### 1. **Autenticación (auth/)**
- **Funcionalidad**: Login, registro, gestión de tokens JWT
- **Roles**: admin, manager, event_coordinator
- **Archivos principales**:
  - `auth/controllers/auth.controller.js`
  - `auth/routes/auth.route.js`
  - `auth/middlewares/auth.middleware.js`

### 2. **Gestión de Miembros (controllers/member.controller.js)**
- **Funcionalidad**: CRUD completo de miembros, pagos, verificación de membresía
- **Características**:
  - Crear, leer, actualizar, eliminar miembros
  - Gestión de pagos y facturación
  - Verificación de membresías
  - Búsqueda avanzada
  - Estadísticas de membresía
- **Permisos**: READ, CREATE, UPDATE, DELETE para roles autorizados

### 3. **Gestión de Eventos (controllers/event.controller.js)**
- **Funcionalidad**: Creación y gestión de eventos del club
- **Características**:
  - Programación de eventos
  - Gestión de asistentes
  - Reservas de espacios
- **Permisos**: READ, CREATE, UPDATE, DELETE para roles autorizados

### 4. **Gestión de Usuarios (controllers/user.controller.js)**
- **Funcionalidad**: Administración de usuarios del sistema
- **Características**:
  - Gestión de roles y permisos
  - Perfiles de usuario
- **Permisos**: Solo admin puede gestionar usuarios

## Estructura de Base de Datos

### Tablas Principales:
- **users**: Usuarios del sistema
- **members**: Miembros del club
- **payments**: Pagos de membresías
- **events**: Eventos del club
- **maintenance**: Mantenimiento de instalaciones
- **inventory**: Inventario del club
- **communications**: Comunicaciones internas
- **reports**: Reportes y analytics

## Sistema de Permisos

### Roles Definidos:
1. **admin**: Acceso completo a todos los módulos
2. **manager**: Gestión de miembros, eventos, mantenimiento
3. **event_coordinator**: Gestión de eventos y comunicaciones

### Permisos por Módulo:
- **MEMBERS**: READ, CREATE, UPDATE, DELETE
- **EVENTS**: READ, CREATE, UPDATE, DELETE
- **MAINTENANCE**: READ, CREATE, UPDATE, DELETE
- **INVENTORY**: READ, CREATE, UPDATE, DELETE
- **COMMUNICATIONS**: READ, CREATE, UPDATE, DELETE
- **REPORTS**: READ, CREATE
- **ADMIN**: READ, CREATE, UPDATE, DELETE

## API Endpoints

### Autenticación:
- `POST /api/v1/auth/register` - Registro de usuarios
- `POST /api/v1/auth/login` - Login de usuarios
- `POST /api/v1/auth/refresh` - Renovar token

### Miembros:
- `GET /api/v1/members` - Listar miembros
- `GET /api/v1/members/:id` - Obtener miembro específico
- `POST /api/v1/members` - Crear miembro
- `PUT /api/v1/members/:id` - Actualizar miembro
- `DELETE /api/v1/members/:id` - Eliminar miembro
- `POST /api/v1/members/verify` - Verificar membresía
- `GET /api/v1/members/:id/payments` - Pagos del miembro
- `POST /api/v1/members/:id/payments` - Crear pago

### Eventos:
- `GET /api/v1/events` - Listar eventos
- `POST /api/v1/events` - Crear evento
- `PUT /api/v1/events/:id` - Actualizar evento
- `DELETE /api/v1/events/:id` - Eliminar evento

### Usuarios:
- `GET /api/v1/users` - Listar usuarios (solo admin)
- `PUT /api/v1/users/:id` - Actualizar usuario (solo admin)

## Ventajas de esta Estructura

1. **Claridad**: Fácil de navegar y entender
2. **Escalabilidad**: Fácil agregar nuevos controladores, modelos, etc.
3. **Mantenibilidad**: Separación clara de responsabilidades
4. **Consistencia**: Patrón uniforme en todo el proyecto
5. **Reutilización**: Middlewares y utilidades compartidas

## Convenciones de Nomenclatura

- **Controladores**: `[entidad].controller.js`
- **Modelos**: `[entidad].model.js`
- **Rutas**: `[entidad].route.js`
- **Esquemas**: `[entidad].schema.js`
- **Middleware**: `[funcionalidad].middleware.js`

## Flujo de Datos

1. **Request** → **Routes** → **Validation** → **Controller** → **Model** → **Database**
2. **Response** ← **Model** ← **Controller** ← **Validation** ← **Routes** ← **Request**

Esta estructura proporciona una base sólida y escalable para el sistema de gestión del Country Club. 