import jwt from 'jsonwebtoken'
import { prisma } from '../../lib/prisma.js'

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        
        if (!token) {
            return res.status(401).json({ 
                ok: false, 
                msg: 'Token de acceso requerido' 
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        // Verificar que el usuario aún existe en la base de datos usando Prisma
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { role: true }
        })
        
        if (!user) {
            return res.status(401).json({ 
                ok: false, 
                msg: 'Usuario no encontrado' 
            })
        }

        // Verificar que el usuario esté activo
        if (user.status !== 'active') {
            return res.status(401).json({ 
                ok: false, 
                msg: 'Usuario inactivo' 
            })
        }

        // Agregar información del usuario al request
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role?.name || 'user'
        }
        
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                ok: false, 
                msg: 'Token expirado' 
            })
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                ok: false, 
                msg: 'Token inválido' 
            })
        }
        
        console.error('Error en verificación de token:', error)
        return res.status(500).json({ 
            ok: false, 
            msg: 'Error interno del servidor' 
        })
    }
}

export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                ok: false, 
                msg: 'Autenticación requerida' 
            })
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                ok: false, 
                msg: 'Permisos insuficientes' 
            })
        }

        next()
    }
}

export const requireAdmin = requireRole(['admin'])
export const requireManager = requireRole(['admin', 'manager'])
export const requireEventCoordinator = requireRole(['admin', 'manager', 'event_coordinator']) 