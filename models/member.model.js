import { prisma } from '../lib/prisma.js'

const MemberPrismaModel = {
  async create(data) {
    return await prisma.member.create({
      data: {
        registratorId: data.registrator_id,
        dni: data.DNI,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        email: data.email,
        membershipNumber: data.membership_number,
        status: data.status,
        startDate: new Date(data.start_date),
        endDate: new Date(data.end_date)
      },
      include: {
        registrator: {
          include: {
            role: true
          }
        }
      }
    })
  },

  async findAll({ search, status, page = 1, limit = 10 }) {
    const where = {}
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { membershipNumber: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status) {
      where.status = status
    }

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        include: {
          registrator: {
            include: {
              role: true
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' }
      }),
      prisma.member.count({ where })
    ])

    return {
      members,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  },

  async findById(id) {
    return await prisma.member.findUnique({
      where: { id: parseInt(id) },
      include: {
        registrator: {
          include: {
            role: true
          }
        }
      }
    })
  },

  async findByDNI(dni) {
    return await prisma.member.findUnique({
      where: { dni: parseInt(dni) },
      include: {
        registrator: {
          include: {
            role: true
          }
        }
      }
    })
  },

  async findByMembershipNumber(membershipNumber) {
    return await prisma.member.findUnique({
      where: { membershipNumber },
      include: {
        registrator: {
          include: {
            role: true
          }
        }
      }
    })
  },

  async update(id, data) {
    const updateData = {}
    
    if (data.first_name !== undefined) updateData.firstName = data.first_name
    if (data.last_name !== undefined) updateData.lastName = data.last_name
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.email !== undefined) updateData.email = data.email
    if (data.status !== undefined) updateData.status = data.status
    if (data.start_date !== undefined) updateData.startDate = new Date(data.start_date)
    if (data.end_date !== undefined) updateData.endDate = new Date(data.end_date)

    return await prisma.member.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        registrator: {
          include: {
            role: true
          }
        }
      }
    })
  },

  async remove(id) {
    return await prisma.member.delete({
      where: { id: parseInt(id) }
    })
  },

  async getMembersByStatus(status) {
    return await prisma.member.findMany({
      where: { status },
      include: {
        registrator: {
          include: {
            role: true
          }
        }
      }
    })
  },

  async getActiveMembers() {
    return await prisma.member.findMany({
      where: { 
        status: 'active',
        endDate: {
          gte: new Date()
        }
      },
      include: {
        registrator: {
          include: {
            role: true
          }
        }
      }
    })
  }
}

export default MemberPrismaModel 