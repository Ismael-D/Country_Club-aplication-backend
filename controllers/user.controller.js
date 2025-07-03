import UserModel from '../models/user.model.js'

const UserController = {
  async create(req, res) {
    try {
      const user = await UserModel.create(req.body)
      res.status(201).json({ ok: true, id: user.id, data: user })
    } catch (error) {
      console.error('Error creating user:', error)
      res.status(500).json({ ok: false, msg: 'Error al crear usuario', error: error.message })
    }
  },

  async findAll(req, res) {
    try {
      const { search, role, status, page, limit } = req.query
      const result = await UserModel.findAll({ search, role, status, page, limit })
      res.json({ ok: true, data: result })
    } catch (error) {
      console.error('Error fetching users:', error)
      res.status(500).json({ ok: false, msg: 'Error al obtener usuarios', error: error.message })
    }
  },

  async findById(req, res) {
    try {
      const { id } = req.params
      const user = await UserModel.findById(id)
      if (!user) return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' })
      res.json({ ok: true, data: user })
    } catch (error) {
      console.error('Error fetching user:', error)
      res.status(500).json({ ok: false, msg: 'Error al obtener usuario', error: error.message })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const updated = await UserModel.update(id, req.body)
      if (!updated) return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' })
      res.json({ ok: true, data: updated })
    } catch (error) {
      console.error('Error updating user:', error)
      res.status(500).json({ ok: false, msg: 'Error al actualizar usuario', error: error.message })
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params
      const deleted = await UserModel.remove(id)
      if (!deleted) return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' })
      res.json({ ok: true, data: deleted })
    } catch (error) {
      console.error('Error deleting user:', error)
      res.status(500).json({ ok: false, msg: 'Error al eliminar usuario', error: error.message })
    }
  },

  async getUsersByRole(req, res) {
    try {
      const { role } = req.params
      const users = await UserModel.getUsersByRole(role)
      res.json({ ok: true, data: users })
    } catch (error) {
      console.error('Error fetching users by role:', error)
      res.status(500).json({ ok: false, msg: 'Error al obtener usuarios por rol', error: error.message })
    }
  }
}

export default UserController 