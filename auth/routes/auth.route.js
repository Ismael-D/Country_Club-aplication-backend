import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller.js'
import { validateSchema } from '../../middlewares/validation.middleware.js'
import { authSchemas } from '../schemas/auth.schema.js'
import { verifyToken } from '../../middlewares/jwt.middlware.js'

const router = Router()

// Rutas públicas (sin autenticación)
router.post('/register', 
  validateSchema(authSchemas.register),
  AuthController.register
)

router.post('/login',
  validateSchema(authSchemas.login),
  AuthController.login
)

router.post('/verify',
  AuthController.verifyToken
)

// Rutas protegidas (requieren autenticación)
router.get('/profile',
  verifyToken,
  AuthController.getProfile
)

router.put('/change-password',
  verifyToken,
  validateSchema(authSchemas.changePassword),
  AuthController.changePassword
)

export default router 