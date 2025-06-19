import { EventModel } from '../models/event.model.js'

export const EventController = {
  create: async (req, res) => {
    try {
      const { name, date, description, location, budget, actual_cost, status = 'scheduled', event_type_id, max_attendees } = req.body
      if (!name || !date || !location || !event_type_id) {
        return res.status(400).json({ ok: false, msg: 'Missing required fields: name, date, location, event_type_id' })
      }
      const event = await EventModel.create({
        name,
        date,
        description,
        location,
        budget,
        actual_cost,
        status,
        organizer_id: req.user.id,
        event_type_id,
        max_attendees
      })
      res.status(201).json({ ok: true, event })
    } catch (error) {
      res.status(400).json({ ok: false, msg: error.message })
    }
  },

  findAll: async (req, res) => {
    try {
      const events = await EventModel.findAll()
      res.json({ ok: true, events })
    } catch (error) {
      res.status(500).json({ ok: false, msg: error.message })
    }
  },

  findOne: async (req, res) => {
    try {
      const { id } = req.params
      const event = await EventModel.findOneById(id)
      if (!event) return res.status(404).json({ ok: false, msg: 'Event not found' })
      res.json({ ok: true, event })
    } catch (error) {
      res.status(500).json({ ok: false, msg: error.message })
    }
  },

  update: async (req, res) => {
    if (req.user?.role !== 'admin' && req.user?.role !== 'manager') {
      return res.status(403).json({ ok: false, msg: 'Only admin or manager can update events' })
    }
    try {
      const { id } = req.params
      const event = await EventModel.update(id, req.body)
      if (!event) return res.status(404).json({ ok: false, msg: 'Event not found' })
      res.json({ ok: true, event })
    } catch (error) {
      res.status(400).json({ ok: false, msg: error.message })
    }
  },

  remove: async (req, res) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ ok: false, msg: 'Only admin can delete events' })
    }
    try {
      const { id } = req.params
      const deleted = await EventModel.remove(id)
      if (!deleted) return res.status(404).json({ ok: false, msg: 'Event not found' })
      res.json({ ok: true, msg: 'Event deleted' })
    } catch (error) {
      res.status(500).json({ ok: false, msg: error.message })
    }
  }
} 