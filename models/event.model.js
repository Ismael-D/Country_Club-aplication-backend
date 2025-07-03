import { prisma } from '../lib/prisma.js'

const EventPrismaModel = {
  async create(data) {
    return await prisma.event.create({
      data: {
        name: data.name,
        date: new Date(data.date),
        end_date: data.end_date ? new Date(data.end_date) : null,
        description: data.description,
        location: data.location,
        budget: data.budget ? parseFloat(data.budget) : null,
        actualCost: data.actual_cost ? parseFloat(data.actual_cost) : null,
        status: data.status,
        organizerId: data.organizer_id,
        eventTypeId: data.event_type_id,
        maxAttendees: data.max_attendees ? parseInt(data.max_attendees) : null
      },
      include: {
        organizer: {
          include: {
            role: true
          }
        },
        eventType: true
      }
    })
  },

  async findAll({ search, status, eventType, startDate, endDate, page = 1, limit = 10 }) {
    const where = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status) {
      where.status = status
    }
    
    if (eventType) {
      where.eventType = {
        name: eventType
      }
    }
    
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    } else if (startDate) {
      where.date = {
        gte: new Date(startDate)
      }
    } else if (endDate) {
      where.date = {
        lte: new Date(endDate)
      }
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          organizer: {
            include: {
              role: true
            }
          },
          eventType: true
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: 'desc' }
      }),
      prisma.event.count({ where })
    ])

    return {
      events,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  },

  async findById(id) {
    return await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: {
        organizer: {
          include: {
            role: true
          }
        },
        eventType: true
      }
    })
  },

  async update(id, data) {
    const updateData = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.date !== undefined) updateData.date = new Date(data.date)
    if (data.end_date !== undefined) updateData.end_date = data.end_date ? new Date(data.end_date) : null
    if (data.description !== undefined) updateData.description = data.description
    if (data.location !== undefined) updateData.location = data.location
    if (data.budget !== undefined) updateData.budget = data.budget ? parseFloat(data.budget) : null
    if (data.actual_cost !== undefined) updateData.actualCost = data.actual_cost ? parseFloat(data.actual_cost) : null
    if (data.status !== undefined) updateData.status = data.status
    if (data.organizer_id !== undefined) updateData.organizerId = data.organizer_id
    if (data.event_type_id !== undefined) updateData.eventTypeId = data.event_type_id
    if (data.max_attendees !== undefined) updateData.maxAttendees = data.max_attendees ? parseInt(data.max_attendees) : null

    return await prisma.event.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        organizer: {
          include: {
            role: true
          }
        },
        eventType: true
      }
    })
  },

  async remove(id) {
    return await prisma.event.delete({
      where: { id: parseInt(id) }
    })
  },

  async getEventsByStatus(status) {
    return await prisma.event.findMany({
      where: { status },
      include: {
        organizer: {
          include: {
            role: true
          }
        },
        eventType: true
      },
      orderBy: { date: 'desc' }
    })
  },

  async getUpcomingEvents() {
    return await prisma.event.findMany({
      where: {
        date: {
          gte: new Date()
        },
        status: {
          in: ['scheduled', 'ongoing']
        }
      },
      include: {
        organizer: {
          include: {
            role: true
          }
        },
        eventType: true
      },
      orderBy: { date: 'asc' }
    })
  },

  async getEventsByOrganizer(organizerId) {
    return await prisma.event.findMany({
      where: { organizerId: parseInt(organizerId) },
      include: {
        organizer: {
          include: {
            role: true
          }
        },
        eventType: true
      },
      orderBy: { date: 'desc' }
    })
  }
}

export default EventPrismaModel 