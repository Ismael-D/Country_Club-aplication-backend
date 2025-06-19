import { z } from 'zod'

export const eventCreateSchema = z.object({
  name: z.string().min(2),
  date: z.string(),
  description: z.string().optional(),
  location: z.string().min(2),
  budget: z.number().nonnegative().optional(),
  actual_cost: z.number().nonnegative().optional(),
  status: z.enum(['scheduled', 'ongoing', 'completed', 'canceled']).optional(),
  event_type_id: z.number().int().positive(),
  max_attendees: z.number().int().positive().optional()
})

export const eventUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  date: z.string().optional(),
  description: z.string().optional(),
  location: z.string().min(2).optional(),
  budget: z.number().nonnegative().optional(),
  actual_cost: z.number().nonnegative().optional(),
  status: z.enum(['scheduled', 'ongoing', 'completed', 'canceled']).optional(),
  event_type_id: z.number().int().positive().optional(),
  max_attendees: z.number().int().positive().optional()
}) 