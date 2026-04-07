import { z } from 'zod'

export const addProductSchema = z.object({
  name: z.string().trim().min(1, 'Укажите наименование'),
  price: z
    .string()
    .trim()
    .min(1, 'Укажите цену')
    .transform((s) => Number(s.replace(',', '.')))
    .pipe(
      z
        .number()
        .refine((n) => !Number.isNaN(n), 'Некорректное число')
        .positive('Цена должна быть больше 0'),
    ),
  vendor: z.string().trim().min(1, 'Укажите вендора'),
  article: z.string().trim().min(1, 'Укажите артикул'),
})

export type AddProductFormInput = z.input<typeof addProductSchema>
export type AddProductFormOutput = z.output<typeof addProductSchema>
