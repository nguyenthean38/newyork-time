/* Trung tâm tài khoản: chọn mục theo tham số :section */
import { Navigate, useLocation, useParams } from 'react-router-dom'
import { useTitle } from '@/components/ui'
import { useCurrentUser } from '@/store'
import { Overview } from '@/features/account/Overview'
import { SubscriptionSection, BillingSection, EmailSection, HelpSection } from '@/features/account/Sections'
import { NameEdit, UsernameEdit, IconEdit, EmailEdit, PasswordEdit, PlacesEdit } from '@/features/account/EditPages'
import { DeleteFlow, CancelFlow, leaving } from '@/features/account/Flows'

const SECTIONS = {
  goi: ['Gói của bạn', SubscriptionSection],
  'thanh-toan': ['Lịch sử thanh toán', BillingSection],
  email: ['Email & cài đặt', EmailSection],
  'tro-giup': ['Trợ giúp', HelpSection],
  ten: ['Họ và tên', NameEdit],
  'ten-nguoi-dung': ['Tên người dùng', UsernameEdit],
  'anh-dai-dien': ['Ảnh đại diện', IconEdit],
  'doi-email': ['Đổi email', EmailEdit],
  'doi-mat-khau': ['Mật khẩu', PasswordEdit],
  'dia-diem': ['Địa điểm đã lưu', PlacesEdit],
  xoa: ['Xoá tài khoản', DeleteFlow],
  'huy-goi': ['Huỷ gói', CancelFlow],
}

export default function AccountPage() {
  const { section } = useParams()
  const { pathname } = useLocation()
  const user = useCurrentUser()
  const entry = section ? SECTIONS[section] : null
  useTitle(entry ? entry[0] : 'Tài khoản')

  if (!user && leaving.current) return null
  if (!user) return <Navigate to={`/dang-nhap?next=${encodeURIComponent(pathname)}`} replace />
  if (section && !entry) return <Navigate to="/tai-khoan" replace />
  const C = entry ? entry[1] : Overview
  return <C key={section || 'overview'} user={user} />
}
