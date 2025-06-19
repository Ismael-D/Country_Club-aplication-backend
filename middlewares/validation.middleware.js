import { ZodError } from 'zod'

export const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        msg: 'Validation error',
        errors: error.errors.map(e => ({ path: e.path, message: e.message }))
      })
    }
    next(error)
  }
} 