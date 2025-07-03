import { prisma } from '../../lib/prisma.js'
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'

const register = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, DNI, password, role_id = 3, status = "active", birth_date } = req.body

        if (!first_name || !last_name || !email || !phone || !DNI || !password) {
            return res.status(400).json({ ok: false, msg: "Missing required fields: first_name, last_name, email, phone, DNI, password" })
        }

        // Verificar si el email ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
            include: { role: true }
        })
        
        if (existingUser) {
            return res.status(409).json({ ok: false, msg: "Email already exists" })
        }

        // Verificar si el DNI ya existe
        const existingDNI = await prisma.user.findUnique({
            where: { dni: parseInt(DNI) },
            include: { role: true }
        })
        
        if (existingDNI) {
            return res.status(409).json({ ok: false, msg: "DNI already exists" })
        }

        // Hash de la contraseña
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        // Crear el usuario
        const newUser = await prisma.user.create({
            data: {
                dni: parseInt(DNI),
                firstName: first_name,
                lastName: last_name,
                email,
                password: hashedPassword,
                roleId: parseInt(role_id),
                status,
                phone,
                birthDate: birth_date ? new Date(birth_date) : null
            },
            include: {
                role: true
            }
        })

        const token = jwt.sign(
            { 
                email: newUser.email, 
                role: newUser.role?.name || 'user', 
                id: newUser.id,
                dni: newUser.dni
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        )

        return res.status(201).json({
            ok: true,
            id: newUser.id,
            msg: {
                token, 
                role: newUser.role?.name || 'user',
                user: {
                    id: newUser.id,
                    first_name: newUser.firstName,
                    last_name: newUser.lastName,
                    email: newUser.email,
                    dni: newUser.dni,
                    status: newUser.status
                }
            }
        })
    } catch (error) {
        console.error('Registration error:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ ok: false, msg: "Missing required fields: email, password" })
        }

        // Buscar usuario por email
        const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true }
        })
        
        if (!user) {
            return res.status(404).json({ ok: false, msg: "Usuario no encontrado" })
        }

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return res.status(401).json({ ok: false, msg: "Credenciales inválidas" })
        }

        // Verificar si el usuario está activo
        if (user.status !== 'active') {
            return res.status(401).json({ ok: false, msg: "Usuario inactivo" })
        }

        const token = jwt.sign(
            { 
                email: user.email, 
                role: user.role?.name || 'user', 
                id: user.id,
                dni: user.dni
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        )

        return res.json({
            ok: true, 
            msg: {
                token, 
                role: user.role?.name || 'user',
                user: {
                    id: user.id,
                    first_name: user.firstName,
                    last_name: user.lastName,
                    email: user.email,
                    dni: user.dni,
                    status: user.status,
                    phone: user.phone
                }
            }
        })
    } catch (error) {
        console.error('Login error:', error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }
}

const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        
        if (!token) {
            return res.status(401).json({ ok: false, msg: 'Token no proporcionado' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        // Buscar usuario actualizado
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { role: true }
        })

        if (!user) {
            return res.status(401).json({ ok: false, msg: 'Usuario no encontrado' })
        }

        if (user.status !== 'active') {
            return res.status(401).json({ ok: false, msg: 'Usuario inactivo' })
        }

        return res.json({
            ok: true,
            msg: {
                user: {
                    id: user.id,
                    first_name: user.firstName,
                    last_name: user.lastName,
                    email: user.email,
                    dni: user.dni,
                    status: user.status,
                    role: user.role?.name || 'user'
                }
            }
        })
    } catch (error) {
        console.error('Token verification error:', error)
        return res.status(401).json({ ok: false, msg: 'Token inválido' })
    }
}

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        const userId = req.user.id

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ ok: false, msg: 'Contraseña actual y nueva contraseña son requeridas' })
        }

        // Buscar usuario
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' })
        }

        // Verificar contraseña actual
        const validPassword = await bcrypt.compare(currentPassword, user.password)
        if (!validPassword) {
            return res.status(401).json({ ok: false, msg: 'Contraseña actual incorrecta' })
        }

        // Hash de la nueva contraseña
        const saltRounds = 10
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

        // Actualizar contraseña
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword }
        })

        return res.json({ ok: true, msg: 'Contraseña actualizada exitosamente' })
    } catch (error) {
        console.error('Change password error:', error)
        return res.status(500).json({ ok: false, msg: 'Error interno del servidor' })
    }
}

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                role: true,
                members: {
                    include: {
                        registrator: {
                            include: { role: true }
                        }
                    }
                },
                events: {
                    include: {
                        eventType: true
                    }
                }
            }
        })

        if (!user) {
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' })
        }

        return res.json({
            ok: true,
            msg: {
                user: {
                    id: user.id,
                    first_name: user.firstName,
                    last_name: user.lastName,
                    email: user.email,
                    dni: user.dni,
                    status: user.status,
                    phone: user.phone,
                    birth_date: user.birthDate,
                    role: user.role?.name || 'user',
                    registration_date: user.registrationDate,
                    members_registered: user.members.length,
                    events_organized: user.events.length
                }
            }
        })
    } catch (error) {
        console.error('Get profile error:', error)
        return res.status(500).json({ ok: false, msg: 'Error interno del servidor' })
    }
}

export const AuthController = {
    register,
    login,
    verifyToken,
    changePassword,
    getProfile
} 