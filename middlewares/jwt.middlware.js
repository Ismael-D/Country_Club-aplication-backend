import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'

export const verifyToken = async (req, res, next) => {
    console.log('🔍 [JWT] Middleware verifyToken called')
    let token = req.headers.authorization

    if (!token) {
        console.log('❌ [JWT] No token provided')
        return res.status(401).json({ error: "Token not provided" });
    }

    token = token.split(" ")[1]
    console.log('🔍 [JWT] Token:', token.substring(0, 50) + '...')

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log('🔍 [JWT] Token decoded:', { id: decoded.id, email: decoded.email, role: decoded.role })
        
        // Verificar que el usuario aún existe en la base de datos usando Prisma
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { role: true }
        })
        
        if (!user) {
            console.log('❌ [JWT] Usuario no encontrado en BD')
            return res.status(401).json({ 
                error: 'Usuario no encontrado' 
            })
        }

        // Verificar que el usuario esté activo
        if (user.status !== 'active') {
            console.log('❌ [JWT] Usuario inactivo')
            return res.status(401).json({ 
                error: 'Usuario inactivo' 
            })
        }

        // Usar la información actualizada de la base de datos
        req.email = user.email
        req.role = user.role?.name || 'user'
        req.user = { 
            id: user.id, 
            email: user.email, 
            role: user.role?.name || 'user' 
        }

        // Debug: Verificar que se asignó correctamente
        console.log('🔍 [JWT] req.user:', req.user)
        console.log('🔍 [JWT] req.role:', req.role)

        next()
    } catch (error) {
        console.log('❌ [JWT] Error:', error)
        return res.status(400).json({ error: "Invalid token" });
    }
}

export const verifyAdmin = (req, res, next) => {
    if (req.role === "admin") {
        return next()
    }

    return res.status(403).json({ error: "Unauthorized - only admin users allowed" })
}

export const verifyManager = (req, res, next) => {
    if (req.role === "manager" || req.role === "admin") {
        return next()
    }
    return res.status(403).json({ error: "Unauthorized - only manager or admin users allowed" })
}

export const verifyEventCoordinator = (req, res, next) => {
    if (req.role === "event_coordinator" || req.role === "manager" || req.role === "admin") {
        return next()
    }
    return res.status(403).json({ error: "Unauthorized - only event coordinator, manager or admin users allowed" })
}