import EventModel from '../models/event.model.js'
import EventTypeModel from '../models/eventType.prisma.model.js'

const EventController = {
  async create(req, res) {
    try {
      const event = await EventModel.create(req.body)
      res.status(201).json({ ok: true, id: event.id, data: event })
    } catch (error) {
      console.error('Error creating event:', error)
      res.status(500).json({ ok: false, msg: 'Error al crear evento', error: error.message })
    }
  },

  async findAll(req, res) {
    try {
      const { search, status, eventType, startDate, endDate, page, limit } = req.query
      const result = await EventModel.findAll({ search, status, eventType, startDate, endDate, page, limit })
      res.json({ ok: true, data: result })
    } catch (error) {
      console.error('Error fetching events:', error)
      res.status(500).json({ ok: false, msg: 'Error al obtener eventos', error: error.message })
    }
  },

  async findById(req, res) {
    try {
      const { id } = req.params
      const event = await EventModel.findById(id)
      if (!event) return res.status(404).json({ ok: false, msg: 'Evento no encontrado' })
      res.json({ ok: true, data: event })
    } catch (error) {
      console.error('Error fetching event:', error)
      res.status(500).json({ ok: false, msg: 'Error al obtener evento', error: error.message })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const updated = await EventModel.update(id, req.body)
      if (!updated) return res.status(404).json({ ok: false, msg: 'Evento no encontrado' })
      res.json({ ok: true, data: updated })
    } catch (error) {
      console.error('Error updating event:', error)
      res.status(500).json({ ok: false, msg: 'Error al actualizar evento', error: error.message })
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params
      const deleted = await EventModel.remove(id)
      if (!deleted) return res.status(404).json({ ok: false, msg: 'Evento no encontrado' })
      res.json({ ok: true, data: deleted })
    } catch (error) {
      console.error('Error deleting event:', error)
      res.status(500).json({ ok: false, msg: 'Error al eliminar evento', error: error.message })
    }
  },

  async getUpcomingEvents(req, res) {
    try {
      const events = await EventModel.getUpcomingEvents()
      res.json({ ok: true, data: events })
    } catch (error) {
      console.error('Error fetching upcoming events:', error)
      res.status(500).json({ ok: false, msg: 'Error al obtener eventos próximos', error: error.message })
    }
  },

  async getEventsByStatus(req, res) {
    try {
      const { status } = req.params
      const events = await EventModel.getEventsByStatus(status)
      res.json({ ok: true, data: events })
    } catch (error) {
      console.error('Error fetching events by status:', error)
      res.status(500).json({ ok: false, msg: 'Error al obtener eventos por estado', error: error.message })
    }
  },

  async getEventsByOrganizer(req, res) {
    try {
      const { organizerId } = req.params
      const events = await EventModel.getEventsByOrganizer(organizerId)
      res.json({ ok: true, data: events })
    } catch (error) {
      console.error('Error fetching events by organizer:', error)
      res.status(500).json({ ok: false, msg: 'Error al obtener eventos por organizador', error: error.message })
    }
  }
}

export default EventController 