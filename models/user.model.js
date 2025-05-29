import bcrypt from 'bcryptjs'

export let users = [
  {
    id: 1,
    name: "Ismael Sanchez",
    email: "ismael.sanchez@example.com",
    telephone: "0412-3456789",
    dni: "V-12345678",
    password: "admin123", 
    role: "admin",
    status: "active"
  }
]

// Hashea las contraseñas en texto plano al iniciar la app
users.forEach(async user => {
  if (!user.password.startsWith('$2a$')) {
    user.password = await bcrypt.hash(user.password, 10)
  }
})

const create = async ({ name, email, telephone, dni, password, role = "event_coordinator", status = "active" }) => {
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = {
        id: users.length + 1,
        name,
        email,
        telephone,
        dni,
        password: hashedPassword,
        role,
        status
    }
    users.push(newUser)

    const { password: _, ...userWithoutPassword } = newUser
    return userWithoutPassword
}

const findOneByEmail = async (email) => {
    return users.find(user => user.email === email)
}

const findAll = async () => {
    return users
}

const findOneById = async (id) => {
    return users.find(user => user.id === Number(id))
}

const updateRole = async (id, newRole) => {
    const user = users.find(user => user.id === Number(id))
    if (user) {
        user.role = newRole
    }
    return user
}

const updateStatus = async (id, newStatus) => {
    const user = users.find(user => user.id === Number(id))
    if (user) {
        user.status = newStatus 
    }
    return user
}

const remove = async (id) => {
  const index = users.findIndex(user => user.id === id)
  if (index === -1) return false
  users.splice(index, 1)
  return true
}

export const UserModel = {
    create,
    findOneByEmail,
    findAll,
    findOneById,
    updateRole,
    updateStatus,
    remove
}