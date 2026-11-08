/* Trang bài viết: tin thường, phóng sự, trực tiếp, công thức, điểm sách, ý kiến */
import { Fragment, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { MessageSquare, Star, Clock, Users, ChefHat, Sun, X, BookOpen, Radio as RadioIcon } from 'lucide-react'
import { Img, Avatar, Checkbox, Toggle, useTitle } from '@/components/ui'
import { Story, bylineText } from '@/components/story/Story'
import { getArticle, authorsOf, sectionOf, related, STORYLINES, TRENDING } from '@/data'
import { ArticleTools } from '@/features/article/ArticleTools'
import { CommentsDrawer, useCommentCount } from '@/features/comments/CommentsDrawer'
import { useUI, useCurrentUser, toast } from '@/store'
import { longDate, clock, timeAgo, hoursAgoDate } from '@/lib/format'
import { cn } from '@/lib/cn'
import NotFoundPage from './NotFoundPage'

const FEATURE_KICKERS = ['Phóng sự', 'Chân dung', 'Điều tra chuyên sâu', 'Khám phá', 'Phóng sự ảnh']

/* ---------- Thanh tiến độ đọc ---------- */
function ReadingProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const h = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setP(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    h()
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  return <div className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-son" style={{ transform: `scaleX(${p})` }} aria-hidden />
}

/* ---------- Dòng chuyện ---------- */
function StorylineNav({ a }) {
  const s = STORYLINES[a.storyline]
  if (!s) return null
  return (
    <div className="border-b border-rule">
      <div className="no-scrollbar mx-auto flex max-w-[1240px] items-center gap-5 overflow-x-auto px-4 py-3 font-sans text-[14px] md:px-6 lg:justify-center">
        <span className="shrink-0 font-bold">{s.name}</span>
        <span className="h-4 w-px shrink-0 bg-rule-2" />
        {s.links.map((l) => (
          <Link key={l.slug} to={`/bai/${l.slug}`} className={cn('shrink-0 hover:underline', l.slug === a.slug ? 'underline decoration-2 underline-offset-[6px]' : 'text-ink-2')}>{l.label}</Link>
        ))}
      </div>
    </div>
  )
}

/* ---------- Tác giả ---------- */
function Byline({ a }) {
  const au = authorsOf(a)
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {au.map((x) => <Link key={x.slug} to={`/tac-gia/${x.slug}`}><Avatar name={x.name} tone={x.tone} size={40} className="ring-2 ring-paper" /></Link>)}
      </div>
      <div className="font-sans text-[13px] leading-snug">
        <div>
          Bài: {au.map((x, i) => (
            <Fragment key={x.slug}>
              {i > 0 && (i === au.length - 1 ? ' và ' : ', ')}
              <Link to={`/tac-gia/${x.slug}`} className="font-bold hover:underline">{x.name}</Link>
            </Fragment>
          ))}
        </div>
        <div className="text-muted">{au[0]?.role} · {au[0]?.base}</div>
      </div>
    </div>
  )
}

function Dateline({ a }) {
  const d = a.date
  return (
    <div className="mt-4 font-sans text-[13px] text-muted">
      {longDate(d)}, {clock(d)}
      {a.hoursAgo < 24 && <> · Cập nhật {timeAgo(hoursAgoDate(a.hoursAgo * 0.4))}</>}
    </div>
  )
}

/* ---------- Thân bài ---------- */
function Body({ blocks }) {
  return (
    <div className="prose-news">
      {blocks.map((b, i) => {
        if (typeof b === 'string') return <p key={i}>{b}</p>
        if (b.h) return <h2 key={i}>{b.h}</h2>
        if (b.quote) return <blockquote key={i}>“{b.quote}”{b.by && <footer className="mt-2 font-sans text-[13px] not-italic text-muted">— {b.by}</footer>}</blockquote>
        if (b.list) return <ul key={i}>{b.list.map((x) => <li key={x}>{x}</li>)}</ul>
        if (b.img) return <div key={i} className="my-8 -mx-4 sm:mx-0"><Img k={b.img} ratio="3/2" caption={b.caption} credit creditLink className="[&_figcaption]:px-4 sm:[&_figcaption]:px-0" /></div>
        return null
      })}
    </div>
  )
}

/* ---------- Bài trực tiếp ---------- */
function LiveTimeline({ a }) {
  const [, tick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => tick((x) => x + 1), 30000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="mt-8">
      <div className="mb-6 border border-rule bg-paper-2 p-4">
        <div className="kicker mb-2 flex items-center gap-1.5 text-son"><RadioIcon size={13} /> Diễn biến chính</div>
        <ul className="list-disc space-y-1.5 pl-5 font-serif text-[16px] leading-snug">
          {a.updates.slice(0, 3).map((u) => <li key={u.title}>{u.title}.</li>)}
        </ul>
      </div>
      <ol className="relative border-l border-rule">
        {a.updates.map((u, i) => {
          const d = new Date(Date.now() - u.mins * 60000)
          return (
            <li key={u.title} className="relative border-t border-rule py-5 pl-5">
              <span className={cn('absolute -left-[5px] top-6 size-2.5 rounded-full', i === 0 ? 'live-dot bg-son' : 'bg-rule-2')} />
              <div className="font-sans text-[12px] font-semibold text-son">{u.mins < 60 ? `${u.mins} phút trước` : `${Math.floor(u.mins / 60)} giờ trước`} <span className="font-normal text-muted">· {clock(d)}</span></div>
              <h3 className="mt-1 font-serif text-[20px] font-bold leading-snug">{u.title}</h3>
              <p className="mt-2 font-serif text-[17px] leading-relaxed text-ink-2">{u.text}</p>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/* ---------- Công thức ---------- */
function Recipe({ a }) {
  const r = a.recipe
  const [done, setDone] = useState({})
  const [step, setStep] = useState(0)
  const [rated, setRated] = useState(0)
  const [hover, setHover] = useState(0)
  const [cookMode, setCookMode] = useState(false)
  useEffect(() => {
    if (!cookMode) return
    let lock
    navigator.wakeLock?.request('screen').then((l) => { lock = l }).catch(() => {})
    return () => { lock?.release?.() }
  }, [cookMode])
  const toggleCook = (v) => {
    setCookMode(v)
    if (v) toast(navigator.wakeLock ? 'Chế độ nấu: màn hình sẽ luôn sáng.' : 'Trình duyệt chưa hỗ trợ giữ màn hình sáng.')
  }
  return (
    <section className="mt-8">
      <div className="grid grid-cols-3 divide-x divide-rule border-y border-rule py-4 text-center font-sans">
        <div><Users size={18} className="mx-auto mb-1 text-muted" /><div className="text-[11px] uppercase tracking-[0.06em] text-muted">Khẩu phần</div><div className="text-[14px] font-semibold">{r.serves}</div></div>
        <div><Clock size={18} className="mx-auto mb-1 text-muted" /><div className="text-[11px] uppercase tracking-[0.06em] text-muted">Thời gian</div><div className="text-[14px] font-semibold">{r.time}</div></div>
        <div><ChefHat size={18} className="mx-auto mb-1 text-muted" /><div className="text-[11px] uppercase tracking-[0.06em] text-muted">Độ khó</div><div className="text-[14px] font-semibold">{r.level}</div></div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 font-sans text-[13px]">
        <div className="flex items-center gap-2">
          <div className="flex text-near">{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={16} fill={i <= Math.round(r.rating) ? 'currentColor' : 'none'} />)}</div>
          <span><b>{r.rating.toLocaleString('vi-VN')}</b> ({r.ratings.toLocaleString('vi-VN')} lượt đánh giá)</span>
        </div>
        <label className="flex items-center gap-2"><Sun size={15} className="text-muted" /> Chế độ nấu <Toggle checked={cookMode} onChange={toggleCook} label="Chế độ nấu" /></label>
      </div>
      <div className="mt-8 grid gap-10 md:grid-cols-[2fr_3fr]">
        <div>
          <h2 className="mb-3 font-sans text-[13px] font-bold uppercase tracking-[0.08em]">Nguyên liệu</h2>
          <ul className="space-y-2.5">
            {r.ingredients.map((x, i) => (
              <li key={x}><Checkbox checked={Boolean(done[i])} onChange={(v) => setDone({ ...done, [i]: v })}><span className={cn('font-serif text-[16px] text-ink', done[i] && 'text-muted line-through')}>{x}</span></Checkbox></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-sans text-[13px] font-bold uppercase tracking-[0.08em]">Cách làm</h2>
          <ol className="space-y-3">
            {r.steps.map((s, i) => (
              <li key={i}>
                <button onClick={() => setStep(i)} className={cn('w-full rounded p-3 text-left transition-colors', step === i ? 'bg-highlight' : 'hover:bg-paper-2')}>
                  <div className="font-sans text-[12px] font-bold">Bước {i + 1}</div>
                  <p className="mt-1 font-serif text-[16px] leading-relaxed">{s}</p>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="mt-8 rounded border border-rule p-5 text-center">
        <div className="font-serif text-[18px] font-bold">Bạn đã nấu món này chưa?</div>
        <div className="mt-2 flex justify-center gap-1 text-near" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} onMouseEnter={() => setHover(i)} onClick={() => { setRated(i); toast(`Cảm ơn bạn đã đánh giá ${i} sao!`) }} aria-label={`${i} sao`}>
              <Star size={28} fill={i <= (hover || rated) ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
        {rated > 0 && <p className="mt-2 font-sans text-[13px] text-muted">Bạn đã chấm {rated}/5 sao.</p>}
      </div>
    </section>
  )
}

/* ---------- Hộp thông tin sách ---------- */
function BookBox({ book }) {
  return (
    <aside className="my-8 flex gap-4 border-y border-rule py-4 font-sans">
      <div className="flex h-24 w-16 shrink-0 items-end rounded-sm bg-gradient-to-br from-[#2a6f6f] to-[#163b3b] p-1.5 text-[9px] font-bold leading-tight text-white shadow">{book.title}</div>
      <div className="text-[13px] leading-relaxed">
        <div className="flex items-center gap-1.5 font-bold"><BookOpen size={14} /> {book.title}</div>
        <div>Tác giả: {book.author}</div>
        <div className="text-muted">{book.publisher} · {book.pages} trang</div>
      </div>
    </aside>
  )
}

/* ---------- Thông điệp gói đọc dưới đáy ---------- */
function useMeter(slug) {
  const [n, setN] = useState(0)
  useEffect(() => {
    try {
      const key = `tt-meter-${new Date().getFullYear()}-${new Date().getMonth()}`
      const seen = new Set(JSON.parse(localStorage.getItem(key) || '[]'))
      seen.add(slug)
      localStorage.setItem(key, JSON.stringify([...seen]))
      setN(seen.size)
    } catch {
      setN(1)
    }
  }, [slug])
  return n
}

function BottomBanner({ a }) {
  const user = useCurrentUser()
  const dismissed = useUI((s) => s.dismissed)
  const dismiss = useUI((s) => s.dismiss)
  const [closed, setClosed] = useState(false)
  const n = useMeter(a.slug)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const h = () => window.scrollY > 700 && setShown(true)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  const subbed = user?.subscription && user.subscription.status !== 'canceled'
  if (closed || !shown) return null
  if (subbed) {
    if (dismissed.family) return null
    return (
      <div className="anim-fade fixed inset-x-0 bottom-0 z-30 border-t border-ink bg-paper shadow-pop">
        <button onClick={() => dismiss('family')} aria-label="Đóng" className="absolute right-3 top-3 p-1 text-muted hover:text-ink"><X size={18} /></button>
        <div className="wrap flex flex-col items-start gap-3 py-4 pr-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-sans">
            <div className="text-[15px] font-bold">Thêm ba người thân vào gói của bạn.</div>
            <div className="hidden text-[13px] text-muted sm:block">Mỗi người một đăng nhập riêng. Tiết kiệm cho cả nhà.</div>
          </div>
          <Link to="/goi-doc/gia-dinh" className="btn btn-ink">Chuyển sang gói Gia đình</Link>
        </div>
      </div>
    )
  }
  const left = Math.max(0, 5 - n)
  return (
    <div className="anim-fade fixed inset-x-0 bottom-0 z-30 border-t border-ink bg-paper shadow-pop">
      <button onClick={() => setClosed(true)} aria-label="Đóng" className="absolute right-3 top-3 p-1 text-muted hover:text-ink"><X size={18} /></button>
      <div className="wrap flex flex-col items-start gap-2.5 py-3 pr-10 sm:flex-row sm:items-center sm:justify-between sm:py-4">
        <div className="font-sans">
          <div className="text-[14px] font-bold sm:text-[15px]">{left > 0 ? `Bạn còn ${left} bài miễn phí trong tháng này.` : 'Bạn đã đọc hết số bài miễn phí tháng này.'}</div>
          <div className="hidden text-[13px] text-muted sm:block">Đọc không giới hạn, chơi mọi trò chơi và nghe podcast chỉ từ 9.000₫ mỗi tuần. <span className="italic">(Bản demo — không chặn nội dung.)</span></div>
        </div>
        <div className="flex shrink-0 gap-2">
          {!user && <Link to={`/dang-nhap?next=/bai/${a.slug}`} className="btn btn-line btn-sm">Đăng nhập</Link>}
          <Link to="/goi-doc" className="btn btn-son btn-sm">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  )
}

/* ---------- Trang ---------- */
export default function ArticlePage() {
  const { slug } = useParams()
  const { hash } = useLocation()
  const a = getArticle(slug)
  const openComments = useUI((s) => s.openComments)
  useTitle(a?.title)
  const more = useMemo(() => (a ? related(a, 4) : []), [a])
  const count = useCommentCount(a || { slug: '', comments: 0 })

  useEffect(() => {
    if (a && hash === '#binh-luan') openComments(a.slug)
    return () => openComments(null)
  }, [a, hash, openComments])

  if (!a) return <NotFoundPage />
  const sec = sectionOf(a)
  const opinion = a.type === 'opinion'
  const feature = FEATURE_KICKERS.includes(a.kicker)
  const au = authorsOf(a)

  return (
    <article>
      <ReadingProgress />
      <StorylineNav a={a} />

      <header className="mx-auto max-w-[760px] px-4 pt-8 sm:pt-12">
        <div className="mb-3 flex items-center gap-2 font-sans text-[12px] font-bold uppercase tracking-[0.08em]">
          {a.live ? (
            <span className="flex items-center gap-1.5 text-son"><span className="live-dot size-2 rounded-full bg-son" /> Trực tiếp · cập nhật {a.updates[0].mins} phút trước</span>
          ) : (
            <>
              <Link to={`/chuyen-muc/${sec.slug}`} className={cn('hover:underline', opinion && 'text-son')}>{opinion ? 'Ý kiến' : sec.name}</Link>
              {a.sub && !opinion && <><span className="text-faint">·</span><Link to={`/chuyen-muc/${sec.slug}?muc=${encodeURIComponent(a.sub)}`} className="text-muted hover:underline">{a.sub}</Link></>}
            </>
          )}
        </div>
        {opinion && (
          <Link to={`/tac-gia/${au[0].slug}`} className="mb-4 flex items-center gap-3">
            <Avatar name={au[0].name} tone={au[0].tone} size={52} />
            <div className="font-sans"><div className="text-[16px] font-bold">{au[0].name}</div><div className="text-[13px] text-muted">{au[0].role}</div></div>
          </Link>
        )}
        <h1 className={cn('text-[32px] leading-[1.1] sm:text-[44px]', opinion ? 'hl-light' : 'hl', feature && 'italic')}>{a.title}</h1>
        <p className="dek mt-4 text-[20px] sm:text-[23px]">{a.dek}</p>
        <div className="mt-6"><ArticleTools a={a} /></div>
      </header>

      <div className="mx-auto mt-8 max-w-[1080px] sm:px-6">
        <Img k={a.image} ratio="16/9" caption={a.caption} credit creditLink priority className="[&_figcaption]:px-4 sm:[&_figcaption]:px-0" />
      </div>

      <div className="wrap-article mt-8">
        {!opinion && <Byline a={a} />}
        <Dateline a={a} />
        {a.book && <BookBox book={a.book} />}
        <div className="mt-8"><Body blocks={a.body} /></div>
        {a.live && <LiveTimeline a={a} />}
        {a.recipe && <Recipe a={a} />}
        {opinion && (
          <p className="mt-6 border-t border-rule pt-4 font-sans text-[13px] italic text-muted">
            {au[0].name} là {au[0].role.toLowerCase()} của Tân Thời. {au[0].background} Bài viết thể hiện quan điểm riêng của tác giả.
          </p>
        )}

        {!opinion && (
          <div className="mt-10 space-y-4 border-t border-rule pt-5">
            {au.map((x) => (
              <Link key={x.slug} to={`/tac-gia/${x.slug}`} className="flex gap-3 font-sans text-[13px] leading-relaxed text-ink-2 hover:text-ink">
                <Avatar name={x.name} tone={x.tone} size={36} />
                <p><b className="text-ink">{x.name}</b> — {x.bio}</p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-2">
          {[...new Set([sec.name, a.sub, a.kicker].filter(Boolean))].map((t) => (
            <Link key={t} to={`/tim-kiem?q=${encodeURIComponent(t)}`} className="rounded-full border border-rule px-3 py-1 font-sans text-[12px] hover:border-ink">{t}</Link>
          ))}
        </div>

        <button id="binh-luan" onClick={() => openComments(a.slug)} className="btn btn-ink mt-8 w-full gap-2 py-3.5">
          <MessageSquare size={17} /> Đọc {count} bình luận
        </button>
      </div>

      <section className="wrap mt-16">
        <div className="mb-5 border-t border-ink pt-2 font-sans text-[15px] font-bold">Thêm trong {sec.name}</div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {more.map((x) => <Story key={x.slug} a={x} size="sm" img="top" />)}
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-4 border-t border-ink pt-2 font-sans text-[15px] font-bold">Đang được quan tâm</div>
            <ol className="space-y-4">
              {TRENDING.filter((x) => x.slug !== a.slug).slice(0, 5).map((x, i) => (
                <li key={x.slug} className="flex gap-3">
                  <span className="w-5 shrink-0 font-serif text-[22px] font-bold leading-none text-faint">{i + 1}</span>
                  <Link to={`/bai/${x.slug}`} className="hl text-[16px] leading-snug hover:text-ink-2">{x.title}</Link>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded bg-paper-2 p-6">
            <div className="kicker text-son">Bản tin</div>
            <div className="mt-1 font-serif text-[22px] font-bold leading-tight">Đọc tiếp {sec.name.toLowerCase()} mỗi tuần trong hộp thư</div>
            <p className="mt-2 font-sans text-[14px] text-muted">Ban biên tập chọn lọc những bài đáng đọc nhất. Huỷ bất cứ lúc nào.</p>
            <Link to="/ban-tin" className="btn btn-ink mt-4">Xem các bản tin</Link>
            <div className="mt-3 font-sans text-[12px] text-muted">{bylineText(a)} cũng viết cho bản tin “Sáng Nay”.</div>
          </div>
        </div>
      </section>

      <div className="h-24" />
      <BottomBanner a={a} />
      <CommentsDrawer />
    </article>
  )
}
