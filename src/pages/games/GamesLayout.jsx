import { Outlet } from 'react-router-dom'
import { ScrollTop } from '@/components/layout/Chrome'
import { Toaster } from '@/components/ui'

export default function GamesLayout() {
  return (
    <div className="min-h-dvh">
      <ScrollTop />
      <Outlet />
      <Toaster />
    </div>
  )
}
