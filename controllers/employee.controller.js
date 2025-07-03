import EmployeeModel from '../models/employee.model.js'

const EmployeeController = {
  async create(req, res) {
    try {
      const employee = await EmployeeModel.create(req.body)
      res.status(201).json({ ok: true, id: employee.id, data: employee })
    } catch (error) {
      console.error('Error creating employee:', error)
      res.status(500).json({ ok: false, msg: 'Error al crear empleado', error: error.message })
    }
  },

  async findAll(req, res) {
    try {
      const { search, position, page, limit } = req.query
      const employees = await EmployeeModel.findAll({ search, position, page, limit })
      res.json({ ok: true, data: employees })
    } catch (error) {
      console.error('Error fetching employees:', error)
      res.status(500).json({ ok: false, msg: 'Error al obtener empleados', error: error.message })
    }
  },

  async findById(req, res) {
    try {
      const { id } = req.params
      const employee = await EmployeeModel.findById(id)
      if (!employee) return res.status(404).json({ ok: false, msg: 'Empleado no encontrado' })
      // Obtener tareas de mantenimiento asignadas
      const tasks = await EmployeeModel.getMaintenanceTasks(id)
      res.json({ ok: true, data: { ...employee, maintenance_tasks: tasks } })
    } catch (error) {
      console.error('Error fetching employee:', error)
      res.status(500).json({ ok: false, msg: 'Error al obtener empleado', error: error.message })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const updated = await EmployeeModel.update(id, req.body)
      if (!updated) return res.status(404).json({ ok: false, msg: 'Empleado no encontrado o sin cambios' })
      res.json({ ok: true, data: updated })
    } catch (error) {
      console.error('Error updating employee:', error)
      res.status(500).json({ ok: false, msg: 'Error al actualizar empleado', error: error.message })
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params
      const deleted = await EmployeeModel.remove(id)
      if (!deleted) return res.status(404).json({ ok: false, msg: 'Empleado no encontrado' })
      res.json({ ok: true, data: deleted })
    } catch (error) {
      console.error('Error deleting employee:', error)
      res.status(500).json({ ok: false, msg: 'Error al eliminar empleado', error: error.message })
    }
  }
}

export default EmployeeController 