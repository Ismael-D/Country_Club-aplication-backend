import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlware.js";
import { validateId } from "../middlewares/error.middleware.js";

const router = Router()

// api/v1/users

router.get('/profile', verifyToken, UserController.profile)

// Admin operations
router.get('/', verifyToken, verifyAdmin, UserController.findAll)
router.put('/update-role', verifyToken, verifyAdmin, UserController.updateRole)
router.delete('/:id', verifyToken, verifyAdmin, validateId, UserController.remove)

router.get('/:id/events', verifyToken, validateId, UserController.getEvents)

export default router;