import { z } from 'zod'

export const memberCreateSchema = z.object({
  DNI: z.number().int().positive(),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  phone: z.string().min(5).optional(),
  email: z.string().email().optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
  start_date: z.string(),
  end_date: z.string()
})

export const memberUpdateSchema = z.object({
  DNI: z.number().int().positive().optional(),
  first_name: z.string().min(2).optional(),
  last_name: z.string().min(2).optional(),
  phone: z.string().min(5).optional(),
  email: z.string().email().optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional()
}) 