import Joi from 'joi'

export const employeeSchemas = {
  create: Joi.object({
    first_name: Joi.string().min(2).max(100).required(),
    last_name: Joi.string().min(2).max(100).required(),
    DNI: Joi.number().integer().min(1).required(),
    hire_date: Joi.date().iso().required(),
    position: Joi.string().min(2).max(100).required(),
    salary: Joi.number().positive().required(),
    emergency_contact_name: Joi.string().min(2).max(100).required(),
    emergency_contact_phone: Joi.string().min(6).max(20).required(),
    phone: Joi.string().min(6).max(20).required()
  }),
  update: Joi.object({
    first_name: Joi.string().min(2).max(100),
    last_name: Joi.string().min(2).max(100),
    DNI: Joi.number().integer().min(1),
    hire_date: Joi.date().iso(),
    position: Joi.string().min(2).max(100),
    salary: Joi.number().positive(),
    emergency_contact_name: Joi.string().min(2).max(100),
    emergency_contact_phone: Joi.string().min(6).max(20),
    phone: Joi.string().min(6).max(20)
  }),
  search: Joi.object({
    search: Joi.string().allow(''),
    position: Joi.string().allow(''),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  }),
  id: Joi.object({
    id: Joi.number().integer().positive().required()
  })
} 