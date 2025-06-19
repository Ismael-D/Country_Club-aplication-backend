import 'dotenv/config'
import express from 'express'

import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import memberRouter from './routes/member.route.js'
import eventRouter from './routes/event.route.js'
import { 
    handleDatabaseError, 
    handleValidationError, 
    handleJWTError, 
    handleNotFound,
    globalErrorHandler 
} from './middlewares/error.middleware.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/members', memberRouter)
app.use('/api/v1/events', eventRouter)

// Error handling middleware for JSON parsing errors (must be after routes)
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        console.log('JSON Parse Error:', error.message);
        return res.status(400).json({ 
            ok: false, 
            msg: 'Invalid JSON format',
            error: error.message 
        });
    }
    next(error);
});

// Specific error handlers (in order of specificity)
app.use(handleDatabaseError)
app.use(handleValidationError)
app.use(handleJWTError)

// 404 handler for unmatched routes
app.use(handleNotFound)

// Global error handler (must be last)
app.use(globalErrorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log('Servidor andando en ' + PORT))