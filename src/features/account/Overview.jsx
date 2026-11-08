/* Tổng quan tài khoản: thông tin, hồ sơ, gói, chia sẻ, nội dung, quyền riêng tư */
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Avatar } from '@/components/ui'
import { PLANS } from '@/store'
import { greeting } from '@/components/layout/Chrome'
import { shortDate } from '@/lib/format'
import { InfoRow } from './shared'
import { AccountShell, Block } from './AccountShell'

export function fullName(u) {
  return [u.lastName, u.firstName].filter(Boolean).join(' ')
}

export function SubStatus({ sub }) {
  if (!sub) return null
  if (sub.status === 'canceled') return <span className="rounded-sm bg-son-soft px-1.5 py-0.5 text-[11px] font-semibold text-son">Đã huỷ</span>
  return <span className="rounded-sm bg-paper-3 px-1.5 py-0.5 text-[11px] font-semibold">Dùng thử</span>
}

export function Overview({ user }) {
  const sub = user.subscription
  const plan = sub && PLANS[sub.plan]
  return (
    <AccountShell>
      <h1 className="font-serif text-[30px] font-semibold leading-tight">{greeting()}{user.firstName ? `, ${user.firstName}` : ''}.</h1>
      <p className="mt-1 font-sans text-[14px] text-muted">
        {sub ? `Bạn đã ủng hộ báo chí độc lập từ năm ${new Date(sub.startedAt).getFullYear()}.` : `Thành viên từ ${shortDate(new Date(user.createdAt))}.`}
      </p>

      <Block title="Thông tin tài khoản">
        <InfoRow label="Số tài khoản" value={user.accountNo} />
        <InfoRow label="Địa chỉ email" value={user.email} action="Cập nhật" to="/tai-khoan/doi-email" />
        <InfoRow label="Mật khẩu" value={user.password ? '••••••••••' : 'Đăng nhập bằng tài khoản liên kết'} action={user.password ? 'Cập nhật' : 'Tạo mật khẩu'} to="/tai-khoan/doi-mat-khau" />
      </Block>

      <Block title="Hồ sơ của bạn">
        <InfoRow label="Ảnh đại diện" action="Cập nhật" to="/tai-khoan/anh-dai-dien">
          <Avatar icon={user.icon} size={32} className="mt-1.5" />
        </InfoRow>
        <InfoRow label="Họ và tên" value={fullName(user)} action="Cập nhật" to="/tai-khoan/ten" />
        <InfoRow label="Tên người dùng" value={user.username && `@${user.username}`} action="Cập nhật" to="/tai-khoan/ten-nguoi-dung" />
        <InfoRow label="Địa điểm đã lưu" value={user.places.length ? user.places.join(' · ') : 'Chưa có địa điểm nào'} action="Cập nhật" to="/tai-khoan/dia-diem" />
      </Block>

      <Block title="Gói của bạn">
        {plan ? (
          <div className="mt-4 flex flex-col gap-4 rounded border border-rule p-4 font-sans sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[15px] font-semibold">{plan.name} <SubStatus sub={sub} /></div>
              <div className="mt-0.5 text-[13px] text-muted">
                {sub.status === 'canceled' ? `Truy cập đến hết ${shortDate(new Date(sub.trialEnds))}` : `Miễn phí đến ${shortDate(new Date(sub.trialEnds))}`}
              </div>
              <p className="mt-1 text-[13px] text-muted">{plan.desc}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <Link to="/tai-khoan/goi" className="btn btn-ink btn-sm">Quản lý gói</Link>
              <Link to="/tai-khoan/goi#doi-goi" className="btn btn-line btn-sm">Đổi gói</Link>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded border border-rule p-4 font-sans">
            <div className="text-[15px] font-semibold">Tài khoản miễn phí</div>
            <p className="mt-1 text-[13px] text-muted">Đăng ký để đọc không giới hạn, chơi mọi trò chơi và xem công thức.</p>
            <Link to="/goi-doc" className="btn btn-son btn-sm mt-3">Xem các gói đọc</Link>
          </div>
        )}
      </Block>

      <Block title="Chia sẻ Tân Thời">
        <InfoRow label="Gói Gia đình" value="Thêm tối đa 3 người, mỗi người một đăng nhập riêng." action="Xem lựa chọn" to="/goi-doc/gia-dinh" />
      </Block>

      <Block title="Nội dung của bạn">
        <InfoRow label="Bản tin" value={`Đang nhận ${user.newsletters.length} bản tin`} action="Xem tất cả" to="/tai-khoan/email" />
        <InfoRow label="Bài đã lưu" value={`${user.saved.length} bài trong danh sách đọc`} action="Xem tất cả" to="/danh-sach-doc" />
      </Block>

      <Block title="Quyền riêng tư">
        <p className="mt-2 font-sans text-[13px] text-muted">Tân Thời tôn trọng quyền riêng tư của bạn. Trong bản demo, mọi dữ liệu chỉ nằm trên trình duyệt này.</p>
        <Link to="/tai-khoan/xoa" className="mt-3 flex items-center justify-between border-b border-rule py-4 font-sans">
          <span>
            <span className="block text-[13px] font-semibold">Xoá tài khoản</span>
            <span className="block text-[13px] text-muted">Bạn sẽ mất quyền truy cập mọi lịch sử gắn với tài khoản.</span>
          </span>
          <ChevronRight size={18} className="text-muted" />
        </Link>
      </Block>
    </AccountShell>
  )
}
