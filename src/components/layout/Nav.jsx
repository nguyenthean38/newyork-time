/* Thanh chuyên mục với menu thả xuống (desktop) và cuộn ngang (di động) */
import { useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ChevronDown, Mail } from 'lucide-react'
import { MAIN_NAV, SECTION_BY_SLUG } from '@/data/sections'
import { bySection } from '@/data'
import { cn } from '@/lib/cn'

const EXTRA = {
  nghe: {
    cols: [
      { title: 'Chương trình', links: [['Sáng Nay — bản tin 15 phút', '/nghe'], ['Đọc Chậm — chuyện sách', '/nghe'], ['Phố Thị — đô thị và con người', '/nghe'], ['Bếp Tối Nay', '/nghe']] },
      { title: 'Nghe bài báo', links: [['Bài viết có giọng đọc', '/nghe'], ['Danh sách nghe của bạn', '/danh-sach-doc']] },
    ],
  },
  video: {
    cols: [
      { title: 'Video', links: [['Hôm nay', '/video'], ['Phóng sự', '/video'], ['Tài liệu ngắn', '/video'], ['Ẩm thực', '/video']] },
    ],
  },
  'tro-choi': {
    cols: [
      { title: 'Chơi ngay', links: [['Chữ Ẩn — đoán từ 5 chữ cái', '/tro-choi/chu-an'], ['Bộ Tứ — nhóm 16 từ', '/tro-choi/bo-tu'], ['Sudoku', '/tro-choi/sudoku'], ['Tự tạo Chữ Ẩn', '/tro-choi/tao-chu-an']] },
      { title: 'Cộng đồng', links: [['Thống kê của bạn', '/tro-choi'], ['Mẹo chơi', '/tro-choi']] },
    ],
  },
}

function Dropdown({ item }) {
  const sec = SECTION_BY_SLUG[item.slug]
  const extra = EXTRA[item.slug]
  const top = sec ? bySection(item.slug).slice(0, 2) : []
  return (
    <div className="anim-fade absolute left-1/2 top-full z-50 w-[min(760px,92vw)] -translate-x-1/2 border border-rule bg-paper p-6 text-left shadow-pop">
      <div className="grid grid-cols-3 gap-8">
        {sec && (
          <div>
            <div className="kicker mb-3 text-muted">Chuyên mục</div>
            <ul className="space-y-2 font-sans text-[14px]">
              <li><Link to={item.to} className="font-semibold hover:underline">Tất cả {sec.name}</Link></li>
              {sec.subs.map((s) => (
                <li key={s}><Link to={`${item.to}?muc=${encodeURIComponent(s)}`} className="hover:underline">{s}</Link></li>
              ))}
            </ul>
          </div>
        )}
        {sec && (
          <div className="col-span-1">
            <div className="kicker mb-3 text-muted">Nổi bật</div>
            <ul className="space-y-4">
              {top.map((a) => (
                <li key={a.slug}><Link to={`/bai/${a.slug}`} className="hl block text-[15px] leading-snug hover:text-ink-2">{a.title}</Link></li>
              ))}
            </ul>
          </div>
        )}
        {extra?.cols.map((c) => (
          <div key={c.title}>
            <div className="kicker mb-3 text-muted">{c.title}</div>
            <ul className="space-y-2 font-sans text-[14px]">
              {c.links.map(([l, to]) => <li key={l}><Link to={to} className="hover:underline">{l}</Link></li>)}
            </ul>
          </div>
        ))}
        <div className="border-l border-rule pl-6">
          <div className="kicker mb-3 text-muted">Bản tin</div>
          <div className="flex gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded bg-son-soft text-son"><Mail size={18} /></span>
            <div>
              <div className="font-serif text-[15px] font-bold">Sáng Nay</div>
              <p className="mt-1 font-sans text-[12px] leading-snug text-muted">Những tin cần biết, gửi vào hộp thư lúc 6 giờ sáng mỗi ngày.</p>
              <Link to="/ban-tin" className="mt-2 inline-block font-sans text-[12px] font-semibold underline">Đăng ký</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function NavBar({ className }) {
  const [open, setOpen] = useState(null)
  const timer = useRef()
  const enter = (slug) => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(slug), 140) }
  const leave = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(null), 120) }
  return (
    <nav aria-label="Chuyên mục" className={cn('relative', className)} onMouseLeave={leave}>
      <ul className="no-scrollbar flex items-center gap-1 overflow-x-auto py-2 font-sans text-[14px] lg:justify-center lg:overflow-visible">
        {MAIN_NAV.map((item) => (
          <li key={item.slug} className="shrink-0"onMouseEnter={() => enter(item.slug)}>
            <NavLink
              to={item.to}
              onClick={() => setOpen(null)}
              className={({ isActive }) => cn('flex items-center gap-1 rounded px-2.5 py-1.5 hover:bg-paper-2', isActive && 'font-semibold underline decoration-2 underline-offset-[6px]')}
            >
              {item.label}
              <ChevronDown size={13} className="hidden text-muted lg:block" />
            </NavLink>
            {open === item.slug && <div className="hidden lg:block"><Dropdown item={item} /></div>}
          </li>
        ))}
      </ul>
    </nav>
  )
}
