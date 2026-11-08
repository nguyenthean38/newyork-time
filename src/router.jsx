import { createBrowserRouter } from 'react-router-dom'
import { SiteLayout, MinimalLayout } from '@/components/layout/Chrome'
import GamesLayout from '@/pages/games/GamesLayout'
import { siteRoutes } from '@/routes/site'
import { gameRoutes } from '@/routes/games'
import { accountRoutes } from '@/routes/account'
import { L } from '@/routes/lazy'

export const router = createBrowserRouter(
  [
    { element: <SiteLayout />, children: [...siteRoutes, { path: '*', element: L(() => import('@/pages/NotFoundPage')) }] },
    { element: <GamesLayout />, children: gameRoutes },
    { element: <MinimalLayout />, children: accountRoutes },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
)
