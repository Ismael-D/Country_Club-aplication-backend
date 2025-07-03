import { Router } from 'express'
import { getAllEventTypes } from '../controllers/eventType.controller.js'
import { verifyToken } from '../middlewares/jwt.middlware.js'

const router = Router()

router.use(verifyToken)
router.get('/event-types', getAllEventTypes)

export default router 