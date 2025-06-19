import { UserModel } from '../models/user.model.js'
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'


const register = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, DNI, password, role_id = 3, status = "active", birth_date } = req.body

        if (!first_name || !last_name || !email || !phone || !DNI || !password) {
            return res.status(400).json({ ok: false, msg: "Missing required fields: first_name, last_name, email, phone, DNI, password" })
        }

        const user = await UserModel.findOneByEmail(email)
        if (user) {
            return res.status(409).json({ ok: false, msg: "Email already exists" })
        }

        const newUser = await UserModel.create({ first_name, last_name, email, phone, DNI, password, role_id, status, birth_date })

        const token = jwt.sign(
            { email: newUser.email, role: newUser.role_name, id: newUser.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        return res.status(201).json({
            ok: true,
            msg: {
                token, 
                role: newUser.role_name,
                user: {
                    id: newUser.id,
                    first_name: newUser.first_name,
                    last_name: newUser.last_name,
                    email: newUser.email
                }
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
            { email: user.email, role: user.role_name, id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        return res.json({
            ok: true, 
            msg: {
                token, 
                role: user.role_name,
                user: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email
                }
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
        
        // No enviar la contraseña en la respuesta
        const { password, ...userWithoutPassword } = user
        return res.json({ ok: true, msg: userWithoutPassword })
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
        return res.json({ ok: true, msg: users })
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
        const { role_id } = req.body

        if (![1, 2, 3].includes(role_id)) {
            return res.status(400).json({ error: "Invalid role_id. Must be 1 (admin), 2 (manager), or 3 (event_coordinator)" })
        }

        const user = await UserModel.updateRole(id, role_id)
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
    try {
        const { id } = req.params
        
        if (req.user?.role !== "admin") {
            return res.status(403).json({ ok: false, msg: "Only admin can delete users" })
        }
        
        const deleted = await UserModel.remove(id)
        if (!deleted) return res.status(404).json({ ok: false, msg: "User not found" })
        res.json({ ok: true, msg: "User deleted" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error server'
        })
    }
}

export const UserController = {
    register,
    login,
    profile,
    findAll,
    updateRole,
    remove
}