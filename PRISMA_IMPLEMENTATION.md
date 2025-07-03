# Implementación de Prisma en Country Club Backend

## 📋 Resumen

Se ha implementado Prisma ORM en los módulos de **auth**, **users**, **members** y **events** para mejorar la gestión de la base de datos con type safety y mejores consultas.

## 🚀 Archivos Implementados

### Schema de Prisma
- `prisma/schema.prisma` - Definición de modelos y relaciones

### Modelos de Prisma
- `models/user.prisma.model.js` - Modelo de usuarios con Prisma
- `models/member.prisma.model.js` - Modelo de miembros con Prisma
- `models/event.prisma.model.js` - Modelo de eventos con Prisma
- `models/eventType.prisma.model.js` - Modelo de tipos de eventos con Prisma

### Controladores de Prisma
- `controllers/user.prisma.controller.js` - Controlador de usuarios con Prisma
- `controllers/member.prisma.controller.js` - Controlador de miembros con Prisma
- `controllers/event.prisma.controller.js` - Controlador de eventos con Prisma

### Rutas de Prisma
- `routes/user.prisma.route.js` - Rutas de usuarios con Prisma
- `routes/member.prisma.route.js` - Rutas de miembros con Prisma
- `routes/event.prisma.route.js` - Rutas de eventos con Prisma

### Configuración
- `lib/prisma.js` - Configuración del cliente Prisma

## 🗄️ Modelos de Base de Datos

### Role
```prisma
model Role {
  id   Int     @id @default(autoincrement())
  name String  @unique @db.VarChar(50)
  users User[]
}
```

### User
```prisma
model User {
  id               Int      @id @default(autoincrement())
  dni              Int      @unique
  firstName        String   @map("first_name")
  lastName         String   @map("last_name")
  email            String   @unique
  password         String
  roleId           Int?     @map("role_id")
  registrationDate DateTime @default(now()) @map("registration_date")
  status           String
  phone            String?
  birthDate        DateTime? @map("birth_date")
  
  role     Role?     @relation(fields: [roleId], references: [id])
  members  Member[]   @relation("MemberRegistrator")
  events   Event[]
}
```

### Member
```prisma
model Member {
  id               Int      @id @default(autoincrement())
  registratorId    Int      @map("registrator_id")
  dni              Int      @unique
  firstName        String   @map("first_name")
  lastName         String   @map("last_name")
  phone            String?
  email            String?  @unique
  membershipNumber String   @unique @map("membership_number")
  status           String
  startDate        DateTime @map("start_date")
  endDate          DateTime @map("end_date")
  registrationDate DateTime @default(now()) @map("registration_date")
  
  registrator User @relation("MemberRegistrator", fields: [registratorId], references: [id])
}
```

### EventType
```prisma
model EventType {
  id                Int      @id @default(autoincrement())
  name              String
  description       String?
  requiredResources String?  @map("required_resources")
  
  events Event[]
}
```

### Event
```prisma
model Event {
  id           Int       @id @default(autoincrement())
  name         String
  date         DateTime
  description  String?
  location     String
  budget       Decimal?
  actualCost   Decimal?  @map("actual_cost")
  status       String
  organizerId  Int       @map("organizer_id")
  eventTypeId  Int       @map("event_type_id")
  maxAttendees Int?      @map("max_attendees")
  
  organizer User      @relation(fields: [organizerId], references: [id])
  eventType EventType @relation(fields: [eventTypeId], references: [id])
}
```

## 🔧 Comandos de Prisma

### Generar cliente
```bash
npx prisma generate
```

### Crear migración
```bash
npx prisma migrate dev --name init
```

### Aplicar migraciones
```bash
npx prisma migrate deploy
```

### Ver base de datos
```bash
npx prisma studio
```

## 📡 Endpoints Disponibles

### Usuarios (Prisma)
- `POST /api/v1/users-prisma` - Crear usuario
- `GET /api/v1/users-prisma` - Listar usuarios
- `GET /api/v1/users-prisma/:id` - Obtener usuario
- `PUT /api/v1/users-prisma/:id` - Actualizar usuario
- `DELETE /api/v1/users-prisma/:id` - Eliminar usuario
- `GET /api/v1/users-prisma/role/:role` - Usuarios por rol

### Miembros (Prisma)
- `POST /api/v1/members-prisma` - Crear miembro
- `GET /api/v1/members-prisma` - Listar miembros
- `GET /api/v1/members-prisma/:id` - Obtener miembro
- `PUT /api/v1/members-prisma/:id` - Actualizar miembro
- `DELETE /api/v1/members-prisma/:id` - Eliminar miembro
- `GET /api/v1/members-prisma/status/active` - Miembros activos
- `GET /api/v1/members-prisma/status/:status` - Miembros por estado

### Eventos (Prisma)
- `POST /api/v1/events-prisma` - Crear evento
- `GET /api/v1/events-prisma` - Listar eventos
- `GET /api/v1/events-prisma/:id` - Obtener evento
- `PUT /api/v1/events-prisma/:id` - Actualizar evento
- `DELETE /api/v1/events-prisma/:id` - Eliminar evento
- `GET /api/v1/events-prisma/upcoming/events` - Eventos próximos
- `GET /api/v1/events-prisma/status/:status` - Eventos por estado
- `GET /api/v1/events-prisma/organizer/:organizerId` - Eventos por organizador

## ✨ Ventajas de Prisma

1. **Type Safety** - Validación automática de tipos
2. **Auto-completado** - Mejor experiencia de desarrollo
3. **Relaciones automáticas** - Manejo simplificado de joins
4. **Migraciones automáticas** - Control de versiones de BD
5. **Mejor performance** - Consultas optimizadas
6. **Validaciones automáticas** - Basadas en el schema

## 🔄 Migración Gradual

Los modelos originales siguen funcionando. Los nuevos endpoints de Prisma están disponibles con el sufijo `-prisma` para permitir una migración gradual.

## 📝 Próximos Pasos

1. **Migrar auth module** - Implementar autenticación con Prisma
2. **Actualizar frontend** - Usar nuevos endpoints de Prisma
3. **Migrar otros módulos** - Extender Prisma a maintenance, inventory, etc.
4. **Optimizar consultas** - Aprovechar las capacidades de Prisma
5. **Implementar caching** - Mejorar performance con Redis

## 🛠️ Configuración

El cliente de Prisma está configurado en `lib/prisma.js` con un patrón singleton para evitar múltiples conexiones.

```javascript
import { PrismaClient } from '../generated/prisma/index.js'

const globalForPrisma = globalThis
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
``` 