import { memo } from 'react'
import { clsx } from 'clsx'
import { MoreHorizontal, Plus } from 'lucide-react'
import type { DummyJsonProduct } from '../api/products-api'
import { formatCategoryLabel } from '../utils/format-category'
import { formatPriceRub } from '../utils/format-price'

const LOW_RATING_THRESHOLD = 3.5

export interface ProductTableRowProps {
  row: DummyJsonProduct
  selected: boolean
  onToggleSelect: (id: number) => void
}

export const ProductTableRow = memo(function ProductTableRow({
  row,
  selected,
  onToggleSelect,
}: ProductTableRowProps) {
  const lowRating = row.rating < LOW_RATING_THRESHOLD
  const brand = row.brand?.trim() || '—'

  return (
    <tr
      className={clsx(
        'border-b border-gray-100 transition-colors hover:bg-gray-50/80',
        selected && 'bg-blue-50/50',
      )}
    >
      <td
        className={clsx(
          'relative w-10 px-4 py-3 align-middle',
          selected &&
            'before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-blue-600',
        )}
      >
        <input
          type="checkbox"
          className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          checked={selected}
          onChange={() => onToggleSelect(row.id)}
          aria-label={`Выбрать ${row.title}`}
        />
      </td>
      <td className="px-4 py-3 align-middle">
        <div className="flex items-center gap-3">
          <div className="size-11 shrink-0 overflow-hidden rounded-lg bg-gray-100">
            <img
              src={row.thumbnail}
              alt=""
              className="size-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900">{row.title}</div>
            <div className="text-xs text-gray-500">
              {formatCategoryLabel(row.category)}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 align-middle font-semibold text-gray-900">
        {brand}
      </td>
      <td className="px-4 py-3 align-middle text-gray-800">{row.sku}</td>
      <td
        className={clsx(
          'px-4 py-3 align-middle tabular-nums',
          lowRating ? 'font-medium text-red-600' : 'text-gray-900',
        )}
      >
        {row.rating.toFixed(1)}/5
      </td>
      <td className="px-4 py-3 align-middle tabular-nums text-gray-900">
        {formatPriceRub(row.price)}
      </td>
      <td className="px-4 py-3 align-middle text-right">
        <div className="inline-flex items-center justify-end gap-2">
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition hover:bg-blue-700"
            aria-label="Добавить (заглушка)"
            onClick={() => undefined}
          >
            <Plus className="size-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-gray-600 transition hover:bg-gray-200"
            aria-label="Дополнительные действия (заглушка)"
            onClick={() => undefined}
          >
            <MoreHorizontal className="size-4" strokeWidth={2} />
          </button>
        </div>
      </td>
    </tr>
  )
})
