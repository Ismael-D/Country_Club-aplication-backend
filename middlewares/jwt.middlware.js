import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    let token = req.headers.authorization

    if (!token) {
        return res.status(401).json({ error: "Token not provided" });
    }

    token = token.split(" ")[1]

    try {
        const { email, role, id } = jwt.verify(token, process.env.JWT_SECRET)
        req.email = email
        req.role = role
        req.user = { id, email, role }

        next()
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: "Invalid token" });
    }
}

export const verifyAdmin = (req, res, next) => {
    if (req.role === "admin") {
        return next()
    }

    return res.status(403).json({ error: "Unauthorized - only admin users allowed" })
}

export const verifyManager = (req, res, next) => {
    if (req.role === "manager" || req.role === "admin") {
        return next()
    }
    return res.status(403).json({ error: "Unauthorized - only manager or admin users allowed" })
}

export const verifyEventCoordinator = (req, res, next) => {
    if (req.role === "event_coordinator" || req.role === "manager" || req.role === "admin") {
        return next()
    }
    return res.status(403).json({ error: "Unauthorized - only event coordinator, manager or admin users allowed" })
}