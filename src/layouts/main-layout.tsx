import {Outlet} from 'react-router-dom'

export function MainLayout() {
  return (
      <main className="app-main">
          <Outlet />
      </main>
  )
}
