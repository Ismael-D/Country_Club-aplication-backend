import { Router } from 'express'
import MemberController from '../controllers/member.controller.js'
import { validateSchema } from '../middlewares/validation.middleware.js'
import { memberSchemas } from '../schemas/member.schema.js'
import { verifyToken } from '../middlewares/jwt.middlware.js'
import { requirePermission } from '../config/permissions.js'

const router = Router()

router.use(verifyToken)

// Crear miembro
router.post('/',
  requirePermission('MEMBERS', 'CREATE'),
  validateSchema(memberSchemas.create),
  MemberController.create
)

// Listar miembros con búsqueda y filtrado
router.get('/',
  requirePermission('MEMBERS', 'READ'),
  validateSchema(memberSchemas.search),
  MemberController.findAll
)

// Obtener miembro por ID
router.get('/:id',
  requirePermission('MEMBERS', 'READ'),
  validateSchema(memberSchemas.id, 'params'),
  MemberController.findById
)

// Actualizar miembro
router.put('/:id',
  requirePermission('MEMBERS', 'UPDATE'),
  validateSchema(memberSchemas.update),
  validateSchema(memberSchemas.id, 'params'),
  MemberController.update
)

// Eliminar miembro
router.delete('/:id',
  requirePermission('MEMBERS', 'DELETE'),
  validateSchema(memberSchemas.id, 'params'),
  MemberController.remove
)

// Obtener miembros activos
router.get('/status/active',
  requirePermission('MEMBERS', 'READ'),
  MemberController.getActiveMembers
)

// Obtener miembros por estado
router.get('/status/:status',
  requirePermission('MEMBERS', 'READ'),
  MemberController.getMembersByStatus
)

export default router 