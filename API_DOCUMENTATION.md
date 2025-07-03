# 🏗️ API Documentation - Country Club Backend

## 📋 Información General

- **Base URL**: `http://localhost:3000/api/v1`
- **Versión**: 1.0.0
- **Autenticación**: JWT Bearer Token
- **Formato de Respuesta**: JSON

## 🔐 Autenticación

### POST /auth/register
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
  "birth_date": "1990-01-01"
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

### POST /auth/login
Inicia sesión con credenciales existentes.

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

## 👥 Gestión de Usuarios

### GET /users/profile
Obtiene el perfil del usuario autenticado.

**Headers:** `Authorization: Bearer <token>`

### GET /users
Lista todos los usuarios (solo admin).

**Headers:** `Authorization: Bearer <token>`

### PUT /users/update-role
Actualiza el rol de un usuario (solo admin).

**Body:**
```json
{
  "id": 1,
  "role_id": 2
}
```

### DELETE /users/:id
Elimina un usuario (solo admin).

## 👤 Módulo de Miembros

### GET /members
Lista todos los miembros.

**Query Parameters:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `status`: Filtrar por estado (active, inactive, suspended)
- `search`: Buscar por nombre, email o DNI

### GET /members/:id
Obtiene un miembro específico.

### POST /members
Crea un nuevo miembro.

**Body:**
```json
{
  "DNI": 12345678,
  "first_name": "María",
  "last_name": "García",
  "phone": "555-1234",
  "email": "maria@example.com",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "membership_type": "premium",
  "emergency_contact": "Juan García",
  "address": "Calle Principal 123",
  "occupation": "Ingeniera",
  "company": "Tech Corp"
}
```

### PUT /members/:id
Actualiza un miembro.

### DELETE /members/:id
Elimina un miembro.

### GET /members/:id/payments
Obtiene el historial de pagos de un miembro.

### POST /members/:id/payments
Registra un nuevo pago.

**Body:**
```json
{
  "amount": 500.00,
  "payment_method": "credit_card",
  "description": "Cuota mensual enero 2024"
}
```

## 🎉 Módulo de Eventos

### GET /events
Lista todos los eventos con paginación y filtros.

**Query Parameters:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `status`: Filtrar por estado (scheduled, confirmed, in_progress, completed, cancelled, postponed)
- `event_type`: Filtrar por tipo (social, business, sports, cultural, educational, recreational, other)
- `date_from`: Fecha de inicio (YYYY-MM-DD)
- `date_to`: Fecha de fin (YYYY-MM-DD)
- `search`: Buscar por nombre, descripción o ubicación

**Headers:** `Authorization: Bearer <token>`

**Respuesta:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "name": "Torneo de Golf",
      "description": "Torneo anual de golf",
      "date": "2024-03-15",
      "time_start": "08:00",
      "time_end": "17:00",
      "location": "Campo de Golf",
      "event_type": "sports",
      "max_attendees": 50,
      "status": "confirmed",
      "organizer_first_name": "Juan",
      "organizer_last_name": "Pérez"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### GET /events/search
Busca eventos por término.

**Query Parameters:**
- `q`: Término de búsqueda (mínimo 2 caracteres)
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)

### GET /events/statistics
Obtiene estadísticas de eventos.

**Respuesta:**
```json
{
  "ok": true,
  "data": {
    "total_events": 150,
    "scheduled_events": 45,
    "confirmed_events": 30,
    "completed_events": 60,
    "cancelled_events": 15,
    "upcoming_events": 75,
    "past_events": 75,
    "average_cost": 2500.50,
    "total_cost": 375075.00
  }
}
```

### GET /events/upcoming
Obtiene eventos próximos.

**Query Parameters:**
- `limit`: Número de eventos (default: 10)

### GET /events/:id
Obtiene un evento específico.

**Respuesta:**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "name": "Torneo de Golf",
    "description": "Torneo anual de golf",
    "date": "2024-03-15",
    "time_start": "08:00",
    "time_end": "17:00",
    "location": "Campo de Golf",
    "event_type": "sports",
    "max_attendees": 50,
    "budget": 5000.00,
    "actual_cost": 4800.00,
    "status": "confirmed",
    "requirements": "Traer palos de golf",
    "notes": "Incluye almuerzo",
    "organizer_first_name": "Juan",
    "organizer_last_name": "Pérez",
    "organizer_email": "juan@club.com"
  }
}
```

### POST /events
Crea un nuevo evento.

**Body:**
```json
{
  "name": "Torneo de Golf",
  "description": "Torneo anual de golf",
  "date": "2024-03-15",
  "time_start": "08:00",
  "time_end": "17:00",
  "location": "Campo de Golf",
  "event_type": "sports",
  "max_attendees": 50,
  "budget": 5000.00,
  "requirements": "Traer palos de golf",
  "notes": "Incluye almuerzo"
}
```

### PUT /events/:id
Actualiza un evento.

### DELETE /events/:id
Elimina un evento (solo si no tiene asistentes registrados).

### GET /events/:id/attendees
Obtiene la lista de asistentes a un evento.

**Query Parameters:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)

**Respuesta:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "member_id": 5,
      "member_first_name": "María",
      "member_last_name": "García",
      "member_email": "maria@email.com",
      "guest_name": null,
      "guest_email": null,
      "special_requirements": "Silla de ruedas",
      "registration_date": "2024-02-01T10:30:00Z",
      "registered_by_first_name": "Juan",
      "registered_by_last_name": "Pérez"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### POST /events/:id/attendees
Registra un asistente al evento.

**Body:**
```json
{
  "member_id": 5,
  "guest_name": "Carlos López",
  "guest_email": "carlos@email.com",
  "special_requirements": "Silla de ruedas"
}
```

### DELETE /events/:id/attendees/:attendee_id
Elimina un asistente del evento.

### GET /events/spaces/available
Obtiene espacios disponibles para reserva.

**Query Parameters:**
- `date`: Fecha de reserva (YYYY-MM-DD)
- `time_start`: Hora de inicio (HH:MM)
- `time_end`: Hora de fin (HH:MM)
- `capacity`: Capacidad mínima requerida

**Respuesta:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "name": "Salón Principal",
      "description": "Salón para eventos grandes",
      "capacity": 100,
      "hourly_rate": 500.00,
      "active_reservations": 0
    }
  ]
}
```

### POST /events/spaces/reserve
Reserva un espacio para un evento.

**Body:**
```json
{
  "space_id": 1,
  "event_id": 5,
  "date": "2024-03-15",
  "time_start": "08:00",
  "time_end": "17:00"
}
```

## 🔧 Módulo de Mantenimiento

### GET /maintenance/tasks
Lista todas las tareas de mantenimiento.

**Query Parameters:**
- `status`: Filtrar por estado
- `priority`: Filtrar por prioridad
- `assigned_to`: Filtrar por empleado asignado

### GET /maintenance/tasks/:id
Obtiene una tarea específica.

### POST /maintenance/tasks
Crea una nueva tarea de mantenimiento.

**Body:**
```json
{
  "title": "Reparación piscina",
  "description": "Cambio de filtros y limpieza general",
  "priority": "high",
  "assigned_to": 1,
  "scheduled_date": "2024-02-20",
  "estimated_cost": 850.00,
  "location": "Piscina principal",
  "category": "Plomería"
}
```

### PUT /maintenance/tasks/:id
Actualiza una tarea de mantenimiento.

### DELETE /maintenance/tasks/:id
Elimina una tarea de mantenimiento.

### GET /maintenance/incidents
Lista todos los reportes de incidencias.

### POST /maintenance/incidents
Crea un nuevo reporte de incidencia.

**Body:**
```json
{
  "title": "Fuga en tubería",
  "description": "Hay una fuga en la tubería principal",
  "priority": "urgent",
  "location": "Cocina principal"
}
```

## 📦 Módulo de Inventario

### GET /inventory/items
Lista todos los ítems del inventario.

**Query Parameters:**
- `category`: Filtrar por categoría
- `condition`: Filtrar por condición
- `location`: Filtrar por ubicación

### GET /inventory/items/:id
Obtiene un ítem específico.

### POST /inventory/items
Crea un nuevo ítem en el inventario.

**Body:**
```json
{
  "name": "Martillo",
  "category_id": 1,
  "quantity": 5,
  "min_quantity": 2,
  "condition": "good",
  "location": "Almacén A",
  "cost": 25.00,
  "is_tool": true
}
```

### PUT /inventory/items/:id
Actualiza un ítem del inventario.

### DELETE /inventory/items/:id
Elimina un ítem del inventario.

### GET /inventory/categories
Lista todas las categorías de inventario.

### POST /inventory/categories
Crea una nueva categoría.

## 📞 Módulo de Comunicaciones

### GET /communications/notifications
Lista todas las notificaciones.

### POST /communications/notifications
Envía una nueva notificación.

**Body:**
```json
{
  "title": "Mantenimiento programado",
  "message": "El próximo lunes habrá mantenimiento en la piscina",
  "type": "info",
  "recipient_type": "all",
  "scheduled_for": "2024-02-19T09:00:00Z"
}
```

### GET /communications/surveys
Lista todas las encuestas.

### POST /communications/surveys
Crea una nueva encuesta.

**Body:**
```json
{
  "title": "Satisfacción con eventos",
  "description": "Encuesta para evaluar la satisfacción con los eventos",
  "target_audience": "members",
  "start_date": "2024-02-01",
  "end_date": "2024-02-28"
}
```

### POST /communications/surveys/:id/questions
Agrega una pregunta a una encuesta.

**Body:**
```json
{
  "question_text": "¿Cómo calificarías el último evento?",
  "question_type": "rating",
  "is_required": true,
  "order_index": 1
}
```

### POST /communications/surveys/:id/responses
Envía una respuesta a una encuesta.

**Body:**
```json
{
  "question_id": 1,
  "rating": 5,
  "answer": "Excelente evento"
}
```

## 📊 Módulo de Reportes

### Endpoints de Reportes

#### 1. Reportes de Membresías
- `GET /api/v1/reports/membership` - Generar reporte de membresías
- `GET /api/v1/reports/membership/download/:id` - Descargar reporte de membresías en PDF

#### 2. Reportes Financieros
- `GET /api/v1/reports/financial` - Generar reporte financiero
- `GET /api/v1/reports/financial/download/:id` - Descargar reporte financiero en PDF

#### 3. Reportes de Eventos
- `GET /api/v1/reports/events` - Generar reporte de eventos
- `GET /api/v1/reports/events/download/:id` - Descargar reporte de eventos en PDF

#### 4. Reportes de Mantenimiento
- `GET /api/v1/reports/maintenance` - Generar reporte de mantenimiento
- `GET /api/v1/reports/maintenance/download/:id` - Descargar reporte de mantenimiento en PDF

#### 5. Reportes de Inventario
- `GET /api/v1/reports/inventory` - Generar reporte de inventario
- `GET /api/v1/reports/inventory/download/:id` - Descargar reporte de inventario en PDF

#### 6. Reportes de Asistencia
- `GET /api/v1/reports/attendance` - Generar reporte de asistencia
- `GET /api/v1/reports/attendance/download/:id` - Descargar reporte de asistencia en PDF

#### 7. Reportes Personalizados
- `POST /api/v1/reports/custom` - Generar reporte personalizado
- `GET /api/v1/reports/custom/download/:id` - Descargar reporte personalizado en PDF

#### 8. Estadísticas Generales
- `GET /api/v1/reports/statistics` - Obtener estadísticas generales

#### 9. Reportes Guardados
- `GET /api/v1/reports/saved` - Obtener reportes guardados
- `POST /api/v1/reports/save` - Guardar reporte
- `DELETE /api/v1/reports/saved/:id` - Eliminar reporte guardado

#### 10. Exportación
- `POST /api/v1/reports/export/excel` - Exportar reporte a Excel

### Uso del Módulo de Reportes

#### Generar Reporte de Membresías
```bash
curl -X GET "http://localhost:3000/api/v1/reports/membership?startDate=2024-01-01&endDate=2024-12-31&membershipType=premium&format=json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Generar Reporte Financiero
```bash
curl -X GET "http://localhost:3000/api/v1/reports/financial?startDate=2024-01-01&endDate=2024-12-31&reportType=revenue&format=pdf" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Generar Reporte de Eventos
```bash
curl -X GET "http://localhost:3000/api/v1/reports/events?startDate=2024-01-01&endDate=2024-12-31&eventType=social&status=completed" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Generar Reporte Personalizado
```bash
curl -X POST http://localhost:3000/api/v1/reports/custom \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "reportType": "members_activity",
    "filters": {
      "startDate": "2024-01-01",
      "endDate": "2024-12-31"
    },
    "columns": ["id", "first_name", "last_name", "events_attended", "total_paid"]
  }'
```

#### Obtener Estadísticas Generales
```bash
curl -X GET "http://localhost:3000/api/v1/reports/statistics?period=month" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Guardar Reporte
```bash
curl -X POST http://localhost:3000/api/v1/reports/save \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Reporte Mensual de Membresías",
    "description": "Reporte de membresías del mes de enero",
    "reportType": "membership",
    "filters": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-31"
    }
  }'
```

#### Exportar a Excel
```bash
curl -X POST http://localhost:3000/api/v1/reports/export/excel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "reportType": "financial",
    "filters": {
      "startDate": "2024-01-01",
      "endDate": "2024-12-31"
    }
  }'
```

## 👨‍💼 Módulo de Empleados

### GET /employees
Lista todos los empleados.

### GET /employees/:id
Obtiene un empleado específico.

### POST /employees
Crea un nuevo empleado.

**Body:**
```json
{
  "user_id": 4,
  "hire_date": "2024-01-15",
  "position": "Mantenimiento",
  "salary": 2500.00,
  "emergency_contact": "María López",
  "phone": "555-1234",
  "department": "Mantenimiento",
  "supervisor_id": 1
}
```

### PUT /employees/:id
Actualiza un empleado.

### DELETE /employees/:id
Elimina un empleado.

## 🛒 Módulo de Compras

### GET /purchases
Lista todas las compras.

### GET /purchases/:id
Obtiene una compra específica.

### POST /purchases
Crea una nueva solicitud de compra.

**Body:**
```json
{
  "supplier_id": 1,
  "total_amount": 500.00,
  "purchase_date": "2024-02-15",
  "notes": "Compra de herramientas"
}
```

### PUT /purchases/:id/approve
Aprueba una compra.

### POST /purchases/:id/items
Agrega ítems a una compra.

**Body:**
```json
{
  "item_name": "Destornilladores",
  "category_id": 1,
  "quantity": 10,
  "unit_price": 15.00,
  "total_price": 150.00
}
```

## ⚙️ Módulo de Administración

### GET /admin/config
Obtiene configuraciones del sistema.

### PUT /admin/config
Actualiza configuraciones del sistema.

**Body:**
```json
{
  "club_name": "Country Club Premium",
  "max_event_attendees": 100,
  "membership_fee": 500.00
}
```

### GET /admin/logs
Obtiene logs de actividad.

**Query Parameters:**
- `user_id`: Filtrar por usuario
- `action`: Filtrar por acción
- `date_from`: Fecha de inicio
- `date_to`: Fecha de fin

### GET /admin/backup
Genera backup de la base de datos.

## 🔒 Códigos de Estado HTTP

- **200**: OK - Operación exitosa
- **201**: Created - Recurso creado exitosamente
- **400**: Bad Request - Datos inválidos
- **401**: Unauthorized - No autenticado
- **403**: Forbidden - No autorizado
- **404**: Not Found - Recurso no encontrado
- **409**: Conflict - Conflicto (ej: duplicado)
- **500**: Internal Server Error - Error del servidor

## 📝 Formato de Respuesta de Error

```json
{
  "ok": false,
  "msg": "Descripción del error",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

## 🔐 Headers Requeridos

Para endpoints protegidos:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## 📋 Paginación

Los endpoints que soportan paginación devuelven:

```json
{
  "ok": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## 🚀 Ejemplos de Uso

### Autenticación y uso de token
```bash
# 1. Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@club.com", "password": "password123"}'

# 2. Usar token para acceder a recursos protegidos
curl -X GET http://localhost:3000/api/v1/members \
  -H "Authorization: Bearer <token_from_login>"
```

### Crear un evento
```bash
curl -X POST http://localhost:3000/api/v1/events \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Taller de Yoga",
    "date": "2024-02-20T18:00:00Z",
    "description": "Clase de yoga para principiantes",
    "location": "Sala de eventos",
    "event_type_id": 2,
    "max_attendees": 15
  }'
```

## 🔧 Módulo de Mantenimiento

### GET /maintenance
Lista todas las tareas de mantenimiento con paginación y filtros.

**Query Parameters:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `status`: Filtrar por estado (pending, assigned, in_progress, completed, cancelled)
- `priority`: Filtrar por prioridad (low, medium, high, urgent)
- `category`: Filtrar por categoría (electrical, plumbing, hvac, structural, landscaping, equipment, general, cleaning, security, other)
- `assigned_to`: Filtrar por usuario asignado
- `date_from`: Fecha de inicio (YYYY-MM-DD)
- `date_to`: Fecha de fin (YYYY-MM-DD)

**Headers:** `Authorization: Bearer <token>`

**Respuesta:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "title": "Reparación de aire acondicionado",
      "description": "El aire acondicionado del salón principal no funciona correctamente",
      "priority": "high",
      "category": "hvac",
      "location": "Salón Principal",
      "status": "in_progress",
      "scheduled_date": "2024-02-15",
      "estimated_duration": 120,
      "estimated_cost": 500.00,
      "reported_by_first_name": "Juan",
      "reported_by_last_name": "Pérez",
      "assigned_to_first_name": "Carlos",
      "assigned_to_last_name": "López"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### GET /maintenance/search
Busca tareas de mantenimiento por término.

**Query Parameters:**
- `q`: Término de búsqueda (mínimo 2 caracteres)
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)

### GET /maintenance/:id
Obtiene una tarea de mantenimiento específica.

### POST /maintenance
Crea una nueva tarea de mantenimiento.

**Body:**
```json
{
  "title": "Reparación de iluminación",
  "description": "Cambiar bombillas en el área de estacionamiento",
  "priority": "medium",
  "category": "electrical",
  "location": "Estacionamiento",
  "assigned_to": 5,
  "scheduled_date": "2024-02-20",
  "estimated_duration": 60,
  "estimated_cost": 150.00,
  "requirements": "Bombillas LED, escalera",
  "notes": "Trabajo nocturno preferible"
}
```

### PUT /maintenance/:id
Actualiza una tarea de mantenimiento.

**Body:**
```json
{
  "status": "completed",
  "actual_duration": 45,
  "actual_cost": 120.00,
  "completion_notes": "Trabajo completado exitosamente"
}
```

### DELETE /maintenance/:id
Elimina una tarea de mantenimiento (solo tareas pendientes o canceladas).

## 🚨 Gestión de Incidencias

### GET /maintenance/incidents
Lista todas las incidencias con paginación y filtros.

**Query Parameters:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `priority`: Filtrar por prioridad (low, medium, high, urgent)
- `status`: Filtrar por estado (open, in_progress, resolved, closed)
- `location`: Filtrar por ubicación

### POST /maintenance/incidents
Crea una nueva incidencia.

**Body:**
```json
{
  "title": "Fuga de agua en baños",
  "description": "Hay una fuga de agua en el baño del área de piscina",
  "priority": "urgent",
  "location": "Área de Piscina - Baños",
  "equipment_id": 3
}
```

## 🛠️ Gestión de Equipos

### GET /maintenance/equipment
Lista todos los equipos con paginación y filtros.

**Query Parameters:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `category`: Filtrar por categoría
- `status`: Filtrar por estado (active, maintenance, retired, broken)
- `location`: Filtrar por ubicación

### POST /maintenance/equipment
Registra un nuevo equipo.

**Body:**
```json
{
  "name": "Bomba de Piscina Principal",
  "description": "Bomba centrífuga para circulación de agua",
  "category": "equipment",
  "model": "HP-5000",
  "serial_number": "SN123456789",
  "location": "Sala de Máquinas",
  "purchase_date": "2023-01-15",
  "warranty_expiry": "2025-01-15",
  "status": "active"
}
```

### PUT /maintenance/equipment/:id
Actualiza información de un equipo.

**Body:**
```json
{
  "status": "maintenance",
  "last_maintenance_date": "2024-02-10",
  "next_maintenance_date": "2024-05-10"
}
```

## 📅 Mantenimiento Preventivo

### GET /maintenance/preventive
Lista tareas de mantenimiento preventivo.

**Query Parameters:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `equipment_id`: Filtrar por equipo
- `frequency`: Filtrar por frecuencia (daily, weekly, monthly, quarterly, biannual, annual)

### POST /maintenance/preventive
Crea una nueva tarea de mantenimiento preventivo.

**Body:**
```json
{
  "equipment_id": 5,
  "task_description": "Limpieza y lubricación de filtros",
  "frequency": "monthly",
  "estimated_duration": 30,
  "estimated_cost": 50.00,
  "next_maintenance_date": "2024-03-15"
}
```

## 📊 Estadísticas y Reportes

### GET /maintenance/statistics
Obtiene estadísticas generales de mantenimiento.

**Respuesta:**
```json
{
  "ok": true,
  "data": {
    "total_tasks": 150,
    "pending_tasks": 25,
    "assigned_tasks": 15,
    "in_progress_tasks": 10,
    "completed_tasks": 95,
    "cancelled_tasks": 5,
    "high_priority_tasks": 8,
    "urgent_tasks": 3,
    "overdue_tasks": 5,
    "average_cost": 350.50,
    "total_cost": 52575.00
  }
}
```

### GET /maintenance/pending
Obtiene tareas pendientes (limitadas a 10 por defecto).

### GET /maintenance/overdue
Obtiene tareas vencidas.

## 🔧 Ejemplos de Uso - Mantenimiento

### Crear una tarea de mantenimiento
```bash
curl -X POST http://localhost:3000/api/v1/maintenance \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Reparación de cerradura",
    "description": "La cerradura de la puerta principal no funciona",
    "priority": "high",
    "category": "security",
    "location": "Entrada Principal",
    "scheduled_date": "2024-02-18",
    "estimated_duration": 45,
    "estimated_cost": 200.00
  }'
```

### Reportar una incidencia
```bash
curl -X POST http://localhost:3000/api/v1/maintenance/incidents \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cortocircuito en sala de eventos",
    "description": "Se detectó un cortocircuito en el panel eléctrico",
    "priority": "urgent",
    "location": "Sala de Eventos"
  }'
```

### Registrar un equipo
```bash
curl -X POST http://localhost:3000/api/v1/maintenance/equipment \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aire Acondicionado Central",
    "description": "Sistema de aire acondicionado para el edificio principal",
    "category": "hvac",
    "model": "AC-2000",
    "serial_number": "SN987654321",
    "location": "Techo del Edificio Principal",
    "purchase_date": "2022-06-01",
    "warranty_expiry": "2025-06-01"
  }'
```

## 📦 Módulo de Inventario

### GET /inventory
Lista todos los productos del inventario con paginación y filtros.

**Query Parameters:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `category`: Filtrar por categoría
- `supplier`: Filtrar por proveedor
- `status`: Filtrar por estado (active, inactive, discontinued)
- `low_stock`: Filtrar productos con bajo stock (true/false)
- `search`: Buscar por nombre, descripción o SKU

**Headers:** `Authorization: Bearer <token>`

**Respuesta:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "name": "Pelotas de Golf Premium",
      "description": "Pelotas de golf de alta calidad para torneos",
      "sku": "GOLF-001",
      "category_name": "Deportes",
      "supplier_name": "Sports Supply Co.",
      "unit_price": 25.00,
      "cost_price": 15.00,
      "current_stock": 150,
      "min_stock": 50,
      "max_stock": 500,
      "unit_of_measure": "units",
      "location": "Almacén Principal - Estante A1",
      "status": "active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

### GET /inventory/search
Busca productos por término.

**Query Parameters:**
- `q`: Término de búsqueda (mínimo 2 caracteres)
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)

### GET /inventory/:id
Obtiene un producto específico.

### POST /inventory
Crea un nuevo producto.

**Body:**
```json
{
  "name": "Toallas de Piscina",
  "description": "Toallas de algodón para área de piscina",
  "sku": "TOWEL-001",
  "category_id": 3,
  "supplier_id": 2,
  "unit_price": 35.00,
  "cost_price": 20.00,
  "min_stock": 100,
  "max_stock": 1000,
  "unit_of_measure": "units",
  "barcode": "1234567890123",
  "location": "Almacén de Lencería",
  "expiry_date": "2025-12-31"
}
```

### PUT /inventory/:id
Actualiza un producto.

**Body:**
```json
{
  "unit_price": 40.00,
  "current_stock": 200,
  "location": "Almacén Principal - Estante B2"
}
```

### DELETE /inventory/:id
Elimina un producto (solo si no tiene stock).

## 🏷️ Gestión de Categorías

### GET /inventory/categories
Obtiene todas las categorías con conteo de productos.

### POST /inventory/categories
Crea una nueva categoría.

**Body:**
```json
{
  "name": "Bebidas",
  "description": "Bebidas y refrescos para el club",
  "color": "#FF6B6B"
}
```

## 🏢 Gestión de Proveedores

### GET /inventory/suppliers
Lista todos los proveedores con paginación y filtros.

**Query Parameters:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `status`: Filtrar por estado (active, inactive, suspended)
- `search`: Buscar por nombre, contacto o email

### POST /inventory/suppliers
Crea un nuevo proveedor.

**Body:**
```json
{
  "name": "Food & Beverage Supply",
  "contact_person": "María González",
  "email": "maria@foodsupply.com",
  "phone": "555-1234",
  "address": "Calle Comercial 456, Ciudad",
  "tax_id": "TAX123456789",
  "payment_terms": "net_30"
}
```

### PUT /inventory/suppliers/:id
Actualiza un proveedor.

## 📊 Movimientos de Inventario

### GET /inventory/movements
Lista todos los movimientos de inventario.

**Query Parameters:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `product_id`: Filtrar por producto
- `movement_type`: Filtrar por tipo (in, out, purchase, sale, adjustment, transfer, return, damage, expiry)
- `date_from`: Fecha de inicio (YYYY-MM-DD)
- `date_to`: Fecha de fin (YYYY-MM-DD)

### POST /inventory/movements
Crea un nuevo movimiento de inventario.

**Body:**
```json
{
  "product_id": 5,
  "movement_type": "in",
  "quantity": 50,
  "unit_price": 25.00,
  "reference_number": "PO-2024-001",
  "notes": "Compra de reposición de stock"
}
```

## 🛒 Gestión de Compras

### GET /inventory/purchases
Lista todas las compras con paginación y filtros.

**Query Parameters:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `supplier_id`: Filtrar por proveedor
- `status`: Filtrar por estado (pending, approved, ordered, received, cancelled, completed)
- `date_from`: Fecha de inicio (YYYY-MM-DD)
- `date_to`: Fecha de fin (YYYY-MM-DD)

### POST /inventory/purchases
Crea una nueva compra.

**Body:**
```json
{
  "supplier_id": 3,
  "purchase_number": "PO-2024-002",
  "total_amount": 2500.00,
  "purchase_date": "2024-02-15",
  "expected_delivery": "2024-02-25",
  "notes": "Compra de suministros para eventos"
}
```

### PUT /inventory/purchases/:id/status
Actualiza el estado de una compra.

**Body:**
```json
{
  "status": "received"
}
```

## 📈 Estadísticas y Reportes

### GET /inventory/statistics
Obtiene estadísticas generales del inventario.

**Respuesta:**
```json
{
  "ok": true,
  "data": {
    "total_products": 150,
    "active_products": 140,
    "inactive_products": 10,
    "low_stock_products": 15,
    "out_of_stock_products": 5,
    "expired_products": 3,
    "average_unit_price": 45.50,
    "total_inventory_value": 67500.00,
    "total_cost_value": 45000.00
  }
}
```

### GET /inventory/low-stock
Obtiene productos con bajo stock (limitados a 10 por defecto).

### GET /inventory/expired
Obtiene productos vencidos.

### GET /inventory/by-category
Obtiene productos agrupados por categoría.

## 📦 Ejemplos de Uso - Inventario

### Crear un producto
```bash
curl -X POST http://localhost:3000/api/v1/inventory \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Raquetas de Tenis",
    "description": "Raquetas profesionales para alquiler",
    "sku": "TENNIS-001",
    "category_id": 2,
    "supplier_id": 1,
    "unit_price": 120.00,
    "cost_price": 80.00,
    "min_stock": 20,
    "max_stock": 100,
    "unit_of_measure": "units",
    "location": "Almacén de Deportes"
  }'
```

### Registrar un movimiento de entrada
```bash
curl -X POST http://localhost:3000/api/v1/inventory/movements \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 3,
    "movement_type": "in",
    "quantity": 25,
    "unit_price": 15.00,
    "reference_number": "INV-2024-001",
    "notes": "Ajuste de inventario inicial"
  }'
```

### Crear un proveedor
```bash
curl -X POST http://localhost:3000/api/v1/inventory/suppliers \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sport Equipment Pro",
    "contact_person": "Carlos Rodríguez",
    "email": "carlos@sportequipment.com",
    "phone": "555-9876",
    "address": "Avenida Deportiva 789, Ciudad",
    "payment_terms": "net_30"
  }'
``` 