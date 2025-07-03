import { Router } from 'express'
import { ReportController } from '../controllers/report.controller.js'
import { validateSchema } from '../middlewares/validation.middleware.js'
import { reportSchemas } from '../schemas/report.schema.js'
import { verifyToken } from '../middlewares/jwt.middlware.js'

const router = Router()

// Aplicar middleware de autenticación a todas las rutas
router.use(verifyToken)

/**
 * @route GET /api/reports/membership
 * @desc Generar reporte de membresías
 * @access Admin, Manager, Reports
 */
router.get('/membership', 
  validateSchema(reportSchemas.membershipReport),
  ReportController.generateMembershipReport
)

/**
 * @route GET /api/reports/financial
 * @desc Generar reporte financiero
 * @access Admin, Manager, Finance, Reports
 */
router.get('/financial',
  validateSchema(reportSchemas.financialReport),
  ReportController.generateFinancialReport
)

/**
 * @route GET /api/reports/events
 * @desc Generar reporte de eventos
 * @access Admin, Manager, Events, Reports
 */
router.get('/events',
  validateSchema(reportSchemas.eventReport),
  ReportController.generateEventReport
)

/**
 * @route GET /api/reports/maintenance
 * @desc Generar reporte de mantenimiento
 * @access Admin, Manager, Maintenance, Reports
 */
router.get('/maintenance',
  validateSchema(reportSchemas.maintenanceReport),
  ReportController.generateMaintenanceReport
)

/**
 * @route GET /api/reports/inventory
 * @desc Generar reporte de inventario
 * @access Admin, Manager, Inventory, Reports
 */
router.get('/inventory',
  validateSchema(reportSchemas.inventoryReport),
  ReportController.generateInventoryReport
)

/**
 * @route GET /api/reports/attendance
 * @desc Generar reporte de asistencia
 * @access Admin, Manager, Reports
 */
router.get('/attendance',
  validateSchema(reportSchemas.attendanceReport),
  ReportController.generateAttendanceReport
)

/**
 * @route POST /api/reports/custom
 * @desc Generar reporte personalizado
 * @access Admin, Manager, Reports
 */
router.post('/custom',
  validateSchema(reportSchemas.customReport),
  ReportController.generateCustomReport
)

/**
 * @route GET /api/reports/statistics
 * @desc Obtener estadísticas generales
 * @access Admin, Manager, Reports
 */
router.get('/statistics',
  validateSchema(reportSchemas.statistics),
  ReportController.getGeneralStatistics
)

/**
 * @route GET /api/reports/saved
 * @desc Obtener reportes guardados
 * @access Admin, Manager, Reports
 */
router.get('/saved',
  validateSchema(reportSchemas.getSavedReports),
  ReportController.getSavedReports
)

/**
 * @route POST /api/reports/save
 * @desc Guardar reporte
 * @access Admin, Manager, Reports
 */
router.post('/save',
  validateSchema(reportSchemas.saveReport),
  ReportController.saveReport
)

/**
 * @route DELETE /api/reports/saved/:id
 * @desc Eliminar reporte guardado
 * @access Admin, Manager, Reports
 */
router.delete('/saved/:id',
  validateSchema(reportSchemas.deleteSavedReport),
  ReportController.deleteSavedReport
)

/**
 * @route GET /api/reports/download/:id
 * @desc Descargar reporte en PDF
 * @access Admin, Manager, Reports
 */
router.get('/download/:id',
  validateSchema(reportSchemas.downloadReport),
  ReportController.downloadReport
)

/**
 * @route POST /api/reports/export/excel
 * @desc Exportar reporte a Excel
 * @access Admin, Manager, Reports
 */
router.post('/export/excel',
  validateSchema(reportSchemas.exportToExcel),
  ReportController.exportToExcel
)

// Rutas específicas para descarga de reportes por tipo
/**
 * @route GET /api/reports/membership/download/:id
 * @desc Descargar reporte de membresías en PDF
 * @access Admin, Manager, Reports
 */
router.get('/membership/download/:id',
  validateSchema(reportSchemas.downloadReport),
  ReportController.downloadReport
)

/**
 * @route GET /api/reports/financial/download/:id
 * @desc Descargar reporte financiero en PDF
 * @access Admin, Manager, Finance, Reports
 */
router.get('/financial/download/:id',
  validateSchema(reportSchemas.downloadReport),
  ReportController.downloadReport
)

/**
 * @route GET /api/reports/events/download/:id
 * @desc Descargar reporte de eventos en PDF
 * @access Admin, Manager, Events, Reports
 */
router.get('/events/download/:id',
  validateSchema(reportSchemas.downloadReport),
  ReportController.downloadReport
)

/**
 * @route GET /api/reports/maintenance/download/:id
 * @desc Descargar reporte de mantenimiento en PDF
 * @access Admin, Manager, Maintenance, Reports
 */
router.get('/maintenance/download/:id',
  validateSchema(reportSchemas.downloadReport),
  ReportController.downloadReport
)

/**
 * @route GET /api/reports/inventory/download/:id
 * @desc Descargar reporte de inventario en PDF
 * @access Admin, Manager, Inventory, Reports
 */
router.get('/inventory/download/:id',
  validateSchema(reportSchemas.downloadReport),
  ReportController.downloadReport
)

/**
 * @route GET /api/reports/attendance/download/:id
 * @desc Descargar reporte de asistencia en PDF
 * @access Admin, Manager, Reports
 */
router.get('/attendance/download/:id',
  validateSchema(reportSchemas.downloadReport),
  ReportController.downloadReport
)

/**
 * @route GET /api/reports/custom/download/:id
 * @desc Descargar reporte personalizado en PDF
 * @access Admin, Manager, Reports
 */
router.get('/custom/download/:id',
  validateSchema(reportSchemas.downloadReport),
  ReportController.downloadReport
)

export default router 
