import { MemberModel } from '../models/member.model.js'

export const MemberController = {
  create: async (req, res) => {
    try {
      const { DNI, first_name, last_name, phone, email, status = "active", start_date, end_date } = req.body
      
      if (!DNI || !first_name || !last_name || !start_date || !end_date) {
        return res.status(400).json({ ok: false, msg: "Missing required fields: DNI, first_name, last_name, start_date, end_date" })
      }
      
      const member = await MemberModel.create({ 
        registrator_id: req.user.id, 
        DNI, 
        first_name, 
        last_name, 
        phone, 
        email, 
        status, 
        start_date, 
        end_date 
      })
      
      res.status(201).json({ ok: true, member })
    } catch (error) {
      res.status(400).json({ ok: false, msg: error.message })
    }
  },

  findAll: async (req, res) => {
    try {
      const members = await MemberModel.findAll()
      res.json({ ok: true, members })
    } catch (error) {
      res.status(500).json({ ok: false, msg: error.message })
    }
  },

  findOne: async (req, res) => {
    try {
      const { id } = req.params
      const member = await MemberModel.findOneById(id)
      if (!member) return res.status(404).json({ ok: false, msg: "Member not found" })
      res.json({ ok: true, member })
    } catch (error) {
      res.status(500).json({ ok: false, msg: error.message })
    }
  },

  update: async (req, res) => {
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
    if (req.user?.role !== "admin") {
      return res.status(403).json({ ok: false, msg: "Only admin can delete members" })
    }
    try {
      const { id } = req.params
      const deleted = await MemberModel.remove(id)
      if (!deleted) return res.status(404).json({ ok: false, msg: "Member not found" })
      res.json({ ok: true, msg: "Member deleted" })
    } catch (error) {
      res.status(500).json({ ok: false, msg: error.message })
    }
  }
}