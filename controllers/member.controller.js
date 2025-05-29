import { MemberModel } from '../models/member.model.js'

export const MemberController = {
  create: async (req, res) => {
    try {
      const { name, lastName, dni, email, telephone, payDay, debt = 0, status = "no_debt" } = req.body
      const member = await MemberModel.create({ name, lastName, dni, email, telephone, payDay, debt, status })
      res.status(201).json({ ok: true, member })
    } catch (error) {
      res.status(400).json({ ok: false, msg: error.message })
    }
  },

  findAll: async (req, res) => {
    const members = await MemberModel.findAll()
    res.json({ ok: true, members })
  },

  findOne: async (req, res) => {
    const { id } = req.params
    const member = await MemberModel.findOneById(id)
    if (!member) return res.status(404).json({ ok: false, msg: "Member not found" })
    res.json({ ok: true, member })
  },

  update: async (req, res) => {
    // Aquí deberías verificar que el usuario es admin antes de permitir la actualización
    if (req.user?.role !== "admin") {
      return res.status(403).json({ ok: false, msg: "Only admin can update members" })
    }
    try {
      const { id } = req.params
      const member = await MemberModel.update(id, req.body)
      if (!member) return res.status(404).json({ ok: false, msg: "Member not found" })
      res.json({ ok: true, member })
    } catch (error) {
      res.status(400).json({ ok: false, msg: error.message })
    }
  },

  remove: async (req, res) => {
    // Solo admin puede eliminar miembros
    if (req.user?.role !== "admin") {
      return res.status(403).json({ ok: false, msg: "Only admin can delete members" })
    }
    const { id } = req.params
    const deleted = await MemberModel.remove(id)
    if (!deleted) return res.status(404).json({ ok: false, msg: "Member not found" })
    res.json({ ok: true, msg: "Member deleted" })
  }
}