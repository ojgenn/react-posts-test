import {Outlet} from 'react-router-dom'

export function MainLayout() {
  return (
    <main className="app-main flex min-h-svh flex-1 flex-col">
      <Outlet />
    </main>
  )
}
