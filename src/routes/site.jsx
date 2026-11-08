/* Các trang báo (dùng SiteLayout: đầu báo + chân trang) */
import { L } from './lazy'

export const siteRoutes = [
  { path: '/', element: L(() => import('@/pages/HomePage')) },
  { path: '/chuyen-muc/:slug', element: L(() => import('@/pages/SectionPage')) },
  { path: '/bai/:slug', element: L(() => import('@/pages/ArticlePage')) },
  { path: '/tac-gia/:slug', element: L(() => import('@/pages/AuthorPage')) },
  { path: '/tim-kiem', element: L(() => import('@/pages/SearchPage')) },
  { path: '/ban-tin', element: L(() => import('@/pages/NewslettersPage')) },
  { path: '/nghe', element: L(() => import('@/pages/media/AudioPage')) },
  { path: '/nghe/:id', element: L(() => import('@/pages/media/EpisodePage')) },
  { path: '/video', element: L(() => import('@/pages/media/VideoPage')) },
  { path: '/thao-luan', element: L(() => import('@/pages/ConversationsPage')) },
  { path: '/danh-sach-doc', element: L(() => import('@/pages/ReadingListPage')) },
  { path: '/bao-hom-nay', element: L(() => import('@/pages/TodayPaperPage')) },
]
