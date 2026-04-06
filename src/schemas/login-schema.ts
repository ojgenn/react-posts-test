import { z } from 'zod'

export const loginSchema = z.object({
  login: z
    .string()
    .trim()
    .min(1, 'Введите логин')
    .max(128, 'Слишком длинный логин'),
  password: z
    .string()
    .min(6, 'Пароль не короче 6 символов')
    .max(256, 'Слишком длинный пароль'),
  remember: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>
