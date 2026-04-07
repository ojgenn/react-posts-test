import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProductsSortField, ProductsSortOrder } from '../api/products-api'

interface ProductsSortState {
  sortBy: ProductsSortField
  order: ProductsSortOrder
  setSortColumn: (column: ProductsSortField) => void
}

export const useProductsSortStore = create<ProductsSortState>()(
  persist(
    (set, get) => ({
      sortBy: 'title',
      order: 'asc',
      setSortColumn: (column) => {
        const { sortBy, order } = get()
        if (sortBy === column) {
          set({ order: order === 'asc' ? 'desc' : 'asc' })
        } else {
          set({ sortBy: column, order: 'asc' })
        }
      },
    }),
    { name: 'aiti-products-sort' },
  ),
)
