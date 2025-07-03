import EventTypeModel from '../models/eventType.prisma.model.js'

export const getAllEventTypes = async (req, res) => {
  try {
    const eventTypes = await EventTypeModel.findAll()
    res.json(eventTypes)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los tipos de eventos' })
  }
} 