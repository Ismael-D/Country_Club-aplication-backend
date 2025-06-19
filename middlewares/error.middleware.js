import { ZodError } from 'zod'
import jwt from 'jsonwebtoken'
import { buildErrorResponse } from '../utils/error.util.js'

// Error handler for database connection issues
export const handleDatabaseError = (error, req, res, next) => {
  if (error.code === 'ECONNREFUSED') {
    const { status, body } = buildErrorResponse({ code: 'DB_UNAVAILABLE' });
    return res.status(status).json(body);
  }
  
  if (error.code === 'ENOTFOUND') {
    const { status, body } = buildErrorResponse({ code: 'DB_CONN_FAILED' });
    return res.status(status).json(body);
  }
  
  next(error);
}

// Error handler for validation errors
export const handleValidationError = (error, req, res, next) => {
  if (error instanceof ZodError) {
    const { status, body } = buildErrorResponse({
      code: 'VALIDATION',
      errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
    });
    return res.status(status).json(body);
  }
  next(error);
}

// Error handler for JWT errors
export const handleJWTError = (error, req, res, next) => {
  if (error instanceof jwt.JsonWebTokenError) {
    const { status, body } = buildErrorResponse({ code: 'JWT_INVALID' });
    return res.status(status).json(body);
  }
  
  if (error instanceof jwt.TokenExpiredError) {
    const { status, body } = buildErrorResponse({ code: 'JWT_EXPIRED' });
    return res.status(status).json(body);
  }
  
  next(error);
}

// Error handler for parameter validation
export const validateId = (req, res, next) => {
  const { id } = req.params
  
  if (id && !/^[\d]+$/.test(id)) {
    const { status, body } = buildErrorResponse({ code: 'ID_INVALID' });
    return res.status(status).json(body);
  }
  
  next()
}

// Error handler for missing required parameters
export const validateRequiredParams = (params) => {
  return (req, res, next) => {
    const missing = params.filter(param => !req.params[param])
    
    if (missing.length > 0) {
      const { status, body } = buildErrorResponse({
        code: 'PARAMS_MISSING',
        customError: `Required parameters: ${missing.join(', ')}`
      });
      return res.status(status).json(body);
    }
    
    next()
  }
}

// Error handler for unsupported operations
export const handleUnsupportedOperation = (req, res) => {
  const { status, body } = buildErrorResponse({
    code: 'METHOD_NOT_ALLOWED',
    customError: `${req.method} is not supported for this endpoint`
  });
  return res.status(status).json(body);
}

// Error handler for resource not found
export const handleNotFound = (req, res) => {
  const { status, body } = buildErrorResponse({
    code: 'NOT_FOUND',
    customError: `Endpoint ${req.method} ${req.originalUrl} not found`
  });
  return res.status(status).json(body);
}

// Global error handler with more specific error types
export const globalErrorHandler = (error, req, res, next) => {
  console.error('Global error handler:', error)
  
  // Don't send error if response already sent
  if (res.headersSent) return next(error)
  
  // Handle specific error types
  if (error.code === '23505') { // PostgreSQL unique constraint violation
    const { status, body } = buildErrorResponse({ code: 'DUPLICATE' });
    return res.status(status).json(body);
  }
  
  if (error.code === '23503') { // PostgreSQL foreign key constraint violation
    const { status, body } = buildErrorResponse({ code: 'INVALID_REFERENCE' });
    return res.status(status).json(body);
  }
  
  if (error.code === '23502') { // PostgreSQL not null constraint violation
    const { status, body } = buildErrorResponse({ code: 'MISSING_FIELD' });
    return res.status(status).json(body);
  }
  
  // Default error response
  const { status, body } = buildErrorResponse({
    code: 'DEFAULT',
    customMsg: error.message || undefined,
    customError: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
  res.status(status).json(body);
} 