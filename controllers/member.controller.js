import MemberModel from '../models/member.model.js'

const MemberController = {
  async create(req, res) {
    try {
      const member = await MemberModel.create(req.body)
      res.status(201).json({ ok: true, id: member.id, data: member })
    } catch (error) {
      console.error('Error creating member:', error)
      res.status(500).json({ ok: false, msg: 'Error al crear miembro', error: error.message })
    }
  },

  async findAll(req, res) {
    try {
      const { search, status, page, limit } = req.query
      const result = await MemberModel.findAll({ search, status, page, limit })
      res.json({ ok: true, data: result })
    } catch (error) {
      console.error('Error fetching members:', error)
      res.status(500).json({ ok: false, msg: 'Error al obtener miembros', error: error.message })
    }
  },

  async findById(req, res) {
    try {
      const { id } = req.params
      const member = await MemberModel.findById(id)
      if (!member) return res.status(404).json({ ok: false, msg: 'Miembro no encontrado' })
      res.json({ ok: true, data: member })
    } catch (error) {
      console.error('Error fetching member:', error)
      res.status(500).json({ ok: false, msg: 'Error al obtener miembro', error: error.message })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const updated = await MemberModel.update(id, req.body)
      if (!updated) return res.status(404).json({ ok: false, msg: 'Miembro no encontrado' })
      res.json({ ok: true, data: updated })
    } catch (error) {
      console.error('Error updating member:', error)
      res.status(500).json({ ok: false, msg: 'Error al actualizar miembro', error: error.message })
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params
      const deleted = await MemberModel.remove(id)
      if (!deleted) return res.status(404).json({ ok: false, msg: 'Miembro no encontrado' })
      res.json({ ok: true, data: deleted })
    } catch (error) {
      console.error('Error deleting member:', error)
      res.status(500).json({ ok: false, msg: 'Error al eliminar miembro', error: error.message })
    }
  },

  async getActiveMembers(req, res) {
    try {
      const members = await MemberModel.getActiveMembers()
      res.json({ ok: true, data: members })
    } catch (error) {
      console.error('Error fetching active members:', error)
      res.status(500).json({ ok: false, msg: 'Error al obtener miembros activos', error: error.message })
    }
  },

  async getMembersByStatus(req, res) {
    try {
      const { status } = req.params
      const members = await MemberModel.getMembersByStatus(status)
      res.json({ ok: true, data: members })
    } catch (error) {
      console.error('Error fetching members by status:', error)
      res.status(500).json({ ok: false, msg: 'Error al obtener miembros por estado', error: error.message })
    }
  }
}

export default MemberController 