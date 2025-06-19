import { ZodError } from 'zod'
import jwt from 'jsonwebtoken'

// Error handler for database connection issues
export const handleDatabaseError = (error, req, res, next) => {
  if (error.code === 'ECONNREFUSED') {
    return res.status(503).json({
      ok: false,
      msg: 'Database service unavailable',
      error: 'Service temporarily unavailable'
    })
  }
  
  if (error.code === 'ENOTFOUND') {
    return res.status(503).json({
      ok: false,
      msg: 'Database connection failed',
      error: 'Unable to connect to database'
    })
  }
  
  next(error)
}

// Error handler for validation errors
export const handleValidationError = (error, req, res, next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      ok: false,
      msg: 'Validation error',
      errors: error.errors.map(e => ({ 
        field: e.path.join('.'),
        message: e.message 
      }))
    })
  }
  next(error)
}

// Error handler for JWT errors
export const handleJWTError = (error, req, res, next) => {
  if (error instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
      ok: false,
      msg: 'Invalid token',
      error: 'Authentication failed'
    })
  }
  
  if (error instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      ok: false,
      msg: 'Token expired',
      error: 'Please login again'
    })
  }
  
  next(error)
}

// Error handler for parameter validation
export const validateId = (req, res, next) => {
  const { id } = req.params
  
  if (id && !/^\d+$/.test(id)) {
    return res.status(400).json({
      ok: false,
      msg: 'Invalid ID format',
      error: 'ID must be a valid number'
    })
  }
  
  next()
}

// Error handler for missing required parameters
export const validateRequiredParams = (params) => {
  return (req, res, next) => {
    const missing = params.filter(param => !req.params[param])
    
    if (missing.length > 0) {
      return res.status(400).json({
        ok: false,
        msg: 'Missing required parameters',
        error: `Required parameters: ${missing.join(', ')}`
      })
    }
    
    next()
  }
}

// Error handler for unsupported operations
export const handleUnsupportedOperation = (req, res) => {
  return res.status(405).json({
    ok: false,
    msg: 'Method not allowed',
    error: `${req.method} is not supported for this endpoint`
  })
}

// Error handler for resource not found
export const handleNotFound = (req, res) => {
  return res.status(404).json({
    ok: false,
    msg: 'Resource not found',
    error: `Endpoint ${req.method} ${req.originalUrl} not found`
  })
}

// Global error handler with more specific error types
export const globalErrorHandler = (error, req, res, next) => {
  console.error('Global error handler:', error)
  
  // Don't send error if response already sent
  if (res.headersSent) return next(error)
  
  // Handle specific error types
  if (error.code === '23505') { // PostgreSQL unique constraint violation
    return res.status(409).json({
      ok: false,
      msg: 'Resource already exists',
      error: 'Duplicate entry found'
    })
  }
  
  if (error.code === '23503') { // PostgreSQL foreign key constraint violation
    return res.status(400).json({
      ok: false,
      msg: 'Invalid reference',
      error: 'Referenced resource does not exist'
    })
  }
  
  if (error.code === '23502') { // PostgreSQL not null constraint violation
    return res.status(400).json({
      ok: false,
      msg: 'Missing required field',
      error: 'Required field is missing'
    })
  }
  
  // Default error response
  res.status(error.status || 500).json({
    ok: false,
    msg: error.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.stack : 'Something went wrong'
  })
} 