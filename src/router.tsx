import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RequireAuth, RequireGuest } from './auth/route-guards'
import { MainLayout } from './layouts/main-layout'
import { LoginPage } from './pages/login-page'
import { ProductsPage } from './pages/products-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <RequireAuth>
            <Navigate to="/products" replace />
          </RequireAuth>
        ),
      },
      {
        path: 'products',
        element: (
          <RequireAuth>
            <ProductsPage />
          </RequireAuth>
        ),
      },
      {
        path: 'login',
        element: (
          <RequireGuest>
            <LoginPage />
          </RequireGuest>
        ),
      },
      {
        path: '*',
        element: (
          <RequireAuth>
            <Navigate to="/products" replace />
          </RequireAuth>
        ),
      },
    ],
  },
])
