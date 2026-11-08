/* Đăng nhập, gói đọc, thanh toán, tài khoản (bố cục tối giản) */
import { L } from './lazy'

export const accountRoutes = [
  { path: '/dang-nhap', element: L(() => import('@/pages/auth/LoginPage')) },
  { path: '/quen-mat-khau', element: L(() => import('@/pages/auth/ForgotPage')) },
  { path: '/chao-mung', element: L(() => import('@/pages/auth/OnboardingPage')) },
  { path: '/goi-doc', element: L(() => import('@/pages/auth/PlansPage')) },
  { path: '/goi-doc/dung-thu', element: L(() => import('@/pages/auth/TrialPage')) },
  { path: '/goi-doc/gia-dinh', element: L(() => import('@/pages/auth/FamilyPage')) },
  { path: '/thanh-toan', element: L(() => import('@/pages/auth/CheckoutPage')) },
  { path: '/cam-on', element: L(() => import('@/pages/auth/ThanksPage')) },
  { path: '/tai-khoan', element: L(() => import('@/pages/account/AccountPage')) },
  { path: '/tai-khoan/:section', element: L(() => import('@/pages/account/AccountPage')) },
]
