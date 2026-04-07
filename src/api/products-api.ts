import { api } from './api-client'

export type ProductsSortField =
  | 'title'
  | 'brand'
  | 'sku'
  | 'rating'
  | 'price'

export type ProductsSortOrder = 'asc' | 'desc'

export interface DummyJsonProduct {
  id: number
  title: string
  category: string
  price: number
  rating: number
  sku: string
  thumbnail: string
  brand?: string
}

export interface ProductsListResponse {
  products: DummyJsonProduct[]
  total: number
  skip: number
  limit: number
}

export const PRODUCTS_PAGE_SIZE = 20

export interface FetchProductsParams {
  page: number
  sortBy: ProductsSortField
  order: ProductsSortOrder
  q?: string
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === '') continue
    sp.set(k, String(v))
  }
  return sp.toString()
}

export async function fetchProducts(
  p: FetchProductsParams,
): Promise<ProductsListResponse> {
  const skip = (p.page - 1) * PRODUCTS_PAGE_SIZE
  const base = {
    limit: PRODUCTS_PAGE_SIZE,
    skip,
    sortBy: p.sortBy,
    order: p.order,
  }
  const q = p.q?.trim()
  if (q) {
    const qs = buildQuery({ ...base, q })
    return api.get<ProductsListResponse>(`/products/search?${qs}`)
  }
  const qs = buildQuery(base)
  return api.get<ProductsListResponse>(`/products?${qs}`)
}
