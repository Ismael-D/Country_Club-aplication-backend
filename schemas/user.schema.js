import { z } from 'zod'

export const userRegisterSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  DNI: z.number().int().positive(),
  password: z.string().min(6),
  role_id: z.number().int().min(1).max(3).optional(),
  birth_date: z.string().optional(),
  status: z.string().optional()
})

export const userUpdateSchema = z.object({
  first_name: z.string().min(2).optional(),
  last_name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(5).optional(),
  DNI: z.number().int().positive().optional(),
  password: z.string().min(6).optional(),
  role_id: z.number().int().min(1).max(3).optional(),
  birth_date: z.string().optional(),
  status: z.string().optional()
})

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
}) 