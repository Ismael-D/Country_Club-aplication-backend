import { UserModel } from '../models/user.model.js'
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'


const register = async (req, res) => {
    try {
        const { name, email, telephone, dni, password, role = "event_coordinator", status = "active" } = req.body

        if (!name || !email || !telephone || !dni || !password) {
            return res.status(400).json({ ok: false, msg: "Missing required fields: name, email, telephone, dni, password" })
        }

        const user = await UserModel.findOneByEmail(email)
        if (user) {
            return res.status(409).json({ ok: false, msg: "Email already exists" })
        }

        const newUser = await UserModel.create({ name, email, telephone, dni, password, role, status })

        const token = jwt.sign(
            { email: newUser.email, role: newUser.role, id: newUser.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        return res.status(201).json({
            ok: true,
            msg: {
                token, role: newUser.role
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error server'
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: "Missing required fields: email, password" });
        }

        const user = await UserModel.findOneByEmail(email)
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials" })
        }

        const token = jwt.sign(
            { email: user.email, role: user.role, id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        return res.json({
            ok: true, msg: {
                token, role: user.role
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error server'
        })
    }
}

const profile = async (req, res) => {
    try {
        const user = await UserModel.findOneByEmail(req.email)
        if (!user) {
            return res.status(404).json({ ok: false, msg: "User not found" })
        }
        return res.json({ ok: true, msg: user })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error server'
        })
    }
}

const findAll = async (req, res) => {
    try {
        const users = await UserModel.findAll()
        const usersWithoutPasswords = users.map(({ password, ...rest }) => rest)
        return res.json({ ok: true, msg: usersWithoutPasswords })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error server'
        })
    }
}


const updateRole = async (req, res) => {
    try {
        const { id } = req.params
        const { role } = req.body

        if (!["admin", "manager", "event_coordinator"].includes(role)) {
            return res.status(400).json({ error: "Invalid role" })
        }

        const user = await UserModel.updateRole(id, role)
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        return res.json({
            ok: true,
            msg: user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error server'
        })
    }
}

const remove = async (req, res) => {
    const { id } = req.params
    
    if (req.user?.role !== "admin") {
        return res.status(403).json({ ok: false, msg: "Only admin can delete users" })
    }
    const deleted = await UserModel.remove(id)
    if (!deleted) return res.status(404).json({ ok: false, msg: "User not found" })
    res.json({ ok: true, msg: "User deleted" })
}

export const UserController = {
    register,
    login,
    profile,
    findAll,
    updateRole,
    remove
}