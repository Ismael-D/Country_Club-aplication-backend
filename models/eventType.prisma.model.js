import { prisma } from '../lib/prisma.js'

const EventTypePrismaModel = {
  async create(data) {
    return await prisma.eventType.create({
      data: {
        name: data.name,
        description: data.description,
        requiredResources: data.required_resources
      }
    })
  },

  async findAll() {
    return await prisma.eventType.findMany({
      include: {
        events: {
          include: {
            organizer: {
              include: {
                role: true
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    })
  },

  async findById(id) {
    return await prisma.eventType.findUnique({
      where: { id: parseInt(id) },
      include: {
        events: {
          include: {
            organizer: {
              include: {
                role: true
              }
            }
          }
        }
      }
    })
  },

  async update(id, data) {
    const updateData = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.required_resources !== undefined) updateData.requiredResources = data.required_resources

    return await prisma.eventType.update({
      where: { id: parseInt(id) },
      data: updateData
    })
  },

  async remove(id) {
    return await prisma.eventType.delete({
      where: { id: parseInt(id) }
    })
  },

  async getEventTypeWithEventCount() {
    return await prisma.eventType.findMany({
      include: {
        _count: {
          select: {
            events: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })
  }
}

export default EventTypePrismaModel 