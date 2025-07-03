import Joi from 'joi'

export const eventSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    date: Joi.date().iso().required(),
    description: Joi.string().optional(),
    location: Joi.string().min(2).max(200).required(),
    budget: Joi.number().positive().optional(),
    actual_cost: Joi.number().positive().optional(),
    status: Joi.string().valid('scheduled', 'ongoing', 'completed', 'canceled').default('scheduled'),
    organizer_id: Joi.number().integer().positive().required(),
    event_type_id: Joi.number().integer().positive().required(),
    max_attendees: Joi.number().integer().positive().optional()
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100),
    date: Joi.date().iso(),
    description: Joi.string(),
    location: Joi.string().min(2).max(200),
    budget: Joi.number().positive(),
    actual_cost: Joi.number().positive(),
    status: Joi.string().valid('scheduled', 'ongoing', 'completed', 'canceled'),
    organizer_id: Joi.number().integer().positive(),
    event_type_id: Joi.number().integer().positive(),
    max_attendees: Joi.number().integer().positive()
  }),

  search: Joi.object({
    search: Joi.string().allow(''),
    status: Joi.string().valid('scheduled', 'ongoing', 'completed', 'canceled').allow(''),
    eventType: Joi.string().allow(''),
    startDate: Joi.date().iso().allow(''),
    endDate: Joi.date().iso().allow(''),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  }),

  id: Joi.object({
    id: Joi.number().integer().positive().required()
  })
} 