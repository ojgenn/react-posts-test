import { setAuthToken } from '../api/api-client'

const ACCESS_KEY = 'dummyjson_access_token'
const REFRESH_KEY = 'dummyjson_refresh_token'

function clearBothStorages(): void {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
  sessionStorage.removeItem(ACCESS_KEY)
  sessionStorage.removeItem(REFRESH_KEY)
}

export function persistAuthTokens(
  accessToken: string,
  refreshToken: string,
  remember: boolean,
): void {
  clearBothStorages()
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(ACCESS_KEY, accessToken)
  storage.setItem(REFRESH_KEY, refreshToken)
  setAuthToken(accessToken)
}

export function restoreAuthFromStorage(): void {
  const access =
    sessionStorage.getItem(ACCESS_KEY) ?? localStorage.getItem(ACCESS_KEY)
  if (access) {
    setAuthToken(access)
  }
}

export function clearStoredAuth(): void {
  clearBothStorages()
  setAuthToken(null)
}

export function getStoredRefreshToken(): string | null {
  return (
    sessionStorage.getItem(REFRESH_KEY) ?? localStorage.getItem(REFRESH_KEY)
  )
}
