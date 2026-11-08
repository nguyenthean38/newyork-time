/* Chân trang, menu bên trái, ngăn tài khoản bên phải, bố cục chung */
import { useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { X, Search, ChevronRight, Moon, Sun, Monitor, LogOut, Bookmark, Mail, Settings, CreditCard, HelpCircle, Gift } from 'lucide-react'
import { Wordmark } from '@/components/brand/Logo'
import { Drawer, Toaster, Avatar } from '@/components/ui'
import { useUI, useUser, useCurrentUser, PLANS, toast } from '@/store'
import { SECTIONS } from '@/data/sections'
import { MastheadHeader, CompactHeader } from './Header'
import { cn } from '@/lib/cn'
import { shortDate } from '@/lib/format'

/* ---------- Chân trang ---------- */
const FOOTER = [
  { title: 'Tin tức', links: SECTIONS.slice(0, 5).map((s) => [s.name, `/chuyen-muc/${s.slug}`]) },
  { title: 'Văn hoá & Đời sống', links: SECTIONS.slice(5, 9).map((s) => [s.name, `/chuyen-muc/${s.slug}`]) },
  { title: 'Ý kiến', links: [['Bình luận', '/chuyen-muc/y-kien'], ['Khách mời', '/chuyen-muc/y-kien?muc=Khách mời'], ['Thảo luận', '/thao-luan']] },
  { title: 'Thêm', links: [['Nghe', '/nghe'], ['Video', '/video'], ['Trò chơi', '/tro-choi'], ['Bản tin email', '/ban-tin'], ['Tìm kiếm', '/tim-kiem']] },
]

export function Footer() {
  return (
    <footer className="mt-16 border-t border-ink">
      <div className="wrap py-8">
        <div className="mb-6 flex items-center justify-between">
          <Wordmark size="sm" />
          <Link to="/tim-kiem" className="flex items-center gap-1 font-sans text-[13px] text-muted hover:text-ink"><Search size={14} /> Tìm trên Tân Thời</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 font-sans text-[13px] sm:grid-cols-3 lg:grid-cols-5">
          {FOOTER.map((c) => (
            <div key={c.title}>
              <div className="kicker mb-3">{c.title}</div>
              <ul className="space-y-2 text-ink-2">
                {c.links.map(([l, to]) => <li key={l}><Link to={to} className="hover:underline">{l}</Link></li>)}
              </ul>
            </div>
          ))}
          <div className="col-span-2 border-t border-rule pt-6 sm:col-span-1 sm:border-0 sm:pt-0 lg:border-l lg:pl-6">
            <div className="kicker mb-3">Tài khoản</div>
            <ul className="space-y-2 font-semibold">
              <li><Link to="/goi-doc" className="hover:underline">Đăng ký gói đọc</Link></li>
              <li><Link to="/tai-khoan" className="hover:underline">Quản lý tài khoản</Link></li>
              <li><Link to="/danh-sach-doc" className="hover:underline">Danh sách đọc</Link></li>
              <li><Link to="/goi-doc/gia-dinh" className="hover:underline">Gói gia đình</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-rule">
        <div className="wrap flex flex-col gap-2 py-4 font-sans text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Tân Thời · Trang tin minh hoạ, mọi bài viết và nhân vật đều hư cấu.</div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>Ảnh: Wikimedia Commons (ghi nguồn dưới mỗi ảnh)</span>
            <a href="https://ntahientech.com" target="_blank" rel="noreferrer" className="hover:underline">Thiết kế bởi Ntahien Tech</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ---------- Menu bên trái ---------- */
export function SideMenu() {
  const open = useUI((s) => s.menuOpen)
  const setMenu = useUI((s) => s.setMenu)
  const nav = useNavigate()
  const close = () => setMenu(false)
  const go = (to) => { close(); nav(to) }
  return (
    <Drawer open={open} onClose={close} label="Menu" side="left">
      <div className="flex items-center justify-between border-b border-rule px-5 py-3">
        <Wordmark size="sm" />
        <button onClick={close} aria-label="Đóng menu" className="rounded p-1.5 hover:bg-paper-2"><X size={20} /></button>
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); const q = new FormData(e.currentTarget).get('q'); go(`/tim-kiem?q=${encodeURIComponent(q || '')}`) }}
        className="flex gap-2 px-5 pt-4"
      >
        <input name="q" placeholder="Tìm kiếm" className="field-input h-9 text-sm" />
        <button className="btn btn-sm bg-link text-white">Tìm</button>
      </form>
      <nav className="flex-1 overflow-y-auto px-5 py-4 font-sans">
        <div className="kicker mb-2 text-muted">Chuyên mục</div>
        <ul className="mb-6">
          <li><button onClick={() => go('/')} className="flex w-full items-center justify-between py-2 text-[15px] hover:underline">Trang nhất <ChevronRight size={15} className="text-faint" /></button></li>
          {SECTIONS.map((s) => (
            <li key={s.slug}><button onClick={() => go(`/chuyen-muc/${s.slug}`)} className="flex w-full items-center justify-between py-2 text-[15px] hover:underline">{s.name} <ChevronRight size={15} className="text-faint" /></button></li>
          ))}
        </ul>
        <div className="kicker mb-2 text-muted">Thêm từ Tân Thời</div>
        <ul className="grid grid-cols-2 gap-2 text-[14px]">
          {[['Nghe', '/nghe'], ['Video', '/video'], ['Trò chơi', '/tro-choi'], ['Bản tin', '/ban-tin'], ['Thảo luận', '/thao-luan'], ['Danh sách đọc', '/danh-sach-doc']].map(([l, to]) => (
            <li key={l}><button onClick={() => go(to)} className="w-full rounded border border-rule px-3 py-2 text-left hover:bg-paper-2">{l}</button></li>
          ))}
        </ul>
      </nav>
      <ThemeSwitch className="border-t border-rule px-5 py-4" />
    </Drawer>
  )
}

export function ThemeSwitch({ className }) {
  const theme = useUI((s) => s.theme)
  const setTheme = useUI((s) => s.setTheme)
  const opts = [['light', 'Sáng', Sun], ['dark', 'Tối', Moon], ['system', 'Theo máy', Monitor]]
  return (
    <div className={className}>
      <div className="kicker mb-2 text-muted">Giao diện</div>
      <div className="grid grid-cols-3 gap-1 rounded border border-rule p-1 font-sans text-[13px]">
        {opts.map(([v, l, I]) => (
          <button key={v} onClick={() => setTheme(v)} className={cn('flex items-center justify-center gap-1.5 rounded py-1.5', theme === v ? 'bg-ink text-paper' : 'hover:bg-paper-2')}>
            <I size={14} /> {l}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------- Ngăn tài khoản bên phải ---------- */
export function greeting(d = new Date()) {
  const h = d.getHours()
  if (h < 11) return 'Chào buổi sáng'
  if (h < 14) return 'Chào buổi trưa'
  if (h < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}

export function AccountDrawer() {
  const open = useUI((s) => s.accountOpen)
  const setAccount = useUI((s) => s.setAccount)
  const user = useCurrentUser()
  const logout = useUser((s) => s.logout)
  const nav = useNavigate()
  const close = () => setAccount(false)
  const go = (to) => { close(); nav(to) }
  if (!user) return null
  const sub = user.subscription
  const plan = sub && PLANS[sub.plan]
  const name = [user.lastName, user.firstName].filter(Boolean).join(' ')
  return (
    <Drawer open={open} onClose={close} side="right" label="Tài khoản">
      <div className="flex justify-end px-4 pt-3">
        <button onClick={close} aria-label="Đóng" className="rounded p-1.5 hover:bg-paper-2"><X size={20} /></button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-6 font-sans">
        <div className="flex items-center gap-3">
          <Avatar icon={user.icon} size={44} />
          <div className="min-w-0">
            <div className="font-serif text-[22px] font-bold leading-tight">{greeting()}{user.firstName ? `, ${user.firstName}` : ''}.</div>
            <div className="truncate text-[13px] text-muted">{name || user.email}</div>
          </div>
        </div>
        <div className="mt-6 border-t border-ink pt-3">
          <div className="kicker mb-1">Gói của bạn</div>
          {plan ? (
            <div className="text-[14px]">
              <div className="font-semibold">{plan.name}</div>
              <div className="text-muted">
                {sub.status === 'canceled' ? `Đã huỷ — còn dùng đến ${shortDate(new Date(sub.trialEnds))}` : `Dùng thử miễn phí đến ${shortDate(new Date(sub.trialEnds))}`}
              </div>
              <button onClick={() => go('/tai-khoan/goi')} className="btn btn-line btn-sm mt-3 w-full">Xem quyền lợi</button>
            </div>
          ) : (
            <div className="text-[14px]">
              <p className="text-muted">Bạn đang dùng tài khoản miễn phí.</p>
              <button onClick={() => go('/goi-doc')} className="btn btn-son btn-sm mt-3 w-full">Đăng ký — 9.000₫/tuần</button>
            </div>
          )}
        </div>
        <ul className="mt-6 space-y-0.5 border-t border-rule pt-3 text-[14px]">
          {[
            [Settings, 'Cài đặt tài khoản', '/tai-khoan'],
            [CreditCard, 'Gói & thanh toán', '/tai-khoan/goi'],
            [Bookmark, 'Bài đã lưu', '/danh-sach-doc'],
            [Mail, 'Bản tin email', '/tai-khoan/email'],
            [Gift, 'Tặng gói Gia đình', '/goi-doc/gia-dinh'],
            [HelpCircle, 'Trợ giúp', '/tai-khoan/tro-giup'],
          ].map(([I, l, to]) => (
            <li key={l}>
              <button onClick={() => go(to)} className="flex w-full items-center gap-3 rounded px-2 py-2.5 hover:bg-paper-2"><I size={16} className="text-muted" /> {l}</button>
            </li>
          ))}
        </ul>
        <ThemeSwitch className="mt-6 border-t border-rule pt-4" />
        <button
          onClick={() => { logout(); close(); toast('Bạn đã đăng xuất.'); nav('/') }}
          className="mt-6 flex items-center gap-2 text-[14px] font-semibold underline underline-offset-2"
        >
          <LogOut size={15} /> Đăng xuất
        </button>
      </div>
    </Drawer>
  )
}

/* ---------- Cuộn lên đầu khi đổi trang ---------- */
export function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

/* ---------- Bố cục trang báo ---------- */
export function SiteLayout() {
  const { pathname } = useLocation()
  const home = pathname === '/'
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollTop />
      {home ? <MastheadHeader /> : <CompactHeader />}
      <main className="flex-1"><Outlet /></main>
      <Footer />
      <SideMenu />
      <AccountDrawer />
      <Toaster />
    </div>
  )
}

/* ---------- Bố cục tối giản: đăng nhập, thanh toán, tài khoản ---------- */
export function MinimalLayout() {
  const user = useCurrentUser()
  const setAccount = useUI((s) => s.setAccount)
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollTop />
      <header className="relative flex h-14 items-center justify-center border-b border-rule px-4">
        <Wordmark size="md" />
        {user && (
          <button onClick={() => setAccount(true)} className="absolute right-4 hidden max-w-[40%] truncate font-sans text-[13px] text-muted hover:text-ink sm:block">{user.email} ▾</button>
        )}
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t border-rule py-5 text-center font-sans text-[11px] text-muted">
        © {new Date().getFullYear()} Tân Thời · <Link to="/" className="hover:underline">Trang nhất</Link> · Bản demo — dữ liệu chỉ lưu trên trình duyệt của bạn
      </footer>
      <AccountDrawer />
      <Toaster />
    </div>
  )
}
