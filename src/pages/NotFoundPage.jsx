/* Trang 404 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TRENDING } from '@/data'
import { useTitle } from '@/components/ui'

export default function NotFoundPage() {
  useTitle('Không tìm thấy trang')
  const [q, setQ] = useState('')
  const nav = useNavigate()
  return (
    <div className="wrap max-w-[760px] py-16 text-center">
      <div className="font-mast text-[88px] font-black leading-none sm:text-[120px]">4<span className="text-son">0</span>4</div>
      <h1 className="mt-4 font-serif text-[28px] font-bold">Trang này đã lên khuôn nhầm.</h1>
      <p className="mx-auto mt-2 max-w-md font-serif text-[18px] text-ink-2">
        Đường dẫn có thể đã thay đổi hoặc bài viết không còn. Hãy thử tìm kiếm, hoặc đọc vài bài đang được quan tâm.
      </p>
      <form
        onSubmit={(e) => { e.preventDefault(); nav(`/tim-kiem?q=${encodeURIComponent(q.trim())}`) }}
        className="mx-auto mt-6 flex max-w-md gap-2"
      >
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm trên Tân Thời" aria-label="Tìm kiếm" className="field-input" />
        <button className="btn btn-ink">Tìm</button>
      </form>
      <div className="mt-12 border-t border-ink pt-3 text-left">
        <div className="kicker mb-3">Đang được đọc nhiều</div>
        <ol className="grid gap-x-8 sm:grid-cols-2">
          {TRENDING.slice(0, 6).map((a, i) => (
            <li key={a.slug} className="flex gap-3 border-b border-rule py-3">
              <span className="font-serif text-[22px] font-bold leading-none text-faint">{i + 1}</span>
              <Link to={`/bai/${a.slug}`} className="hl text-[16px] leading-snug hover:text-ink-2">{a.title}</Link>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap justify-center gap-2 font-sans text-[13px]">
          <Link to="/" className="btn btn-line btn-sm">Trang nhất</Link>
          <Link to="/tro-choi" className="btn btn-line btn-sm">Trò chơi</Link>
          <Link to="/nghe" className="btn btn-line btn-sm">Nghe</Link>
          <Link to="/ban-tin" className="btn btn-line btn-sm">Bản tin</Link>
        </div>
      </div>
    </div>
  )
}
