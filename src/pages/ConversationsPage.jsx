/* Thảo luận: các bài đang được bàn luận và bình luận nổi bật của bạn đọc */
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, ThumbsUp, BadgeCheck } from 'lucide-react'
import { ARTICLES } from '@/data'
import { commentsFor } from '@/data/comments'
import { Avatar, useTitle } from '@/components/ui'
import { bylineText } from '@/components/story/Story'
import { timeAgo } from '@/lib/format'
import { cn } from '@/lib/cn'

const TABS = [['moi', 'Mới nhất'], ['y-kien', 'Ý kiến']]

function Comment({ c }) {
  return (
    <div className="flex gap-3">
      <Avatar name={c.name} tone={c.tone} size={32} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 font-sans text-[13px]">
          <b>{c.name}</b>
          {c.staff && <span className="flex items-center gap-0.5 text-[11px] font-semibold text-link"><BadgeCheck size={13} /> {c.role}</span>}
          <span className="text-[12px] text-muted">{c.place} · {timeAgo(c.hoursAgo)}</span>
        </div>
        <p className="mt-1 font-serif text-[15px] leading-snug text-ink-2">{c.text}</p>
        <div className="mt-1.5 flex items-center gap-1 font-sans text-[12px] text-muted"><ThumbsUp size={12} /> {c.likes.toLocaleString('vi-VN')} lượt thích</div>
      </div>
    </div>
  )
}

export default function ConversationsPage() {
  useTitle('Thảo luận')
  const [tab, setTab] = useState('moi')
  const list = useMemo(() => {
    const src = tab === 'y-kien' ? ARTICLES.filter((a) => a.type === 'opinion') : ARTICLES.filter((a) => a.comments > 30)
    return src.slice(0, 10).map((a) => {
      const cs = commentsFor(a, 10)
      const top = [...cs].sort((x, y) => (y.staff ? 1e6 : y.likes) - (x.staff ? 1e6 : x.likes)).slice(0, 3)
      return { a, top }
    })
  }, [tab])

  return (
    <div className="wrap max-w-[1100px] py-10">
      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <h1 className="font-serif text-[30px] font-bold leading-tight">Tham gia thảo luận</h1>
          <p className="mt-2 font-serif text-[17px] text-ink-2">Bạn đọc và phóng viên của chúng tôi đang nói gì về tin tức hôm nay.</p>
          <div role="tablist" className="mt-5 flex gap-2">
            {TABS.map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cn('btn btn-sm btn-pill', tab === k ? 'btn-ink' : 'btn-line')}>{l}</button>
            ))}
          </div>
          <div className="mt-8 hidden space-y-3 border-t border-rule pt-4 font-sans text-[12px] leading-relaxed text-muted lg:block">
            <p>Mỗi bình luận đều được biên tập viên duyệt trước khi hiển thị. Chúng tôi chọn "Bạn đọc chọn" là những bình luận thể hiện nhiều góc nhìn.</p>
            <p>Hãy tôn trọng người khác, giữ đúng chủ đề và không đăng thông tin cá nhân.</p>
            <p className="text-faint">Bình luận ở trang này là nội dung minh hoạ.</p>
          </div>
        </aside>

        <div>
          {list.map(({ a, top }) => (
            <article key={a.slug} className="border-t border-ink pb-8 pt-4">
              <div className={cn('kicker mb-1', a.type === 'opinion' && 'text-son')}>{a.type === 'opinion' ? `Ý kiến · ${bylineText(a)}` : a.kicker || a.sub}</div>
              <Link to={`/bai/${a.slug}`} className={cn('block text-[22px] leading-tight hover:text-ink-2', a.type === 'opinion' ? 'hl-light' : 'hl')}>{a.title}</Link>
              <p className="dek mt-1.5 text-[15px]">{a.dek}</p>
              <div className="mt-5 space-y-5 border-l-2 border-rule pl-4 sm:pl-5">
                {top.map((c) => <Comment key={c.id} c={c} />)}
              </div>
              <Link to={`/bai/${a.slug}#binh-luan`} className="mt-5 inline-flex items-center gap-1.5 font-sans text-[13px] font-semibold underline underline-offset-2">
                <MessageSquare size={14} /> Xem {a.comments.toLocaleString('vi-VN')} bình luận
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
