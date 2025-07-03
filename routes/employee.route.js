import { Router } from 'express'
import EmployeeController from '../controllers/employee.controller.js'
import { validateSchema } from '../middlewares/validation.middleware.js'
import { employeeSchemas } from '../schemas/employee.schema.js'
import { verifyToken } from '../middlewares/jwt.middlware.js'
import { requirePermission } from '../config/permissions.js'

const router = Router()

router.use(verifyToken)

// Crear empleado
router.post('/',
  requirePermission('EMPLOYEES', 'CREATE'),
  validateSchema(employeeSchemas.create),
  EmployeeController.create
)

// Listar empleados con búsqueda y filtrado
router.get('/',
  requirePermission('EMPLOYEES', 'READ'),
  validateSchema(employeeSchemas.search),
  EmployeeController.findAll
)

// Obtener detalle de empleado (con tareas de mantenimiento)
router.get('/:id',
  requirePermission('EMPLOYEES', 'READ'),
  validateSchema(employeeSchemas.id, 'params'),
  EmployeeController.findById
)

// Actualizar empleado
router.put('/:id',
  requirePermission('EMPLOYEES', 'UPDATE'),
  validateSchema(employeeSchemas.update),
  validateSchema(employeeSchemas.id, 'params'),
  EmployeeController.update
)

// Eliminar empleado
router.delete('/:id',
  requirePermission('EMPLOYEES', 'DELETE'),
  validateSchema(employeeSchemas.id, 'params'),
  EmployeeController.remove
)

export default router 