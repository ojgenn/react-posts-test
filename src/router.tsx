import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout } from './layouts/main-layout'
import { LoginPage } from './pages/login-page'
import { ProductsPage } from './pages/products-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/products" replace /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: '*', element: <Navigate to="/products" replace /> },
    ],
  },
])
