import { prisma } from '../lib/prisma.js'

const UserPrismaModel = {
  async create(data) {
    return await prisma.user.create({
      data: {
        dni: data.DNI,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        password: data.password,
        roleId: data.role_id,
        status: data.status,
        phone: data.phone,
        birthDate: data.birth_date ? new Date(data.birth_date) : null
      },
      include: {
        role: true
      }
    })
  },

  async findAll({ search, role, status, page = 1, limit = 10 }) {
    const where = {}
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (role) {
      where.role = { name: role }
    }
    
    if (status) {
      where.status = status
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          role: true
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' }
      }),
      prisma.user.count({ where })
    ])

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  },

  async findById(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        role: true,
        members: true,
        events: {
          include: {
            eventType: true
          }
        }
      }
    })
  },

  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        role: true
      }
    })
  },

  async findByDNI(dni) {
    return await prisma.user.findUnique({
      where: { dni: parseInt(dni) },
      include: {
        role: true
      }
    })
  },

  async update(id, data) {
    const updateData = {}
    
    if (data.first_name !== undefined) updateData.firstName = data.first_name
    if (data.last_name !== undefined) updateData.lastName = data.last_name
    if (data.email !== undefined) updateData.email = data.email
    if (data.password !== undefined) updateData.password = data.password
    if (data.role_id !== undefined) updateData.roleId = data.role_id
    if (data.status !== undefined) updateData.status = data.status
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.birth_date !== undefined) updateData.birthDate = data.birth_date ? new Date(data.birth_date) : null

    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        role: true
      }
    })
  },

  async remove(id) {
    return await prisma.user.delete({
      where: { id: parseInt(id) }
    })
  },

  async getUsersByRole(roleName) {
    return await prisma.user.findMany({
      where: {
        role: {
          name: roleName
        }
      },
      include: {
        role: true
      }
    })
  }
}

export default UserPrismaModel 