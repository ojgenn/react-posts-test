import { useId } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { Form } from './form'
import {
  addProductSchema,
  type AddProductFormInput,
  type AddProductFormOutput,
} from '../schemas/add-product-schema'

const inputClass =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
const labelClass = 'mb-1 block text-xs font-semibold text-gray-600'

interface AddProductModalProps {
  open: boolean
  onClose: () => void
}

export function AddProductModal({ open, onClose }: AddProductModalProps) {
  const nameId = useId()
  const priceId = useId()
  const vendorId = useId()
  const articleId = useId()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddProductFormInput, unknown, AddProductFormOutput>({
    resolver: zodResolver(addProductSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      price: '',
      vendor: '',
      article: '',
    },
  })

  if (!open) return null

  const onValid = () => {
    toast.success('Товар добавлен')
    reset()
    onClose()
  }

  const onBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onMouseDown={onBackdrop}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2
            id="add-product-title"
            className="text-lg font-semibold text-gray-900"
          >
            Новый товар
          </h2>
          <button
            type="button"
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            onClick={() => {
              reset()
              onClose()
            }}
            aria-label="Закрыть"
          >
            <X className="size-5" strokeWidth={2} />
          </button>
        </div>

        <Form className="space-y-4" onSubmit={handleSubmit(onValid)}>
          <div>
            <label htmlFor={nameId} className={labelClass}>
              Наименование
            </label>
            <input
              id={nameId}
              type="text"
              autoComplete="off"
              className={inputClass}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? `${nameId}-err` : undefined}
              {...register('name')}
            />
            {errors.name && (
              <p id={`${nameId}-err`} className="mt-1 text-xs text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor={priceId} className={labelClass}>
              Цена, ₽
            </label>
            <input
              id={priceId}
              type="number"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0,00"
              className={inputClass}
              aria-invalid={!!errors.price}
              aria-describedby={errors.price ? `${priceId}-err` : undefined}
              {...register('price')}
            />
            {errors.price && (
              <p id={`${priceId}-err`} className="mt-1 text-xs text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor={vendorId} className={labelClass}>
              Вендор
            </label>
            <input
              id={vendorId}
              type="text"
              autoComplete="organization"
              className={inputClass}
              aria-invalid={!!errors.vendor}
              aria-describedby={errors.vendor ? `${vendorId}-err` : undefined}
              {...register('vendor')}
            />
            {errors.vendor && (
              <p id={`${vendorId}-err`} className="mt-1 text-xs text-red-600">
                {errors.vendor.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor={articleId} className={labelClass}>
              Артикул
            </label>
            <input
              id={articleId}
              type="text"
              autoComplete="off"
              className={inputClass}
              aria-invalid={!!errors.article}
              aria-describedby={
                errors.article ? `${articleId}-err` : undefined
              }
              {...register('article')}
            />
            {errors.article && (
              <p id={`${articleId}-err`} className="mt-1 text-xs text-red-600">
                {errors.article.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              onClick={() => {
                reset()
                onClose()
              }}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Сохранить
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}
