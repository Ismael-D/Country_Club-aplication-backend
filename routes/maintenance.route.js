import { Router } from 'express'
import { MaintenanceController } from '../controllers/maintenance.controller.js'
import { validateSchema } from '../middlewares/validation.middleware.js'
import { maintenanceSchemas } from '../schemas/maintenance.schema.js'
import { verifyToken } from '../middlewares/jwt.middlware.js'

const router = Router()

// =====================================================
// MIDDLEWARE DE AUTENTICACIÓN PARA TODAS LAS RUTAS
// =====================================================
router.use(verifyToken)

// =====================================================
// RUTAS PRINCIPALES DE TAREAS DE MANTENIMIENTO
// =====================================================

/**
 * @route GET /api/maintenance
 * @desc Obtener todas las tareas de mantenimiento con paginación y filtros
 * @access Private - Requiere permisos de lectura de mantenimiento
 */
router.get('/', MaintenanceController.findAll)

/**
 * @route GET /api/maintenance/search
 * @desc Buscar tareas de mantenimiento por término
 * @access Private - Requiere permisos de lectura de mantenimiento
 */
router.get('/search', MaintenanceController.searchMaintenance)

/**
 * @route GET /api/maintenance/:id
 * @desc Obtener una tarea de mantenimiento específica
 * @access Private - Requiere permisos de lectura de mantenimiento
 */
router.get('/:id', MaintenanceController.findOne)

/**
 * @route POST /api/maintenance
 * @desc Crear una nueva tarea de mantenimiento
 * @access Private - Requiere permisos de creación de mantenimiento
 */
router.post('/', 
    validateSchema(maintenanceSchemas.createTask),
    MaintenanceController.create
)

/**
 * @route PUT /api/maintenance/:id
 * @desc Actualizar una tarea de mantenimiento
 * @access Private - Requiere permisos de actualización de mantenimiento
 */
router.put('/:id', 
    validateSchema(maintenanceSchemas.updateTask),
    MaintenanceController.update
)

/**
 * @route DELETE /api/maintenance/:id
 * @desc Eliminar una tarea de mantenimiento
 * @access Private - Requiere permisos de eliminación de mantenimiento
 */
router.delete('/:id', MaintenanceController.remove)

// =====================================================
// RUTAS DE INCIDENCIAS
// =====================================================

/**
 * @route GET /api/maintenance/incidents
 * @desc Obtener todas las incidencias con paginación y filtros
 * @access Private - Requiere permisos de lectura de mantenimiento
 */
router.get('/incidents', MaintenanceController.getIncidents)

/**
 * @route POST /api/maintenance/incidents
 * @desc Crear una nueva incidencia
 * @access Private - Requiere permisos de creación de mantenimiento
 */
router.post('/incidents', 
    validateSchema(maintenanceSchemas.createIncident),
    MaintenanceController.createIncident
)

// =====================================================
// RUTAS DE EQUIPOS Y HERRAMIENTAS
// =====================================================

/**
 * @route GET /api/maintenance/equipment
 * @desc Obtener todos los equipos con paginación y filtros
 * @access Private - Requiere permisos de lectura de mantenimiento
 */
router.get('/equipment', MaintenanceController.getEquipment)

/**
 * @route POST /api/maintenance/equipment
 * @desc Registrar un nuevo equipo
 * @access Private - Requiere permisos de creación de mantenimiento
 */
router.post('/equipment', 
    validateSchema(maintenanceSchemas.createEquipment),
    MaintenanceController.createEquipment
)

/**
 * @route PUT /api/maintenance/equipment/:id
 * @desc Actualizar información de un equipo
 * @access Private - Requiere permisos de actualización de mantenimiento
 */
router.put('/equipment/:id', 
    validateSchema(maintenanceSchemas.updateEquipment),
    MaintenanceController.updateEquipment
)

// =====================================================
// RUTAS DE MANTENIMIENTO PREVENTIVO
// =====================================================

/**
 * @route GET /api/maintenance/preventive
 * @desc Obtener tareas de mantenimiento preventivo
 * @access Private - Requiere permisos de lectura de mantenimiento
 */
router.get('/preventive', MaintenanceController.getPreventiveMaintenance)

/**
 * @route POST /api/maintenance/preventive
 * @desc Crear una nueva tarea de mantenimiento preventivo
 * @access Private - Requiere permisos de creación de mantenimiento
 */
router.post('/preventive', 
    validateSchema(maintenanceSchemas.createPreventive),
    MaintenanceController.createPreventiveMaintenance
)

// =====================================================
// RUTAS DE ESTADÍSTICAS Y REPORTES
// =====================================================

/**
 * @route GET /api/maintenance/statistics
 * @desc Obtener estadísticas generales de mantenimiento
 * @access Private - Requiere permisos de lectura de mantenimiento
 */
router.get('/statistics', MaintenanceController.getMaintenanceStatistics)

/**
 * @route GET /api/maintenance/pending
 * @desc Obtener tareas pendientes
 * @access Private - Requiere permisos de lectura de mantenimiento
 */
router.get('/pending', MaintenanceController.getPendingTasks)

/**
 * @route GET /api/maintenance/overdue
 * @desc Obtener tareas vencidas
 * @access Private - Requiere permisos de lectura de mantenimiento
 */
router.get('/overdue', MaintenanceController.getOverdueTasks)

export default router 
