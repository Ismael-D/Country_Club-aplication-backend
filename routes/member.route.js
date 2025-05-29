import { Router } from "express"
import { MemberController } from "../controllers/member.controller.js"
import { verifyToken } from "../middlewares/jwt.middlware.js"

const router = Router()

router.get('/', verifyToken, MemberController.findAll)
router.get('/:id', verifyToken, MemberController.findOne)
router.post('/', verifyToken, MemberController.create)
router.put('/:id', verifyToken, MemberController.update)
router.delete('/:id', verifyToken, MemberController.remove)

export default router
