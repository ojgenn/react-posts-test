import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { getAuthToken } from '../api/api-client'

export function RequireAuth({ children }: { children: ReactNode }) {
  if (!getAuthToken()) {
    return <Navigate to="/login" replace />
  }
  return children
}

export function RequireGuest({ children }: { children: ReactNode }) {
  if (getAuthToken()) {
    return <Navigate to="/products" replace />
  }
  return children
}
