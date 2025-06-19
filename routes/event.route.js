import { Router } from 'express'
import { EventController } from '../controllers/event.controller.js'
import { verifyToken, verifyAdmin, verifyManager } from '../middlewares/jwt.middlware.js'
import { validateBody } from '../middlewares/validation.middleware.js'
import { validateId } from '../middlewares/error.middleware.js'
import { eventCreateSchema, eventUpdateSchema } from '../schemas/event.schema.js'

const router = Router()

router.get('/', EventController.findAll)
router.get('/:id', validateId, EventController.findOne)
router.post('/', verifyToken, validateBody(eventCreateSchema), EventController.create)
router.put('/:id', verifyToken, verifyManager, validateId, validateBody(eventUpdateSchema), EventController.update)
router.delete('/:id', verifyToken, verifyAdmin, validateId, EventController.remove)

export default router 