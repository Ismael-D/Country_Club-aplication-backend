import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkRoles() {
  try {
    const roles = await prisma.role.findMany()
    console.log('Roles disponibles:', roles)
    
    const users = await prisma.user.findMany({
      include: { role: true }
    })
    console.log('Usuarios con roles:', users.map(u => ({ id: u.id, email: u.email, role: u.role?.name })))
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkRoles() 