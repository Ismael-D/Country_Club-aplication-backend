import { MaintenanceModel } from '../models/maintenance.model.js'
import PERMISSIONS from '../config/permissions.js'

// =====================================================
// CONTROLADORES PRINCIPALES DE MANTENIMIENTO
// =====================================================

const findAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, priority, category, assigned_to, date_from, date_to } = req.query
        const offset = (page - 1) * limit

        // Debug: Verificar qué datos recibe el controlador
        console.log('🔍 Debug - req.user:', req.user)
        console.log('🔍 Debug - req.role:', req.role)
        console.log('🔍 Debug - req.email:', req.email)

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'MAINTENANCE', 'READ')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para ver tareas de mantenimiento'
            })
        }

        const filters = {}
        if (status) filters.status = status
        if (priority) filters.priority = priority
        if (category) filters.category = category
        if (assigned_to) filters.assigned_to = assigned_to
        if (date_from) filters.date_from = date_from
        if (date_to) filters.date_to = date_to

        console.log('🔍 Debug - Calling MaintenanceModel.findAllWithPagination')
        const { tasks, total } = await MaintenanceModel.findAllWithPagination(limit, offset, filters)
        
        const totalPages = Math.ceil(total / limit)

        return res.json({
            ok: true,
            data: tasks,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: totalPages
            }
        })
    } catch (error) {
        console.error('❌ Error en findAll maintenance:', error)
        console.error('❌ Error stack:', error.stack)
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
        if (!PERMISSIONS.hasPermission(req.user.role, 'MAINTENANCE', 'READ')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para ver tareas de mantenimiento'
            })
        }

        const task = await MaintenanceModel.findById(id)
        if (!task) {
            return res.status(404).json({
                ok: false,
                msg: 'Tarea de mantenimiento no encontrada'
            })
        }

        return res.json({
            ok: true,
            data: task
        })
    } catch (error) {
        console.error('Error en findOne maintenance:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const create = async (req, res) => {
    try {
        console.log('🔍 [Maintenance] Create method called')
        console.log('🔍 [Maintenance] req.user:', req.user)
        console.log('🔍 [Maintenance] req.body:', req.body)
        
        const taskData = req.body

        // Verificar permisos
        console.log('🔍 [Maintenance] Checking permissions...')
        console.log('🔍 [Maintenance] req.user.role:', req.user.role)
        console.log('🔍 [Maintenance] PERMISSIONS.hasPermission result:', PERMISSIONS.hasPermission(req.user.role, 'MAINTENANCE', 'CREATE'))
        
        if (!PERMISSIONS.hasPermission(req.user.role, 'MAINTENANCE', 'CREATE')) {
            console.log('❌ [Maintenance] Permission denied')
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para crear tareas de mantenimiento'
            })
        }

        console.log('🔍 [Maintenance] Calling MaintenanceModel.create...')
        const newTask = await MaintenanceModel.create({
            ...taskData,
            requested_by: req.user.id
        })
        console.log('✅ [Maintenance] Model.create result:', newTask)

        return res.status(201).json({
            ok: true,
            id: newTask.id,
            msg: 'Tarea de mantenimiento creada exitosamente',
            data: newTask
        })
    } catch (error) {
        console.error('❌ [Maintenance] Error en create maintenance:', error)
        console.error('❌ [Maintenance] Error stack:', error.stack)
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
        if (!PERMISSIONS.hasPermission(req.user.role, 'MAINTENANCE', 'UPDATE')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para actualizar tareas de mantenimiento'
            })
        }

        // Verificar si la tarea existe
        const existingTask = await MaintenanceModel.findById(id)
        if (!existingTask) {
            return res.status(404).json({
                ok: false,
                msg: 'Tarea de mantenimiento no encontrada'
            })
        }

        const updatedTask = await MaintenanceModel.update(id, updateData)

        return res.json({
            ok: true,
            msg: 'Tarea de mantenimiento actualizada exitosamente',
            data: updatedTask
        })
    } catch (error) {
        console.error('Error en update maintenance:', error)
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
        if (!PERMISSIONS.hasPermission(req.user.role, 'MAINTENANCE', 'DELETE')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para eliminar tareas de mantenimiento'
            })
        }

        // Verificar si la tarea existe
        const existingTask = await MaintenanceModel.findById(id)
        if (!existingTask) {
            return res.status(404).json({
                ok: false,
                msg: 'Tarea de mantenimiento no encontrada'
            })
        }

        // Solo permitir eliminar tareas pendientes o canceladas
        if (existingTask.status === 'in_progress' || existingTask.status === 'completed') {
            return res.status(400).json({
                ok: false,
                msg: 'No se puede eliminar una tarea en progreso o completada'
            })
        }

        await MaintenanceModel.remove(id)

        return res.json({
            ok: true,
            msg: 'Tarea de mantenimiento eliminada exitosamente'
        })
    } catch (error) {
        console.error('Error en remove maintenance:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

// =====================================================
// CONTROLADORES DE INCIDENCIAS
// =====================================================

const getIncidents = async (req, res) => {
    try {
        const { page = 1, limit = 10, priority, status, location } = req.query
        const offset = (page - 1) * limit

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'MAINTENANCE', 'READ')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para ver incidencias'
            })
        }

        const filters = {}
        if (priority) filters.priority = priority
        if (status) filters.status = status
        if (location) filters.location = location

        const { incidents, total } = await MaintenanceModel.getIncidentsWithPagination(limit, offset, filters)
        
        const totalPages = Math.ceil(total / limit)

        return res.json({
            ok: true,
            data: incidents,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: totalPages
            }
        })
    } catch (error) {
        console.error('Error en getIncidents:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const createIncident = async (req, res) => {
    try {
        const incidentData = req.body

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'MAINTENANCE', 'CREATE')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para crear incidencias'
            })
        }

        const newIncident = await MaintenanceModel.createIncident({
            ...incidentData,
            reported_by: req.user.id
        })

        return res.status(201).json({
            ok: true,
            msg: 'Incidencia reportada exitosamente',
            data: newIncident
        })
    } catch (error) {
        console.error('Error en createIncident:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

// =====================================================
// CONTROLADORES DE EQUIPOS Y HERRAMIENTAS
// =====================================================

const getEquipment = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, status, location } = req.query
        const offset = (page - 1) * limit

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'MAINTENANCE', 'READ')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para ver equipos'
            })
        }

        const filters = {}
        if (category) filters.category = category
        if (status) filters.status = status
        if (location) filters.location = location

        const { equipment, total } = await MaintenanceModel.getEquipmentWithPagination(limit, offset, filters)
        
        const totalPages = Math.ceil(total / limit)

        return res.json({
            ok: true,
            data: equipment,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: totalPages
            }
        })
    } catch (error) {
        console.error('Error en getEquipment:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const createEquipment = async (req, res) => {
    try {
        const equipmentData = req.body

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'MAINTENANCE', 'CREATE')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para crear equipos'
            })
        }

        const newEquipment = await MaintenanceModel.createEquipment({
            ...equipmentData,
            registered_by: req.user.id
        })

        return res.status(201).json({
            ok: true,
            msg: 'Equipo registrado exitosamente',
            data: newEquipment
        })
    } catch (error) {
        console.error('Error en createEquipment:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const updateEquipment = async (req, res) => {
    try {
        const { id } = req.params
        const updateData = req.body

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'MAINTENANCE', 'UPDATE')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para actualizar equipos'
            })
        }

        const updatedEquipment = await MaintenanceModel.updateEquipment(id, updateData)

        return res.json({
            ok: true,
            msg: 'Equipo actualizado exitosamente',
            data: updatedEquipment
        })
    } catch (error) {
        console.error('Error en updateEquipment:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

// =====================================================
// CONTROLADORES DE MANTENIMIENTO PREVENTIVO
// =====================================================

const getPreventiveMaintenance = async (req, res) => {
    try {
        const { page = 1, limit = 10, equipment_id, frequency } = req.query
        const offset = (page - 1) * limit

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'MAINTENANCE', 'READ')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para ver mantenimiento preventivo'
            })
        }

        const filters = {}
        if (equipment_id) filters.equipment_id = equipment_id
        if (frequency) filters.frequency = frequency

        const { preventiveTasks, total } = await MaintenanceModel.getPreventiveMaintenanceWithPagination(limit, offset, filters)
        
        const totalPages = Math.ceil(total / limit)

        return res.json({
            ok: true,
            data: preventiveTasks,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: totalPages
            }
        })
    } catch (error) {
        console.error('Error en getPreventiveMaintenance:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const createPreventiveMaintenance = async (req, res) => {
    try {
        const preventiveData = req.body

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'MAINTENANCE', 'CREATE')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para crear mantenimiento preventivo'
            })
        }

        const newPreventive = await MaintenanceModel.createPreventiveMaintenance({
            ...preventiveData,
            created_by: req.user.id
        })

        return res.status(201).json({
            ok: true,
            msg: 'Mantenimiento preventivo programado exitosamente',
            data: newPreventive
        })
    } catch (error) {
        console.error('Error en createPreventiveMaintenance:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

// =====================================================
// CONTROLADORES DE BÚSQUEDA Y ESTADÍSTICAS
// =====================================================

const searchMaintenance = async (req, res) => {
    try {
        const { q, page = 1, limit = 10 } = req.query
        const offset = (page - 1) * limit

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'MAINTENANCE', 'READ')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para buscar tareas de mantenimiento'
            })
        }

        if (!q || q.trim().length < 2) {
            return res.status(400).json({
                ok: false,
                msg: 'El término de búsqueda debe tener al menos 2 caracteres'
            })
        }

        const { tasks, total } = await MaintenanceModel.search(q, limit, offset)
        
        const totalPages = Math.ceil(total / limit)

        return res.json({
            ok: true,
            data: tasks,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: totalPages
            }
        })
    } catch (error) {
        console.error('Error en searchMaintenance:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const getMaintenanceStatistics = async (req, res) => {
    try {
        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'MAINTENANCE', 'READ')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para ver estadísticas'
            })
        }

        const statistics = await MaintenanceModel.getStatistics()

        return res.json({
            ok: true,
            data: statistics
        })
    } catch (error) {
        console.error('Error en getMaintenanceStatistics:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const getPendingTasks = async (req, res) => {
    try {
        const { limit = 10 } = req.query

        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'MAINTENANCE', 'READ')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para ver tareas pendientes'
            })
        }

        const tasks = await MaintenanceModel.getPendingTasks(limit)

        return res.json({
            ok: true,
            data: tasks
        })
    } catch (error) {
        console.error('Error en getPendingTasks:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const getOverdueTasks = async (req, res) => {
    try {
        // Verificar permisos
        if (!PERMISSIONS.hasPermission(req.user.role, 'MAINTENANCE', 'READ')) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para ver tareas vencidas'
            })
        }

        const tasks = await MaintenanceModel.getOverdueTasks()

        return res.json({
            ok: true,
            data: tasks
        })
    } catch (error) {
        console.error('Error en getOverdueTasks:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

export const MaintenanceController = {
    findAll,
    findOne,
    create,
    update,
    remove,
    getIncidents,
    createIncident,
    getEquipment,
    createEquipment,
    updateEquipment,
    getPreventiveMaintenance,
    createPreventiveMaintenance,
    searchMaintenance,
    getMaintenanceStatistics,
    getPendingTasks,
    getOverdueTasks
} 