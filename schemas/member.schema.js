import Joi from 'joi'

export const memberSchemas = {
  create: Joi.object({
    registrator_id: Joi.number().integer().positive().required(),
    DNI: Joi.number().integer().positive().required(),
    first_name: Joi.string().min(2).max(100).required(),
    last_name: Joi.string().min(2).max(100).required(),
    phone: Joi.string().min(5).max(20).optional(),
    email: Joi.string().email().optional(),
    membership_number: Joi.string().min(3).max(50).required(),
    status: Joi.string().valid('active', 'inactive', 'suspended').default('active'),
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().greater(Joi.ref('start_date')).required()
  }),

  update: Joi.object({
    first_name: Joi.string().min(2).max(100),
    last_name: Joi.string().min(2).max(100),
    phone: Joi.string().min(5).max(20),
    email: Joi.string().email(),
    status: Joi.string().valid('active', 'inactive', 'suspended'),
    start_date: Joi.date().iso(),
    end_date: Joi.date().iso().greater(Joi.ref('start_date'))
  }),

  search: Joi.object({
    search: Joi.string().allow(''),
    status: Joi.string().valid('active', 'inactive', 'suspended').allow(''),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  }),

  id: Joi.object({
    id: Joi.number().integer().positive().required()
  })
} 