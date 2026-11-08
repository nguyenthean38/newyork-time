/* Đầu trang: măng-sét lớn (trang nhất) và thanh gọn (các trang khác) */
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Search, ChevronDown, TrendingUp, TrendingDown, CloudSun, X } from 'lucide-react'
import { Wordmark } from '@/components/brand/Logo'
import { useUI, useCurrentUser } from '@/store'
import { longDate } from '@/lib/format'
import { lunarLabel } from '@/lib/lunar'
import { EDITIONS } from '@/data/sections'
import { NavBar } from './Nav'
import { cn } from '@/lib/cn'

/* ---------- Nút đăng ký / tài khoản ---------- */
export function AccountButtons({ compact = false }) {
  const user = useCurrentUser()
  const setAccount = useUI((s) => s.setAccount)
  const sub = user?.subscription && user.subscription.status !== 'canceled'
  return (
    <div className="flex items-center gap-2">
      {!sub && (
        <Link to="/goi-doc" className={cn('btn btn-son btn-sm uppercase tracking-[0.04em]', compact && 'hidden sm:inline-flex')}>
          {compact ? 'Đăng ký' : 'Đăng ký 9.000₫/tuần'}
        </Link>
      )}
      {sub && !compact && (
        <Link to="/goi-doc/gia-dinh" className="btn btn-sm hidden bg-paper-3 uppercase tracking-[0.04em] text-ink hover:bg-rule sm:inline-flex">Tặng gói</Link>
      )}
      {user ? (
        <button onClick={() => setAccount(true)} className="flex items-center gap-1 px-1 font-sans text-[13px] font-medium text-ink hover:opacity-70">
          Tài khoản <ChevronDown size={14} />
        </button>
      ) : (
        <Link to="/dang-nhap" className="btn btn-sm btn-line uppercase tracking-[0.04em]">Đăng nhập</Link>
      )}
    </div>
  )
}

/* ---------- Ô tìm kiếm mở rộng ---------- */
function SearchToggle() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const submit = (e) => {
    e.preventDefault()
    if (!q.trim()) return
    nav(`/tim-kiem?q=${encodeURIComponent(q.trim())}`)
    setOpen(false)
  }
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} aria-label="Tìm kiếm" className="rounded p-2 hover:bg-paper-2">
        <Search size={19} />
      </button>
    )
  }
  return (
    <form onSubmit={submit} className="anim-fade flex items-center gap-1.5">
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Tìm kiếm"
        className="h-8 w-40 rounded-[3px] border border-rule-2 bg-paper px-2.5 text-[13px] focus:border-ink focus:outline-none sm:w-52"
      />
      <button type="submit" className="btn btn-sm h-8 bg-link px-3 text-white">Tìm</button>
      <button type="button" onClick={() => setOpen(false)} aria-label="Đóng tìm kiếm" className="p-1 text-muted hover:text-ink"><X size={16} /></button>
    </form>
  )
}

/* ---------- Chỉ số thị trường + thời tiết (giả lập) ---------- */
function Ticker() {
  const items = [
    { k: 'VN-Index', v: '1.318,42', d: +0.46 },
    { k: 'Vàng SJC', v: '148,2 tr', d: -0.12 },
    { k: 'USD', v: '25.415', d: +0.03 },
  ]
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 4000)
    return () => clearInterval(t)
  }, [items.length])
  const it = items[i]
  const up = it.d >= 0
  return (
    <div className="flex flex-col items-end gap-1 font-sans text-[13px]">
      <div key={it.k} className="anim-fade flex items-center gap-1.5">
        <span className="font-medium">{it.k}</span>
        <span>{it.v}</span>
        <span className={cn('flex items-center gap-0.5', up ? 'text-pos' : 'text-neg')}>
          {up ? '+' : ''}{it.d.toLocaleString('vi-VN')}%
          {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-muted">
        <CloudSun size={14} /> Hà Nội 24° · TP.HCM 31°
      </div>
    </div>
  )
}

/* ---------- Măng-sét trang nhất ---------- */
export function MastheadHeader() {
  const setMenu = useUI((s) => s.setMenu)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 260)
    h()
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  const today = new Date()
  return (
    <>
      <header className="wrap pt-2">
        <div className="flex h-11 items-center justify-between">
          <div className="flex items-center gap-1">
            <button onClick={() => setMenu(true)} aria-label="Mở menu" className="rounded p-2 hover:bg-paper-2 lg:hidden"><Menu size={20} /></button>
            <SearchToggle />
          </div>
          <nav aria-label="Phiên bản" className="hidden items-center gap-4 font-sans text-[11px] uppercase tracking-[0.1em] text-ink-2 md:flex">
            {EDITIONS.map((e, i) => (
              <button key={e} className={cn('hover:text-ink', i === 0 && 'font-bold text-ink')}>{e}</button>
            ))}
          </nav>
          <AccountButtons />
        </div>
        <div className="grid grid-cols-1 items-center gap-2 py-3 text-center lg:grid-cols-[1fr_auto_1fr] lg:py-1 lg:text-left">
          <div className="order-2 font-sans text-[13px] leading-relaxed lg:order-1">
            <div className="font-semibold">{longDate(today)}</div>
            <div className="text-muted">Âm lịch: {lunarLabel(today)}</div>
            <Link to="/bao-hom-nay" className="hidden text-muted underline-offset-2 hover:underline lg:inline">Báo hôm nay</Link>
          </div>
          <div className="order-1 text-center lg:order-2">
            <Wordmark size="xl" />
            <div className="mt-1 font-sans text-[10px] uppercase tracking-[0.32em] text-muted">Nhật báo điện tử · Bản minh hoạ</div>
          </div>
          <div className="order-3 hidden justify-end lg:flex"><Ticker /></div>
        </div>
        <NavBar />
        <div className="rule-double" />
      </header>
      {/* Thanh gọn xuất hiện khi cuộn xuống */}
      <div className={cn('fixed inset-x-0 top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur transition-transform duration-300', scrolled ? 'translate-y-0' : '-translate-y-full')} aria-hidden={!scrolled}>
        <CompactBar />
      </div>
    </>
  )
}

/* ---------- Thanh gọn cho các trang khác ---------- */
export function CompactBar({ title }) {
  const setMenu = useUI((s) => s.setMenu)
  return (
    <div className="relative flex h-[52px] items-center justify-between px-3 sm:px-5">
      <div className="flex items-center gap-0.5">
        <button onClick={() => setMenu(true)} aria-label="Mở menu" className="rounded p-2 hover:bg-paper-2"><Menu size={20} /></button>
        <div className="hidden sm:block"><SearchToggle /></div>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2">
        {title || <Wordmark size="md" />}
      </div>
      <AccountButtons compact />
    </div>
  )
}

export function CompactHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur">
      <CompactBar />
    </header>
  )
}
