import { useEffect, useMemo, useState } from 'react'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
} from 'lucide-react'
import { clsx } from 'clsx'
import { fetchProducts, PRODUCTS_PAGE_SIZE } from '../api/products-api'
import type { ProductsSortField } from '../api/products-api'
import { useProductsSortStore } from '../stores/products-sort-store'
import { useDebouncedValue } from '../hooks/use-debounced-value'
import { formatPriceRub } from '../utils/format-price'
import { formatCategoryLabel } from '../utils/format-category'
import { AddProductModal } from '../components/add-product-modal'

const LOW_RATING_THRESHOLD = 3.5

function getPageNumbers(current: number, totalPages: number): number[] {
  if (totalPages <= 0) return []
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  let start = Math.max(1, current - 2)
  const end = Math.min(totalPages, start + 4)
  start = Math.max(1, end - 4)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

function SortGlyph({
  active,
  order,
}: {
  active: boolean
  order: 'asc' | 'desc'
}) {
  if (!active) {
    return (
      <ArrowUpDown
        className="size-3.5 shrink-0 text-gray-300"
        strokeWidth={2}
        aria-hidden
      />
    )
  }
  return order === 'asc' ? (
    <ArrowUp className="size-3.5 shrink-0 text-blue-600" strokeWidth={2} aria-hidden />
  ) : (
    <ArrowDown className="size-3.5 shrink-0 text-blue-600" strokeWidth={2} aria-hidden />
  )
}

const COLUMN_META: {
  key: ProductsSortField
  label: string
  className?: string
}[] = [
  { key: 'title', label: 'Наименование', className: 'min-w-[220px]' },
  { key: 'brand', label: 'Вендор', className: 'min-w-[120px]' },
  { key: 'sku', label: 'Артикул', className: 'min-w-[110px]' },
  { key: 'rating', label: 'Оценка', className: 'min-w-[88px]' },
  { key: 'price', label: 'Цена, ₽', className: 'min-w-[110px]' },
]

interface ProductsCatalogProps {
  debouncedSearch: string
}

function ProductsCatalog({ debouncedSearch }: ProductsCatalogProps) {
  const queryClient = useQueryClient()
  const { sortBy, order, setSortColumn } = useProductsSortStore()
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const query = useQuery({
    queryKey: ['products', page, sortBy, order, debouncedSearch],
    queryFn: () =>
      fetchProducts({
        page,
        sortBy,
        order,
        q: debouncedSearch || undefined,
      }),
    placeholderData: keepPreviousData,
  })

  const { data, isLoading, isFetching, isError, error } = query

  const total = data?.total ?? 0
  const products = data?.products ?? []
  const skip = data?.skip ?? 0

  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PAGE_SIZE))
  const effectivePage = Math.min(page, totalPages)

  useEffect(() => {
    if (data === undefined) return
    const tp = Math.max(1, Math.ceil(data.total / PRODUCTS_PAGE_SIZE))
    if (page > tp) {
      setPage(tp)
    }
  }, [data, page])

  const pageNumbers = useMemo(
    () => getPageNumbers(effectivePage, totalPages),
    [effectivePage, totalPages],
  )

  const rangeLabel = useMemo(() => {
    if (total === 0) return 'Показано 0 из 0'
    const from = skip + 1
    const to = skip + products.length
    return `Показано ${from}-${to} из ${total}`
  }, [total, skip, products.length])

  const showBar = isFetching

  return (
    <>
      {showBar && (
        <div
          className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-gray-200"
          aria-hidden
        >
          <div className="h-full w-1/3 animate-[progress_1.1s_ease-in-out_infinite] bg-blue-600" />
        </div>
      )}

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>

      <section className="rounded-2xl border border-gray-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <h2 className="text-lg font-semibold text-gray-900">Все позиции</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
              aria-label="Обновить таблицу"
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ['products'] })
              }
            >
              <RefreshCw className="size-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="size-4" strokeWidth={2.5} />
              Добавить
            </button>
          </div>
        </div>

        {isError && (
          <p className="px-6 py-8 text-sm text-red-600" role="alert">
            {error instanceof Error ? error.message : 'Не удалось загрузить товары'}
          </p>
        )}

        {!isError && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="w-10 px-4 py-3" scope="col">
                    <span className="sr-only">Выбор</span>
                  </th>
                  {COLUMN_META.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      className={clsx('px-4 py-3', col.className)}
                    >
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-gray-600 transition hover:text-gray-900"
                        onClick={() => setSortColumn(col.key)}
                        aria-sort={
                          sortBy === col.key
                            ? order === 'asc'
                              ? 'ascending'
                              : 'descending'
                            : 'none'
                        }
                      >
                        {col.label}
                        <SortGlyph active={sortBy === col.key} order={order} />
                      </button>
                    </th>
                  ))}
                  <th className="w-[88px] px-4 py-3 text-right" scope="col">
                    <span className="sr-only">Действия</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading && !data ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center text-gray-500"
                    >
                      Загрузка…
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center text-gray-500"
                    >
                      Ничего не найдено
                    </td>
                  </tr>
                ) : (
                  products.map((row) => {
                    const selected = selectedId === row.id
                    const lowRating = row.rating < LOW_RATING_THRESHOLD
                    const brand = row.brand?.trim() || '—'
                    return (
                      <tr
                        key={row.id}
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
                            onChange={() =>
                              setSelectedId((prev) =>
                                prev === row.id ? null : row.id,
                              )
                            }
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
                              <div className="font-semibold text-gray-900">
                                {row.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatCategoryLabel(row.category)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-middle font-semibold text-gray-900">
                          {brand}
                        </td>
                        <td className="px-4 py-3 align-middle text-gray-800">
                          {row.sku}
                        </td>
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
                )}
              </tbody>
            </table>
          </div>
        )}

        <footer className="flex flex-col gap-4 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-gray-500">{rangeLabel}</p>
          <nav
            className="flex flex-wrap items-center gap-1"
            aria-label="Страницы"
          >
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition enabled:hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={effectivePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Предыдущая страница"
            >
              <ChevronLeft className="size-4" />
            </button>
            {pageNumbers.map((n) => (
              <button
                key={n}
                type="button"
                className={clsx(
                  'min-w-9 rounded-lg px-2 py-1.5 text-sm font-medium transition',
                  n === effectivePage
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100',
                )}
                onClick={() => setPage(n)}
                aria-current={n === effectivePage ? 'page' : undefined}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition enabled:hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={effectivePage >= totalPages}
              onClick={() =>
                setPage((p) => Math.min(totalPages, p + 1))
              }
              aria-label="Следующая страница"
            >
              <ChevronRight className="size-4" />
            </button>
          </nav>
        </footer>
      </section>

      <AddProductModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  )
}

export function ProductsPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 400)

  return (
    <div className="relative min-h-svh w-full bg-[#f7f7f8] px-4 pb-10 pt-6 text-left font-sans antialiased sm:px-6 lg:px-10">
      <header className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
          Товары
        </h1>
        <div className="relative w-full lg:max-w-xl lg:flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Найти"
            autoComplete="off"
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            aria-label="Поиск товаров"
          />
        </div>
      </header>

      <ProductsCatalog key={debouncedSearch} debouncedSearch={debouncedSearch} />
    </div>
  )
}
