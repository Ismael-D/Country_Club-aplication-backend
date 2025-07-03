// Exportar controladores
export { AuthController } from './controllers/auth.controller.js'

// Exportar rutas
export { default as authRoutes } from './routes/auth.route.js'

// Exportar esquemas
export { authRegisterSchema, authLoginSchema } from './schemas/auth.schema.js'

// Exportar middlewares
export { 
    verifyToken, 
    requireRole, 
    requireAdmin, 
    requireManager, 
    requireEventCoordinator 
} from './middlewares/auth.middleware.js' 