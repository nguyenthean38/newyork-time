/* Bản tin email: lọc theo chủ đề, nhóm nổi bật, đăng ký / huỷ bằng một nút */
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Check, SlidersHorizontal, X } from 'lucide-react'
import { NEWSLETTERS, NEWSLETTER_TOPICS } from '@/data/newsletters'
import { useUser, useCurrentUser, toast } from '@/store'
import { Checkbox, useTitle } from '@/components/ui'
import { cn } from '@/lib/cn'

export function NewsletterArt({ n, size = 64 }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-[3px] font-serif font-bold" style={{ width: size, height: size, background: n.art[0], color: n.art[1], fontSize: size * 0.42 }} aria-hidden>
      {n.glyph}
    </span>
  )
}

function Card({ n, on, onToggle }) {
  return (
    <article className="flex flex-col border-t border-rule pt-4">
      <div className="flex items-start justify-between gap-3">
        <NewsletterArt n={n} />
        <button
          onClick={onToggle}
          aria-pressed={on}
          aria-label={on ? `Huỷ đăng ký ${n.name}` : `Đăng ký ${n.name}`}
          className={cn('flex size-8 items-center justify-center rounded-full border transition-colors', on ? 'border-ink bg-ink text-paper' : 'border-rule-2 hover:border-ink')}
        >
          {on ? <Check size={16} /> : <Plus size={16} />}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="meta">{n.freq}</span>
        {n.subscriberOnly && <span className="rounded-sm bg-son-soft px-1.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide text-son">Cho người đăng ký</span>}
      </div>
      <h3 className="mt-1 font-serif text-[19px] font-bold">{n.name}</h3>
      <p className="mt-1 font-sans text-[13px] leading-snug text-ink-2">{n.desc}</p>
      <button onClick={() => toast(`Bản xem trước "${n.name}" sẽ có trong bản chính thức.`)} className="mt-2 self-start font-sans text-[12px] underline underline-offset-2">Xem số mới nhất</button>
    </article>
  )
}

export default function NewslettersPage() {
  useTitle('Bản tin email')
  const user = useCurrentUser()
  const toggle = useUser((s) => s.toggleNewsletter)
  const nav = useNavigate()
  const [topics, setTopics] = useState([])
  const [panel, setPanel] = useState(false)

  const subscribed = user?.newsletters || []
  const isSub = user?.subscription && user.subscription.status !== 'canceled'

  const onToggle = (n) => {
    if (!user) {
      nav('/dang-nhap?next=/ban-tin')
      return
    }
    if (n.subscriberOnly && !isSub && !subscribed.includes(n.id)) {
      toast(`"${n.name}" dành cho người đăng ký gói đọc.`, { tone: 'error' })
      return
    }
    const on = toggle(n.id)
    toast(on ? `Đã đăng ký "${n.name}".` : `Đã huỷ "${n.name}".`)
  }

  const list = useMemo(() => {
    if (!topics.length) return NEWSLETTERS
    return NEWSLETTERS.filter((n) =>
      topics.some((t) => (t === 'Nổi bật' ? n.featured : t === 'Chỉ dành cho người đăng ký' ? n.subscriberOnly : n.topic === t)),
    )
  }, [topics])
  const groups = topics.length ? [['Kết quả', list]] : [['Nổi bật', NEWSLETTERS.filter((n) => n.featured)], ...NEWSLETTER_TOPICS.slice(1, 6).map((t) => [t, NEWSLETTERS.filter((n) => n.topic === t)])]

  return (
    <div className="wrap max-w-[1100px] py-10">
      <header className="max-w-2xl">
        <h1 className="font-serif text-[34px] font-bold leading-tight sm:text-[40px]">Bản tin email</h1>
        <p className="mt-2 font-serif text-[19px] text-ink-2">Những gì hay nhất của Tân Thời, gửi thẳng vào hộp thư của bạn.</p>
        <p className="mt-3 font-sans text-[13px] text-muted">
          {user ? (
            <>Bạn đang đăng nhập với <b className="text-ink">{user.email}</b>. Đang nhận {subscribed.length} bản tin · <Link to="/tai-khoan/email" className="underline">Quản lý đăng ký</Link></>
          ) : (
            <><Link to="/dang-nhap?next=/ban-tin" className="font-semibold text-ink underline">Đăng nhập</Link> hoặc tạo tài khoản miễn phí để nhận bản tin.</>
          )}
        </p>
      </header>

      <div className="relative mt-8 flex items-center gap-3">
        <button onClick={() => setPanel((v) => !v)} className={cn('btn btn-sm', topics.length ? 'btn-ink' : 'btn-line')}>
          <SlidersHorizontal size={14} /> Lọc theo chủ đề{topics.length ? ` (${topics.length})` : ''}
        </button>
        {topics.length > 0 && (
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {topics.map((t) => (
              <button key={t} onClick={() => setTopics(topics.filter((x) => x !== t))} className="flex shrink-0 items-center gap-1 rounded-full bg-paper-3 px-3 py-1 font-sans text-[12px]">
                {t} <X size={12} />
              </button>
            ))}
          </div>
        )}
        {panel && (
          <div className="anim-pop absolute left-0 top-full z-20 mt-2 w-[min(520px,calc(100vw-32px))] rounded border border-rule bg-paper p-4 shadow-pop">
            <div className="mb-3 flex items-center justify-between font-sans text-[13px]">
              <button onClick={() => setTopics([])} className="underline">Xoá bộ lọc</button>
              <button onClick={() => setPanel(false)} className="font-semibold">Xong</button>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {NEWSLETTER_TOPICS.map((t) => (
                <Checkbox key={t} checked={topics.includes(t)} onChange={(v) => setTopics(v ? [...topics, t] : topics.filter((x) => x !== t))}>{t}</Checkbox>
              ))}
            </div>
          </div>
        )}
      </div>

      {groups.map(([title, items]) => items.length > 0 && (
        <section key={title} className="mt-10">
          <h2 className="mb-4 font-sans text-[13px] font-bold uppercase tracking-[0.08em]">{title}</h2>
          <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((n) => <Card key={n.id} n={n} on={subscribed.includes(n.id)} onToggle={() => onToggle(n)} />)}
          </div>
        </section>
      ))}
      {topics.length > 0 && !list.length && <p className="mt-10 font-sans text-muted">Không có bản tin nào khớp bộ lọc.</p>}
    </div>
  )
}
