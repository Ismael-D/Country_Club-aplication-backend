import { Router } from 'express'
import { InventoryController } from '../controllers/inventory.controller.js'
import { validateSchema } from '../middlewares/validation.middleware.js'
import { inventorySchemas } from '../schemas/inventory.schema.js'
import { verifyToken } from '../middlewares/jwt.middlware.js'

const router = Router()

// =====================================================
// MIDDLEWARE DE AUTENTICACIÓN PARA TODAS LAS RUTAS
// =====================================================
router.use(verifyToken)

// =====================================================
// RUTAS PRINCIPALES DE PRODUCTOS
// =====================================================

/**
 * @route GET /api/inventory
 * @desc Obtener todos los productos del inventario con paginación y filtros
 * @access Private - Requiere permisos de lectura de inventario
 */
router.get('/', InventoryController.findAll)

/**
 * @route GET /api/inventory/search
 * @desc Buscar productos por término
 * @access Private - Requiere permisos de lectura de inventario
 */
router.get('/search', InventoryController.searchInventory)

/**
 * @route GET /api/inventory/:id
 * @desc Obtener un producto específico
 * @access Private - Requiere permisos de lectura de inventario
 */
router.get('/:id', InventoryController.findOne)

/**
 * @route POST /api/inventory
 * @desc Crear un nuevo producto
 * @access Private - Requiere permisos de creación de inventario
 */
router.post('/', 
    validateSchema(inventorySchemas.createProduct),
    InventoryController.create
)

/**
 * @route PUT /api/inventory/:id
 * @desc Actualizar un producto
 * @access Private - Requiere permisos de actualización de inventario
 */
router.put('/:id', 
    validateSchema(inventorySchemas.updateProduct),
    InventoryController.update
)

/**
 * @route DELETE /api/inventory/:id
 * @desc Eliminar un producto (solo si no tiene stock)
 * @access Private - Requiere permisos de eliminación de inventario
 */
router.delete('/:id', InventoryController.remove)

// =====================================================
// RUTAS DE CATEGORÍAS
// =====================================================

/**
 * @route GET /api/inventory/categories
 * @desc Obtener todas las categorías
 * @access Private - Requiere permisos de lectura de inventario
 */
router.get('/categories', InventoryController.getCategories)

/**
 * @route POST /api/inventory/categories
 * @desc Crear una nueva categoría
 * @access Private - Requiere permisos de creación de inventario
 */
router.post('/categories', 
    validateSchema(inventorySchemas.createCategory),
    InventoryController.createCategory
)

// =====================================================
// RUTAS DE PROVEEDORES
// =====================================================

/**
 * @route GET /api/inventory/suppliers
 * @desc Obtener todos los proveedores con paginación y filtros
 * @access Private - Requiere permisos de lectura de inventario
 */
router.get('/suppliers', InventoryController.getSuppliers)

/**
 * @route POST /api/inventory/suppliers
 * @desc Crear un nuevo proveedor
 * @access Private - Requiere permisos de creación de inventario
 */
router.post('/suppliers', 
    validateSchema(inventorySchemas.createSupplier),
    InventoryController.createSupplier
)

/**
 * @route PUT /api/inventory/suppliers/:id
 * @desc Actualizar un proveedor
 * @access Private - Requiere permisos de actualización de inventario
 */
router.put('/suppliers/:id', 
    validateSchema(inventorySchemas.updateSupplier),
    InventoryController.updateSupplier
)

// =====================================================
// RUTAS DE MOVIMIENTOS DE INVENTARIO
// =====================================================

/**
 * @route GET /api/inventory/movements
 * @desc Obtener todos los movimientos de inventario
 * @access Private - Requiere permisos de lectura de inventario
 */
router.get('/movements', InventoryController.getMovements)

/**
 * @route POST /api/inventory/movements
 * @desc Crear un nuevo movimiento de inventario
 * @access Private - Requiere permisos de actualización de inventario
 */
router.post('/movements', 
    validateSchema(inventorySchemas.createMovement),
    InventoryController.createMovement
)

// =====================================================
// RUTAS DE COMPRAS
// =====================================================

/**
 * @route GET /api/inventory/purchases
 * @desc Obtener todas las compras con paginación y filtros
 * @access Private - Requiere permisos de lectura de inventario
 */
router.get('/purchases', InventoryController.getPurchases)

/**
 * @route POST /api/inventory/purchases
 * @desc Crear una nueva compra
 * @access Private - Requiere permisos de creación de inventario
 */
router.post('/purchases', 
    validateSchema(inventorySchemas.createPurchase),
    InventoryController.createPurchase
)

/**
 * @route PUT /api/inventory/purchases/:id/status
 * @desc Actualizar el estado de una compra
 * @access Private - Requiere permisos de actualización de inventario
 */
router.put('/purchases/:id/status', 
    validateSchema(inventorySchemas.updatePurchaseStatus),
    InventoryController.updatePurchaseStatus
)

// =====================================================
// RUTAS DE ESTADÍSTICAS Y REPORTES
// =====================================================

/**
 * @route GET /api/inventory/statistics
 * @desc Obtener estadísticas generales del inventario
 * @access Private - Requiere permisos de lectura de inventario
 */
router.get('/statistics', InventoryController.getInventoryStatistics)

/**
 * @route GET /api/inventory/low-stock
 * @desc Obtener productos con bajo stock
 * @access Private - Requiere permisos de lectura de inventario
 */
router.get('/low-stock', InventoryController.getLowStockProducts)

/**
 * @route GET /api/inventory/expired
 * @desc Obtener productos vencidos
 * @access Private - Requiere permisos de lectura de inventario
 */
router.get('/expired', InventoryController.getExpiredProducts)

/**
 * @route GET /api/inventory/by-category
 * @desc Obtener productos agrupados por categoría
 * @access Private - Requiere permisos de lectura de inventario
 */
router.get('/by-category', InventoryController.getProductsByCategory)

export default router 
