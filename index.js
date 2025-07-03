import 'dotenv/config'
import express from 'express'
import cors from 'cors'

console.log('🚀 Starting Country Club Backend...')

import authRouter from './auth/routes/auth.route.js'
console.log('✅ Auth routes imported')

import userRouter from './routes/user.route.js'
console.log('✅ User routes imported')

import memberRouter from './routes/member.route.js'
console.log('✅ Member routes imported')

import eventRouter from './routes/event.route.js'
console.log('✅ Event routes imported')

import maintenanceRouter from './routes/maintenance.route.js'
console.log('✅ Maintenance routes imported')

import inventoryRouter from './routes/inventory.route.js'
console.log('✅ Inventory routes imported')

import reportRouter from './routes/report.route.js'
console.log('✅ Report routes imported')

import employeeRouter from './routes/employee.route.js'
console.log('✅ Employee routes imported')

import eventTypeRoutes from './routes/eventType.route.js'
console.log('✅ Event Type routes imported')

import { 
    handleDatabaseError, 
    handleValidationError, 
    handleJWTError, 
    handleNotFound,
    globalErrorHandler 
} from './middlewares/error.middleware.js'
console.log('✅ Error middlewares imported')

const app = express()
console.log('✅ Express app created')

// Habilitar CORS para el frontend en localhost:3002 y Netlify
import cors from 'cors';

app.use(cors({
  origin: [
    'http://localhost:3002', // para desarrollo local
    'https://cheerful-kheer-4619ff.netlify.app' // tu dominio real de Netlify
  ],
  credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
console.log('✅ Middlewares configured')

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/members', memberRouter)
app.use('/api/v1/events', eventRouter)
app.use('/api/v1/maintenance', maintenanceRouter)
app.use('/api/v1/inventory', inventoryRouter)
app.use('/api/v1/reports', reportRouter)
app.use('/api/v1/employees', employeeRouter)
app.use('/api/v1', eventTypeRoutes)
console.log('✅ Routes configured')

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
console.log('✅ Error handlers configured')

const PORT = process.env.PORT || 3000

console.log('🎯 About to start server on port', PORT)
app.listen(PORT, '0.0.0.0', () => console.log('Servidor andando en ' + PORT))