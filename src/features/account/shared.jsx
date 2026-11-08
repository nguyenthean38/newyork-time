/* Thành phần dùng chung cho khu đăng nhập, gói đọc và tài khoản */
import { Link } from 'react-router-dom'
import { ChevronLeft, Info } from 'lucide-react'
import { cn } from '@/lib/cn'

export const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim())

/** Khung hẹp giữa trang cho các bước đăng nhập / đặt lại mật khẩu. */
export function AuthShell({ title, sub, children, className, wide }) {
  return (
    <div className={cn('mx-auto w-full px-4 py-10 sm:py-14', wide ? 'max-w-3xl' : 'max-w-[400px]', className)}>
      {title && <h1 className="text-center font-serif text-[26px] font-semibold leading-tight">{title}</h1>}
      {sub && <p className="mt-2 text-center font-sans text-[14px] leading-relaxed text-muted">{sub}</p>}
      <div className="mt-7">{children}</div>
    </div>
  )
}

/** Ghi chú "bản demo" nổi bật. */
export function DemoNote({ children, className }) {
  return (
    <div className={cn('flex gap-2.5 rounded border border-dashed border-son/60 bg-son-soft px-3.5 py-3 font-sans text-[13px] leading-snug text-ink-2', className)}>
      <Info size={16} className="mt-0.5 shrink-0 text-son" />
      <div>{children}</div>
    </div>
  )
}

export function Divider({ children = 'hoặc' }) {
  return (
    <div className="my-5 flex items-center gap-3 font-sans text-[12px] text-muted">
      <span className="h-px flex-1 bg-rule" />
      {children}
      <span className="h-px flex-1 bg-rule" />
    </div>
  )
}

export function BackLink({ to = '/tai-khoan', children = 'Quay lại tài khoản' }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1 font-sans text-[13px] font-semibold underline-offset-2 hover:underline">
      <ChevronLeft size={15} /> {children}
    </Link>
  )
}

export function Terms() {
  return (
    <p className="mt-4 font-sans text-[12px] leading-relaxed text-muted">
      Khi tiếp tục, bạn đồng ý với <Link to="/tai-khoan/tro-giup" className="underline">Điều khoản dịch vụ</Link> và{' '}
      <Link to="/tai-khoan/tro-giup" className="underline">Chính sách quyền riêng tư</Link> của Tân Thời. Đây là trang demo: dữ liệu chỉ lưu trên trình duyệt của bạn.
    </p>
  )
}

/** Mã QR trang trí: ma trận khối SVG sinh từ chuỗi (không mã hoá dữ liệu thật). */
export function DemoQR({ seed = 'tan-thoi', size = 132, className }) {
  const n = 25
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
  const rnd = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 1000) / 1000 }
  const finder = (x, y) => {
    const inBox = (ox, oy) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7
    for (const [ox, oy] of [[0, 0], [n - 7, 0], [0, n - 7]]) {
      if (inBox(ox, oy)) {
        const dx = x - ox, dy = y - oy
        return dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4) ? 1 : 0
      }
    }
    return null
  }
  const cells = []
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const f = finder(x, y)
    const on = f === null ? rnd() > 0.52 : f
    if (on) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />)
  }
  return (
    <svg viewBox={`-2 -2 ${n + 4} ${n + 4}`} width={size} height={size} className={cn('rounded bg-white', className)} aria-label="Mã QR minh hoạ" role="img">
      <g fill="#121212" shapeRendering="crispEdges">{cells}</g>
    </svg>
  )
}

/** Điện thoại vẽ bằng CSS cho màn tải ứng dụng. */
export function PhoneMock({ tone = '#f2c94c', kind = 'news', className }) {
  return (
    <div className={cn('relative h-[230px] w-[116px] shrink-0 rounded-[22px] border-[5px] border-[#1b1b1b] bg-white p-2 shadow-pop', className)}>
      <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-[#1b1b1b]" />
      {kind === 'news' && (
        <div className="space-y-1.5">
          <div className="text-center font-mast text-[11px] font-black text-[#121212]">Tân Thời</div>
          <div className="h-14 rounded-sm" style={{ background: tone }} />
          <div className="h-1.5 w-full rounded bg-[#222]" /><div className="h-1.5 w-3/4 rounded bg-[#222]" />
          <div className="h-1 w-full rounded bg-[#bbb]" /><div className="h-1 w-5/6 rounded bg-[#bbb]" />
          <div className="mt-2 grid grid-cols-2 gap-1"><div className="h-8 rounded-sm bg-[#ddd]" /><div className="h-8 rounded-sm bg-[#ddd]" /></div>
        </div>
      )}
      {kind === 'games' && (
        <div className="grid grid-cols-5 gap-1 pt-2">
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} className="aspect-square rounded-[2px]" style={{ background: i < 5 ? (i % 2 ? '#d1a83a' : '#4f9a5a') : i < 10 ? (i === 7 ? '#4f9a5a' : '#7b7f83') : '#e5e5e5' }} />
          ))}
        </div>
      )}
      {kind === 'food' && (
        <div className="space-y-1.5">
          <div className="aspect-square rounded-full" style={{ background: `radial-gradient(circle, ${tone} 40%, #f4e1c1 41%)` }} />
          <div className="h-1.5 w-full rounded bg-[#222]" /><div className="h-1 w-2/3 rounded bg-[#bbb]" />
          <div className="flex gap-0.5 text-[9px] text-[#d1a83a]">★★★★★</div>
        </div>
      )}
    </div>
  )
}

/** Dòng thông tin trong trang tài khoản. */
export function InfoRow({ label, value, action, to, onClick, children }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-rule py-4 font-sans">
      <div className="min-w-0">
        <div className="text-[13px] font-semibold">{label}</div>
        {value !== undefined && <div className="mt-0.5 break-words text-[14px] text-muted">{value || 'Chưa thêm'}</div>}
        {children}
      </div>
      {action && (to
        ? <Link to={to} className="shrink-0 text-[13px] font-semibold underline underline-offset-2">{action}</Link>
        : <button onClick={onClick} className="shrink-0 text-[13px] font-semibold underline underline-offset-2">{action}</button>)}
    </div>
  )
}

export const ICON_COLORS = ['#f4c7c3', '#f7dca4', '#cfe8c4', '#bfe0e8', '#c9cdf2', '#e6c6ec', '#f2d0b8']

/** Định dạng tiền tuần: "9.000₫/tuần" */
export const perWeek = (n) => `${n.toLocaleString('vi-VN')}₫/tuần`
export const perMonth = (n) => `${n.toLocaleString('vi-VN')}₫/tháng`
