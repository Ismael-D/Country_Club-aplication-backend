import Joi from 'joi'

export const authSchemas = {
  register: Joi.object({
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

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required()
  })
} 