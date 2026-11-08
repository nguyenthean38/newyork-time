/* Trang chuyên mục: tiêu đề lớn, chuyên mục con, bài nổi bật, dòng bài mới nhất */
import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Story, StoryRow } from '@/components/story/Story'
import { Avatar, useTitle } from '@/components/ui'
import { bySection, ARTICLES } from '@/data'
import { AUTHORS } from '@/data/authors'
import { SECTION_BY_SLUG } from '@/data/sections'
import { cn } from '@/lib/cn'
import NotFoundPage from './NotFoundPage'

function Columnists() {
  const list = AUTHORS.filter((a) => a.columnist)
  return (
    <div className="mb-10 grid gap-4 sm:grid-cols-3">
      {list.map((a) => (
        <Link key={a.slug} to={`/tac-gia/${a.slug}`} className="flex items-center gap-3 border-t border-rule pt-3 hover:opacity-80">
          <Avatar name={a.name} tone={a.tone} size={52} />
          <div className="font-sans">
            <div className="text-[15px] font-bold">{a.name}</div>
            <div className="text-[12px] text-muted">{a.role}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function SectionPage() {
  const { slug } = useParams()
  const [params, setParams] = useSearchParams()
  const sub = params.get('muc')
  const sec = SECTION_BY_SLUG[slug]
  const [limit, setLimit] = useState(8)
  useTitle(sec ? (sub ? `${sub} — ${sec.name}` : sec.name) : 'Không tìm thấy')
  if (!sec) return <NotFoundPage />

  const all = bySection(slug)
  const list = sub ? all.filter((a) => a.sub === sub) : all
  const [lead, s1, s2, ...rest] = list
  const fallback = ARTICLES.filter((a) => a.section !== slug).slice(0, 4)

  return (
    <div className="wrap pt-8">
      <header className="border-b border-ink pb-3">
        <h1 className="font-serif text-[40px] font-bold leading-none tracking-tight sm:text-[52px]">{sub || sec.name}</h1>
        <p className="mt-2 max-w-2xl font-sans text-[14px] text-muted">{sub ? `Thuộc chuyên mục ${sec.name}.` : sec.blurb}</p>
        <nav aria-label="Chuyên mục con" className="no-scrollbar -mx-1 mt-4 flex gap-1 overflow-x-auto font-sans text-[13px]">
          <button onClick={() => setParams({})} className={cn('shrink-0 rounded-full px-3 py-1.5', !sub ? 'bg-ink text-paper' : 'hover:bg-paper-2')}>Tất cả</button>
          {sec.subs.map((s) => (
            <button key={s} onClick={() => setParams({ muc: s })} className={cn('shrink-0 rounded-full px-3 py-1.5', sub === s ? 'bg-ink text-paper' : 'hover:bg-paper-2')}>{s}</button>
          ))}
        </nav>
      </header>

      <div className="mt-6">
        {slug === 'y-kien' && !sub && <Columnists />}

        {!lead && (
          <div className="py-16 text-center">
            <p className="font-serif text-[22px]">Chưa có bài trong mục “{sub}”.</p>
            <button onClick={() => setParams({})} className="btn btn-line mt-4">Xem tất cả {sec.name}</button>
            <div className="mt-12 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
              {fallback.map((a) => <Story key={a.slug} a={a} size="sm" img="top" />)}
            </div>
          </div>
        )}

        {lead && (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:divide-x lg:divide-rule">
            <Story a={lead} size="xl" img="top" ratio="16/9" dek credit byline priority />
            <div className="space-y-6 lg:pl-8">
              {s1 && <Story a={s1} size="md" img="top" dek />}
              {s2 && <div className="border-t border-rule pt-5"><Story a={s2} size="sm" dek /></div>}
            </div>
          </div>
        )}

        {rest.length > 0 && (
          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
            <section>
              <div className="border-t border-ink pt-2 font-sans text-[15px] font-bold">Mới nhất</div>
              {rest.slice(0, limit).map((a) => <StoryRow key={a.slug} a={a} />)}
              {rest.length > limit && (
                <button onClick={() => setLimit(limit + 8)} className="btn btn-line mt-6 w-full">Xem thêm</button>
              )}
            </section>
            <aside className="hidden lg:block">
              <div className="sticky top-20 rounded bg-paper-2 p-5">
                <div className="kicker text-son">Bản tin</div>
                <div className="mt-1 font-serif text-[19px] font-bold leading-tight">{sec.name} trong hộp thư của bạn</div>
                <p className="mt-2 font-sans text-[13px] text-muted">Tuyển chọn những bài hay nhất mỗi tuần.</p>
                <Link to="/ban-tin" className="btn btn-ink btn-sm mt-3">Đăng ký</Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
