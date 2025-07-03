# 🔐 Módulo de Autenticación

Este módulo contiene toda la funcionalidad relacionada con la autenticación y autorización del sistema Country Club.

## 📁 Estructura

```
auth/
├── controllers/
│   └── auth.controller.js    # Controlador de autenticación (register, login)
├── routes/
│   └── auth.route.js         # Rutas de autenticación
├── schemas/
│   └── auth.schema.js        # Esquemas de validación para auth
├── middlewares/
│   └── auth.middleware.js    # Middlewares de autenticación y autorización
├── models/                   # (Reservado para futuros modelos específicos de auth)
├── index.js                  # Exportaciones del módulo
└── README.md                 # Esta documentación
```

## 🚀 Funcionalidades

### **Autenticación**
- **Registro de usuarios** (`POST /api/v1/auth/register`)
- **Inicio de sesión** (`POST /api/v1/auth/login`)

### **Autorización**
- **Verificación de tokens** (`verifyToken`)
- **Control de roles** (`requireRole`, `requireAdmin`, `requireManager`, `requireEventCoordinator`)

## 📋 Endpoints

### **POST /api/v1/auth/register**
Registra un nuevo usuario en el sistema.

**Body:**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "phone": "555-1234",
  "DNI": 12345678,
  "password": "password123",
  "role_id": 3,
  "birth_date": "1990-01-01",
  "status": "active"
}
```

**Respuesta:**
```json
{
  "ok": true,
  "msg": {
    "token": "jwt_token_here",
    "role": "event_coordinator",
    "user": {
      "id": 1,
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan@example.com"
    }
  }
}
```

### **POST /api/v1/auth/login**
Inicia sesión con credenciales existentes.

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "ok": true,
  "msg": {
    "token": "jwt_token_here",
    "role": "event_coordinator",
    "user": {
      "id": 1,
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan@example.com"
    }
  }
}
```

## 🔒 Middlewares de Autorización

### **verifyToken**
Verifica que el token JWT sea válido y no haya expirado.

```javascript
import { verifyToken } from '../auth/middlewares/auth.middleware.js'

router.get('/protected', verifyToken, controller.method)
```

### **requireRole(roles)**
Verifica que el usuario tenga uno de los roles especificados.

```javascript
import { requireRole } from '../auth/middlewares/auth.middleware.js'

router.get('/admin-only', verifyToken, requireRole(['admin']), controller.method)
```

### **requireAdmin**
Verifica que el usuario sea administrador.

```javascript
import { requireAdmin } from '../auth/middlewares/auth.middleware.js'

router.get('/admin', verifyToken, requireAdmin, controller.method)
```

### **requireManager**
Verifica que el usuario sea administrador o gerente.

```javascript
import { requireManager } from '../auth/middlewares/auth.middleware.js'

router.get('/management', verifyToken, requireManager, controller.method)
```

### **requireEventCoordinator**
Verifica que el usuario tenga permisos de coordinador de eventos o superiores.

```javascript
import { requireEventCoordinator } from '../auth/middlewares/auth.middleware.js'

router.get('/events', verifyToken, requireEventCoordinator, controller.method)
```

## 🛡️ Seguridad

- **Contraseñas hasheadas** con bcrypt
- **Tokens JWT** con expiración de 1 hora
- **Validación robusta** con Zod
- **Verificación de existencia** de usuarios en base de datos
- **Manejo de errores** específicos para autenticación

## 🔧 Uso

### **Importar el módulo completo:**
```javascript
import { 
    AuthController, 
    authRoutes, 
    verifyToken, 
    requireAdmin 
} from './auth/index.js'
```

### **Importar componentes específicos:**
```javascript
import { AuthController } from './auth/controllers/auth.controller.js'
import { verifyToken } from './auth/middlewares/auth.middleware.js'
```

## 📝 Notas

- Este módulo está completamente separado de la gestión de usuarios
- Las funciones de autenticación están optimizadas para rendimiento
- Los middlewares incluyen verificación de existencia de usuarios
- Los esquemas de validación incluyen mensajes de error en español 