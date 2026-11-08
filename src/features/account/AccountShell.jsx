/* Khung trang tài khoản: thanh bên trái + nội dung */
import { NavLink } from 'react-router-dom'
import { HelpCircle } from 'lucide-react'
import { cn } from '@/lib/cn'

const LINKS = [
  ['Tài khoản', '/tai-khoan', true],
  ['Gói của bạn', '/tai-khoan/goi'],
  ['Lịch sử thanh toán', '/tai-khoan/thanh-toan'],
  ['Email & cài đặt', '/tai-khoan/email'],
]

export function AccountShell({ children }) {
  return (
    <div className="wrap max-w-5xl py-8 md:grid md:grid-cols-[200px_1fr] md:gap-12 md:py-12">
      <nav aria-label="Tài khoản" className="no-scrollbar -mx-4 mb-6 flex gap-1 overflow-x-auto border-b border-rule px-4 font-sans text-[14px] md:mx-0 md:mb-0 md:block md:border-0 md:px-0">
        {LINKS.map(([l, to, end]) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => cn(
              'block shrink-0 border-b-2 px-2 py-2.5 md:border-b-0 md:border-l-2 md:py-2 md:pl-3',
              isActive ? 'border-ink font-semibold' : 'border-transparent text-muted hover:text-ink',
            )}
          >
            {l}
          </NavLink>
        ))}
        <NavLink to="/tai-khoan/tro-giup" className={({ isActive }) => cn('flex shrink-0 items-center gap-1.5 px-2 py-2.5 md:mt-6 md:pl-3', isActive ? 'font-semibold' : 'text-muted hover:text-ink')}>
          <HelpCircle size={15} /> Trợ giúp
        </NavLink>
      </nav>
      <div className="min-w-0 max-w-2xl">{children}</div>
    </div>
  )
}

/** Tiêu đề khối có đường kẻ đậm phía trên. */
export function Block({ title, children, className }) {
  return (
    <section className={cn('mt-10 border-t-2 border-ink pt-3', className)}>
      {title && <h2 className="font-sans text-[16px] font-bold">{title}</h2>}
      {children}
    </section>
  )
}

/** Trang chỉnh sửa tập trung (không có thanh bên). */
export function FocusPage({ title, sub, children }) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-14">
      <h1 className="font-serif text-[26px] font-semibold">{title}</h1>
      {sub && <p className="mt-2 font-sans text-[14px] leading-relaxed text-muted">{sub}</p>}
      <div className="mt-6">{children}</div>
    </div>
  )
}
