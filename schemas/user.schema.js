import Joi from 'joi'

export const userSchemas = {
  create: Joi.object({
    first_name: Joi.string().min(2).max(100).required(),
    last_name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(5).max(20).required(),
    DNI: Joi.number().integer().positive().required(),
    password: Joi.string().min(6).required(),
    role_id: Joi.number().integer().min(1).max(3).default(3),
    birth_date: Joi.date().iso().optional(),
    status: Joi.string().valid('active', 'inactive', 'suspended').default('active')
  }),

  update: Joi.object({
    first_name: Joi.string().min(2).max(100),
    last_name: Joi.string().min(2).max(100),
    email: Joi.string().email(),
    phone: Joi.string().min(5).max(20),
    DNI: Joi.number().integer().positive(),
    password: Joi.string().min(6),
    role_id: Joi.number().integer().min(1).max(3),
    birth_date: Joi.date().iso(),
    status: Joi.string().valid('active', 'inactive', 'suspended')
  }),

  search: Joi.object({
    search: Joi.string().allow(''),
    role: Joi.string().allow(''),
    status: Joi.string().valid('active', 'inactive', 'suspended').allow(''),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  }),

  id: Joi.object({
    id: Joi.number().integer().positive().required()
  })
} 