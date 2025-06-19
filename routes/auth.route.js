import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { validateBody } from "../middlewares/validation.middleware.js";
import { userRegisterSchema, userLoginSchema } from "../schemas/user.schema.js";

const router = Router()

// api/v1/auth

router.post('/register', validateBody(userRegisterSchema), UserController.register)
router.post('/login', validateBody(userLoginSchema), UserController.login)

export default router; 