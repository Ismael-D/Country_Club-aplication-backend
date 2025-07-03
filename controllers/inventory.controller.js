import { InventoryModel } from '../models/inventory.model.js'
import { PERMISSIONS } from '../config/permissions.js'

// =====================================================
// CONTROLADORES PRINCIPALES DE PRODUCTOS
// =====================================================

const findAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, supplier, status, low_stock, search } = req.query
        const offset = (page - 1) * limit

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'INVENTORY', 'READ')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para ver el inventario'
            })
        }

        const filters = {}
        if (category) filters.category = category
        if (supplier) filters.supplier = supplier
        if (status) filters.status = status
        if (low_stock === 'true') filters.low_stock = true
        if (search) filters.search = search

        const { products, total } = await InventoryModel.findAllWithPagination(limit, offset, filters)
        
        const totalPages = Math.ceil(total / limit)

        return res.json({
            ok: true,
            data: products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: totalPages
            }
        })
    } catch (error) {
        console.error('Error en findAll inventory:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const findOne = async (req, res) => {
    try {
        const { id } = req.params

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'INVENTORY', 'READ')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para ver productos del inventario'
            })
        }

        const product = await InventoryModel.findById(id)
        if (!product) {
            return res.status(404).json({
                ok: false,
                msg: 'Producto no encontrado'
            })
        }

        return res.json({
            ok: true,
            data: product
        })
    } catch (error) {
        console.error('Error en findOne inventory:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const create = async (req, res) => {
    try {
        const productData = req.body

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'INVENTORY', 'CREATE')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para crear productos en el inventario'
            })
        }

        const newProduct = await InventoryModel.create({
            ...productData,
            created_by: req.user.id
        })

        return res.status(201).json({
            ok: true,
            id: newProduct.id,
            msg: 'Producto creado exitosamente',
            data: newProduct
        })
    } catch (error) {
        console.error('Error en create inventory:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params
        const updateData = req.body

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'INVENTORY', 'UPDATE')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para actualizar productos del inventario'
            })
        }

        // Verificar si el producto existe
        const existingProduct = await InventoryModel.findById(id)
        if (!existingProduct) {
            return res.status(404).json({
                ok: false,
                msg: 'Producto no encontrado'
            })
        }

        const updatedProduct = await InventoryModel.update(id, updateData)

        return res.json({
            ok: true,
            msg: 'Producto actualizado exitosamente',
            data: updatedProduct
        })
    } catch (error) {
        console.error('Error en update inventory:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const remove = async (req, res) => {
    try {
        const { id } = req.params

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'INVENTORY', 'DELETE')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para eliminar productos del inventario'
            })
        }

        // Verificar si el producto existe
        const existingProduct = await InventoryModel.findById(id)
        if (!existingProduct) {
            return res.status(404).json({
                ok: false,
                msg: 'Producto no encontrado'
            })
        }

        // Solo permitir eliminar productos sin stock
        if (existingProduct.current_stock > 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No se puede eliminar un producto que tiene stock disponible'
            })
        }

        await InventoryModel.remove(id)

        return res.json({
            ok: true,
            msg: 'Producto eliminado exitosamente'
        })
    } catch (error) {
        console.error('Error en remove inventory:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

// =====================================================
// CONTROLADORES DE CATEGORÍAS
// =====================================================

const getCategories = async (req, res) => {
    try {
        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'INVENTORY', 'READ')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para ver categorías'
            })
        }

        const categories = await InventoryModel.getCategories()

        return res.json({
            ok: true,
            data: categories
        })
    } catch (error) {
        console.error('Error en getCategories:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const createCategory = async (req, res) => {
    try {
        const categoryData = req.body

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'INVENTORY', 'CREATE')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para crear categorías'
            })
        }

        const newCategory = await InventoryModel.createCategory({
            ...categoryData,
            created_by: req.user.id
        })

        return res.status(201).json({
            ok: true,
            msg: 'Categoría creada exitosamente',
            data: newCategory
        })
    } catch (error) {
        console.error('Error en createCategory:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

// =====================================================
// CONTROLADORES DE PROVEEDORES
// =====================================================

const getSuppliers = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query
        const offset = (page - 1) * limit

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'INVENTORY', 'READ')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para ver proveedores'
            })
        }

        const filters = {}
        if (status) filters.status = status
        if (search) filters.search = search

        const { suppliers, total } = await InventoryModel.getSuppliersWithPagination(limit, offset, filters)
        
        const totalPages = Math.ceil(total / limit)

        return res.json({
            ok: true,
            data: suppliers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: totalPages
            }
        })
    } catch (error) {
        console.error('Error en getSuppliers:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const createSupplier = async (req, res) => {
    try {
        const supplierData = req.body

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'INVENTORY', 'CREATE')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para crear proveedores'
            })
        }

        const newSupplier = await InventoryModel.createSupplier({
            ...supplierData,
            created_by: req.user.id
        })

        return res.status(201).json({
            ok: true,
            msg: 'Proveedor creado exitosamente',
            data: newSupplier
        })
    } catch (error) {
        console.error('Error en createSupplier:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params
        const updateData = req.body

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'INVENTORY', 'UPDATE')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para actualizar proveedores'
            })
        }

        const updatedSupplier = await InventoryModel.updateSupplier(id, updateData)

        return res.json({
            ok: true,
            msg: 'Proveedor actualizado exitosamente',
            data: updatedSupplier
        })
    } catch (error) {
        console.error('Error en updateSupplier:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

// =====================================================
// CONTROLADORES DE MOVIMIENTOS DE INVENTARIO
// =====================================================

const getMovements = async (req, res) => {
    try {
        const { page = 1, limit = 10, product_id, movement_type, date_from, date_to } = req.query
        const offset = (page - 1) * limit

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'INVENTORY', 'READ')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para ver movimientos de inventario'
            })
        }

        const filters = {}
        if (product_id) filters.product_id = product_id
        if (movement_type) filters.movement_type = movement_type
        if (date_from) filters.date_from = date_from
        if (date_to) filters.date_to = date_to

        const { movements, total } = await InventoryModel.getMovementsWithPagination(limit, offset, filters)
        
        const totalPages = Math.ceil(total / limit)

        return res.json({
            ok: true,
            data: movements,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: totalPages
            }
        })
    } catch (error) {
        console.error('Error en getMovements:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const createMovement = async (req, res) => {
    try {
        const movementData = req.body

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'INVENTORY', 'UPDATE')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para crear movimientos de inventario'
            })
        }

        const newMovement = await InventoryModel.createMovement({
            ...movementData,
            created_by: req.user.id
        })

        return res.status(201).json({
            ok: true,
            msg: 'Movimiento de inventario registrado exitosamente',
            data: newMovement
        })
    } catch (error) {
        console.error('Error en createMovement:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

// =====================================================
// CONTROLADORES DE COMPRAS Y PEDIDOS
// =====================================================

const getPurchases = async (req, res) => {
    try {
        const { page = 1, limit = 10, supplier_id, status, date_from, date_to } = req.query
        const offset = (page - 1) * limit

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'INVENTORY', 'READ')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para ver compras'
            })
        }

        const filters = {}
        if (supplier_id) filters.supplier_id = supplier_id
        if (status) filters.status = status
        if (date_from) filters.date_from = date_from
        if (date_to) filters.date_to = date_to

        const { purchases, total } = await InventoryModel.getPurchasesWithPagination(limit, offset, filters)
        
        const totalPages = Math.ceil(total / limit)

        return res.json({
            ok: true,
            data: purchases,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: totalPages
            }
        })
    } catch (error) {
        console.error('Error en getPurchases:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const createPurchase = async (req, res) => {
    try {
        const purchaseData = req.body

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'INVENTORY', 'CREATE')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para crear compras'
            })
        }

        const newPurchase = await InventoryModel.createPurchase({
            ...purchaseData,
            created_by: req.user.id
        })

        return res.status(201).json({
            ok: true,
            msg: 'Compra creada exitosamente',
            data: newPurchase
        })
    } catch (error) {
        console.error('Error en createPurchase:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const updatePurchaseStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'INVENTORY', 'UPDATE')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para actualizar compras'
            })
        }

        const updatedPurchase = await InventoryModel.updatePurchaseStatus(id, status, req.user.id)

        return res.json({
            ok: true,
            msg: 'Estado de compra actualizado exitosamente',
            data: updatedPurchase
        })
    } catch (error) {
        console.error('Error en updatePurchaseStatus:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

// =====================================================
// CONTROLADORES DE BÚSQUEDA Y ESTADÍSTICAS
// =====================================================

const searchInventory = async (req, res) => {
    try {
        const { q, page = 1, limit = 10 } = req.query
        const offset = (page - 1) * limit

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'INVENTORY', 'READ')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para buscar en el inventario'
            })
        }

        if (!q || q.trim().length < 2) {
            return res.status(400).json({
                ok: false,
                msg: 'El término de búsqueda debe tener al menos 2 caracteres'
            })
        }

        const { products, total } = await InventoryModel.search(q, limit, offset)
        
        const totalPages = Math.ceil(total / limit)

        return res.json({
            ok: true,
            data: products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: totalPages
            }
        })
    } catch (error) {
        console.error('Error en searchInventory:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const getInventoryStatistics = async (req, res) => {
    try {
        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'INVENTORY', 'READ')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para ver estadísticas del inventario'
            })
        }

        const statistics = await InventoryModel.getStatistics()

        return res.json({
            ok: true,
            data: statistics
        })
    } catch (error) {
        console.error('Error en getInventoryStatistics:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const getLowStockProducts = async (req, res) => {
    try {
        const { limit = 10 } = req.query

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'INVENTORY', 'READ')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para ver productos con bajo stock'
            })
        }

        const products = await InventoryModel.getLowStockProducts(limit)

        return res.json({
            ok: true,
            data: products
        })
    } catch (error) {
        console.error('Error en getLowStockProducts:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const getExpiredProducts = async (req, res) => {
    try {
        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'INVENTORY', 'READ')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para ver productos vencidos'
            })
        }

        const products = await InventoryModel.getExpiredProducts()

        return res.json({
            ok: true,
            data: products
        })
    } catch (error) {
        console.error('Error en getExpiredProducts:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const getProductsByCategory = async (req, res) => {
    try {
        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'INVENTORY', 'READ')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para ver productos por categoría'
            })
        }

        const products = await InventoryModel.getProductsByCategory()

        return res.json({
            ok: true,
            data: products
        })
    } catch (error) {
        console.error('Error en getProductsByCategory:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

export const InventoryController = {
    findAll,
    findOne,
    create,
    update,
    remove,
    getCategories,
    createCategory,
    getSuppliers,
    createSupplier,
    updateSupplier,
    getMovements,
    createMovement,
    getPurchases,
    createPurchase,
    updatePurchaseStatus,
    searchInventory,
    getInventoryStatistics,
    getLowStockProducts,
    getExpiredProducts,
    getProductsByCategory
} 