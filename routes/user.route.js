import { Router } from 'express'
import UserController from '../controllers/user.controller.js'
import { validateSchema } from '../middlewares/validation.middleware.js'
import { userSchemas } from '../schemas/user.schema.js'
import { verifyToken } from '../middlewares/jwt.middlware.js'
import { requirePermission } from '../config/permissions.js'

const router = Router()

router.use(verifyToken)

// Crear usuario
router.post('/',
  requirePermission('ADMIN', 'MANAGE_USERS'),
  validateSchema(userSchemas.create),
  UserController.create
)

// Listar usuarios con búsqueda y filtrado
router.get('/',
  requirePermission('ADMIN', 'MANAGE_USERS'),
  validateSchema(userSchemas.search),
  UserController.findAll
)

// Obtener usuario por ID
router.get('/:id',
  requirePermission('ADMIN', 'MANAGE_USERS'),
  validateSchema(userSchemas.id, 'params'),
  UserController.findById
)

// Actualizar usuario
router.put('/:id',
  requirePermission('ADMIN', 'MANAGE_USERS'),
  validateSchema(userSchemas.update),
  validateSchema(userSchemas.id, 'params'),
  UserController.update
)

// Eliminar usuario
router.delete('/:id',
  requirePermission('ADMIN', 'MANAGE_USERS'),
  validateSchema(userSchemas.id, 'params'),
  UserController.remove
)

// Obtener usuarios por rol
router.get('/role/:role',
  requirePermission('ADMIN', 'MANAGE_USERS'),
  UserController.getUsersByRole
)

export default router 