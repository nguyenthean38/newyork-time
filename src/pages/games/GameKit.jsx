/* Thành phần dùng chung trong khu Trò chơi: thanh đầu trang, biểu tượng, thống kê */
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Newspaper, Home } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useClickAway } from '@/components/ui'

export const GAMES = [
  { to: '/tro-choi/chu-an', name: 'Chữ Ẩn', icon: 'chuan', color: '#8fcf9a' },
  { to: '/tro-choi/bo-tu', name: 'Bộ Tứ', icon: 'botu', color: '#c4a3e3' },
  { to: '/tro-choi/sudoku', name: 'Sudoku', icon: 'sudoku', color: '#f6b67a' },
  { to: '/tro-choi/tao-chu-an', name: 'Tạo Chữ Ẩn', icon: 'create', color: '#f3d36b' },
]

/* ---------- Biểu tượng từng trò (SVG tự vẽ) ---------- */
export function GameIcon({ kind, size = 44, className }) {
  const s = { width: size, height: size }
  if (kind === 'chuan') {
    const c = ['#4f9a5a', '#d1a83a', '#7b7f83', '#4f9a5a', '#4f9a5a', '#d1a83a', '#fff', '#fff', '#fff']
    return (
      <svg viewBox="0 0 30 30" style={s} className={className} aria-hidden>
        <rect x=".5" y=".5" width="29" height="29" rx="4" fill="#fff" stroke="#121212" />
        {c.map((f, i) => (
          <rect key={i} x={3 + (i % 3) * 8.3} y={3 + Math.floor(i / 3) * 8.3} width="7.3" height="7.3" rx="1" fill={f} stroke="#121212" strokeWidth=".6" />
        ))}
      </svg>
    )
  }
  if (kind === 'botu') {
    const rows = ['#f3d36b', '#a7cf7b', '#9cc0ec', '#c4a3e3']
    return (
      <svg viewBox="0 0 30 30" style={s} className={className} aria-hidden>
        <rect x=".5" y=".5" width="29" height="29" rx="4" fill="#fff" stroke="#121212" />
        {rows.map((f, r) => [0, 1, 2, 3].map((c) => (
          <rect key={`${r}${c}`} x={3 + c * 6.2} y={3 + r * 6.2} width="5.4" height="5.4" rx="1" fill={r === 3 && c > 1 ? '#efefec' : f} stroke="#121212" strokeWidth=".5" />
        )))}
      </svg>
    )
  }
  if (kind === 'sudoku') {
    return (
      <svg viewBox="0 0 30 30" style={s} className={className} aria-hidden>
        <rect x=".5" y=".5" width="29" height="29" rx="4" fill="#fff" stroke="#121212" />
        <path d="M10.5 1v28M19.5 1v28M1 10.5h28M1 19.5h28" stroke="#121212" strokeWidth="1.2" />
        <text x="5.8" y="8.6" fontSize="6.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif" fill="#121212">5</text>
        <text x="15" y="17.6" fontSize="6.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif" fill="#c8331f">9</text>
        <text x="24.2" y="26.6" fontSize="6.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif" fill="#121212">2</text>
        <text x="24.2" y="8.6" fontSize="6.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif" fill="#121212">7</text>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 30 30" style={s} className={className} aria-hidden>
      <rect x=".5" y=".5" width="29" height="29" rx="4" fill="#fff" stroke="#121212" />
      {[0, 1, 2].map((i) => <rect key={i} x={3 + i * 8.3} y="11.3" width="7.3" height="7.3" rx="1" fill={i === 1 ? '#4f9a5a' : '#fff'} stroke="#121212" strokeWidth=".6" />)}
      <path d="M22 4l4 4-9 9-5 1 1-5z" fill="#f3d36b" stroke="#121212" strokeWidth=".8" />
    </svg>
  )
}

/* ---------- Thanh đầu trang khu trò chơi ---------- */
export function GameHeader({ actions, title }) {
  const [open, setOpen] = useState(false)
  const ref = useClickAway(() => setOpen(false))
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-[52px] max-w-5xl items-center justify-between gap-2 px-3">
        <div className="flex min-w-0 items-center gap-1" ref={ref}>
          <button onClick={() => setOpen(!open)} aria-label="Menu trò chơi" aria-expanded={open} className="rounded p-2 hover:bg-paper-2">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/tro-choi" className="flex items-center gap-1.5">
            <span className="relative inline-flex size-6 items-center justify-center rounded-[5px] bg-ink font-mast text-[16px] font-black leading-none text-paper">
              T<span className="absolute bottom-[3px] right-[2px] size-[3px] rounded-full bg-son" />
            </span>
            <span className="font-mast text-[19px] font-black tracking-[-0.01em]">Trò chơi</span>
          </Link>
          {title && <span className="ml-2 hidden truncate border-l border-rule pl-3 font-sans text-[14px] font-semibold sm:inline">{title}</span>}
          {open && (
            <nav className="anim-pop absolute left-2 top-[50px] w-64 rounded-md border border-rule bg-paper p-2 font-sans text-[14px] shadow-pop">
              <Link to="/" className="flex items-center gap-3 rounded px-3 py-2.5 hover:bg-paper-2"><Newspaper size={18} className="text-muted" /> Trang nhất Tân Thời</Link>
              <Link to="/tro-choi" className="flex items-center gap-3 rounded px-3 py-2.5 hover:bg-paper-2"><Home size={18} className="text-muted" /> Tất cả trò chơi</Link>
              <div className="my-1 border-t border-rule" />
              {GAMES.map((g) => (
                <NavLink key={g.to} to={g.to} onClick={() => setOpen(false)} className={({ isActive }) => cn('flex items-center gap-3 rounded px-3 py-2 hover:bg-paper-2', isActive && 'bg-paper-2 font-semibold')}>
                  <GameIcon kind={g.icon} size={24} /> {g.name}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-0.5">{actions}</div>
      </div>
    </header>
  )
}

export function IconBtn({ label, onClick, children, active }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} className={cn('rounded p-2 text-ink hover:bg-paper-2', active && 'bg-paper-2')}>
      {children}
    </button>
  )
}

/* ---------- Thống kê ---------- */
export function StatsRow({ items }) {
  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {items.map(([v, l]) => (
        <div key={l}>
          <div className="font-sans text-[30px] font-semibold leading-none tabular-nums">{v}</div>
          <div className="mt-1 font-sans text-[11px] leading-tight text-muted">{l}</div>
        </div>
      ))}
    </div>
  )
}

export function DistBars({ dist, highlight }) {
  const max = Math.max(1, ...dist)
  return (
    <div className="space-y-1">
      {dist.map((n, i) => (
        <div key={i} className="flex items-center gap-2 font-sans text-[12px]">
          <span className="w-3 text-right tabular-nums">{i + 1}</span>
          <div className="flex-1">
            <div
              className={cn('flex h-5 min-w-[22px] items-center justify-end rounded-sm px-1.5 font-semibold text-white transition-[width] duration-700', highlight === i ? 'bg-hit' : 'bg-miss')}
              style={{ width: `${Math.max(7, (n / max) * 100)}%` }}
            >
              {n}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/** Đếm ngược tới nửa đêm (câu đố mới). */
export function Countdown() {
  const calc = () => {
    const now = new Date()
    const mid = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    const s = Math.max(0, Math.floor((mid - now) / 1000))
    return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((x) => String(x).padStart(2, '0')).join(':')
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [])
  return <span className="font-sans text-[22px] font-semibold tabular-nums">{t}</span>
}

/** Màn hình chào trước khi vào trò (nền màu, biểu tượng, nút Chơi). */
export function Splash({ icon, color, title, lines, meta, primary, secondary }) {
  return (
    <div className="flex min-h-[calc(100dvh-52px)] flex-col items-center justify-center px-6 py-12 text-center" style={{ background: color }}>
      <GameIcon kind={icon} size={64} />
      <h1 className="mt-4 font-mast text-[40px] font-black leading-none text-[#121212]">{title}</h1>
      <p className="mt-4 max-w-sm font-serif text-[22px] leading-snug text-[#121212]">{lines}</p>
      <div className="mt-8 flex w-full max-w-[260px] flex-col gap-3">
        {primary}
        {secondary}
      </div>
      {meta && <div className="mt-8 font-sans text-[13px] leading-relaxed text-[#121212]">{meta}</div>}
    </div>
  )
}
