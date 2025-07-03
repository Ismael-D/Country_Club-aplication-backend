import { Router } from 'express'
import EventController from '../controllers/event.controller.js'
import { validateSchema } from '../middlewares/validation.middleware.js'
import { eventSchemas } from '../schemas/event.schema.js'
import { verifyToken } from '../middlewares/jwt.middlware.js'
import { requirePermission } from '../config/permissions.js'

const router = Router()

router.use(verifyToken)

// Crear evento
router.post('/',
  requirePermission('EVENTS', 'CREATE'),
  validateSchema(eventSchemas.create),
  EventController.create
)

// Listar eventos con búsqueda y filtrado
router.get('/',
  requirePermission('EVENTS', 'READ'),
  validateSchema(eventSchemas.search),
  EventController.findAll
)

// Obtener evento por ID
router.get('/:id',
  requirePermission('EVENTS', 'READ'),
  validateSchema(eventSchemas.id, 'params'),
  EventController.findById
)

// Actualizar evento
router.put('/:id',
  requirePermission('EVENTS', 'UPDATE'),
  validateSchema(eventSchemas.update),
  validateSchema(eventSchemas.id, 'params'),
  EventController.update
)

// Eliminar evento
router.delete('/:id',
  requirePermission('EVENTS', 'DELETE'),
  validateSchema(eventSchemas.id, 'params'),
  EventController.remove
)

// Obtener eventos próximos
router.get('/upcoming/events',
  requirePermission('EVENTS', 'READ'),
  EventController.getUpcomingEvents
)

// Obtener eventos por estado
router.get('/status/:status',
  requirePermission('EVENTS', 'READ'),
  EventController.getEventsByStatus
)

// Obtener eventos por organizador
router.get('/organizer/:organizerId',
  requirePermission('EVENTS', 'READ'),
  EventController.getEventsByOrganizer
)

export default router 