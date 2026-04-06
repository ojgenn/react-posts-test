/**
 * HTTP-клиент на fetch: базовый URL, JWT в Authorization, JSON по умолчанию.
 * Токен: `setAuthToken` / `getAuthToken` или `getToken` в конфиге (например, из zustand).
 */

export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export interface ApiClientConfig {
  baseUrl?: string
  /** Если задан, вызывается на каждый запрос (удобно связать с zustand). Иначе — модульный токен из setAuthToken. */
  getToken?: () => string | null | undefined
  /** Например, редирект на логин при 401 */
  onUnauthorized?: () => void
}

export type ApiRequestOptions = RequestInit & {
  /** Если задан, сериализуется в JSON и подменяет `body`; выставляется Content-Type: application/json */
  json?: unknown
}

let moduleToken: string | null = null

export function setAuthToken(token: string | null): void {
  moduleToken = token
}

export function getAuthToken(): string | null {
  return moduleToken
}

function resolveUrl(baseUrl: string, path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const base = baseUrl.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

function mergeHeaders(
  init: RequestInit,
  token: string | null,
  hasJsonBody: boolean,
): Headers {
  const h = new Headers(init.headers)
  if (token) {
    h.set('Authorization', `Bearer ${token}`)
  }
  if (hasJsonBody && !h.has('Content-Type')) {
    h.set('Content-Type', 'application/json')
  }
  return h
}

async function readErrorBody(res: Response): Promise<unknown> {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

async function parseSuccessBody<T>(res: Response): Promise<T> {
  if (res.status === 204 || res.status === 205) {
    return undefined as T
  }
  const text = await res.text()
  if (!text) {
    return undefined as T
  }
  const ct = res.headers.get('content-type') ?? ''
  if (ct.includes('application/json')) {
    return JSON.parse(text) as T
  }
  return text as unknown as T
}

export class ApiClient {
  private readonly baseUrl: string
  private readonly config: ApiClientConfig

  constructor(config: ApiClientConfig = {}) {
    this.config = config
    this.baseUrl = config.baseUrl ?? ''
  }

  private resolveToken(): string | null {
    return this.config.getToken?.() ?? getAuthToken() ?? null
  }

  async request<T>(
    path: string,
    init: ApiRequestOptions = {},
  ): Promise<T> {
    const { json, body: rawBody, ...rest } = init
    const hasJsonBody = json !== undefined
    const body = hasJsonBody
      ? JSON.stringify(json)
      : rawBody instanceof FormData || rawBody instanceof Blob
        ? rawBody
        : rawBody

    const token = this.resolveToken()

    const headers = mergeHeaders(
      { ...rest, body },
      token,
      hasJsonBody && !(rawBody instanceof FormData),
    )

    const url = resolveUrl(this.baseUrl, path)
    const res = await fetch(url, { ...rest, headers, body })

    if (!res.ok) {
      const errBody = await readErrorBody(res)
      if (res.status === 401) {
        this.config.onUnauthorized?.()
      }
      const message =
        typeof errBody === 'object' &&
        errBody !== null &&
        'message' in errBody &&
        typeof (errBody as { message: unknown }).message === 'string'
          ? (errBody as { message: string }).message
          : res.statusText || `HTTP ${res.status}`
      throw new ApiError(message, res.status, errBody)
    }

    return parseSuccessBody<T>(res)
  }

  get<T>(path: string, init?: ApiRequestOptions): Promise<T> {
    return this.request<T>(path, { ...init, method: 'GET' })
  }

  post<T>(path: string, json?: unknown, init?: ApiRequestOptions): Promise<T> {
    return this.request<T>(path, { ...init, method: 'POST', json })
  }

  put<T>(path: string, json?: unknown, init?: ApiRequestOptions): Promise<T> {
    return this.request<T>(path, { ...init, method: 'PUT', json })
  }

  patch<T>(path: string, json?: unknown, init?: ApiRequestOptions): Promise<T> {
    return this.request<T>(path, { ...init, method: 'PATCH', json })
  }

  delete<T>(path: string, init?: ApiRequestOptions): Promise<T> {
    return this.request<T>(path, { ...init, method: 'DELETE' })
  }
}

/** Синглтон: базовый URL из `.env` → `VITE_API_BASE_URL` (см. Vite env) */
export const api = new ApiClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
})
