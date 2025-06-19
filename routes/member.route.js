import { Router } from "express"
import { MemberController } from "../controllers/member.controller.js"
import { verifyToken } from "../middlewares/jwt.middlware.js"
import { validateBody } from "../middlewares/validation.middleware.js"
import { validateId } from "../middlewares/error.middleware.js"
import { memberCreateSchema, memberUpdateSchema } from "../schemas/member.schema.js"

const router = Router()

router.get('/', verifyToken, MemberController.findAll)
router.get('/:id', verifyToken, validateId, MemberController.findOne)
router.post('/', verifyToken, validateBody(memberCreateSchema), MemberController.create)
router.put('/:id', verifyToken, validateId, validateBody(memberUpdateSchema), MemberController.update)
router.delete('/:id', verifyToken, validateId, MemberController.remove)

export default router
