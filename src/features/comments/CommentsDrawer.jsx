/* Ngăn bình luận bên phải bài viết */
import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X, Search, ThumbsUp, Flag, Link2, MoreHorizontal, BadgeCheck, MessageSquare } from 'lucide-react'
import { Drawer, Avatar, Radio, Checkbox, useClickAway } from '@/components/ui'
import { useUI, useComments, useCurrentUser, toast } from '@/store'
import { commentsFor } from '@/data/comments'
import { getArticle } from '@/data'
import { timeAgo, unaccent } from '@/lib/format'
import { cn } from '@/lib/cn'

const REPORT_REASONS = ['Xúc phạm, công kích cá nhân', 'Lạc đề', 'Lộ thông tin cá nhân', 'Quảng cáo, spam', 'Lý do khác']
const MAX = 1500

/** Tổng số bình luận hiển thị cho một bài (mẫu + của người xem). */
export function useCommentCount(a) {
  const mine = useComments((s) => s.mine[a.slug]?.length || 0)
  return a.comments + mine
}

function ReportMenu({ id, onClose }) {
  const report = useComments((s) => s.report)
  const [reason, setReason] = useState('')
  const ref = useClickAway(onClose)
  return (
    <div ref={ref} className="anim-pop absolute right-0 top-7 z-10 w-64 rounded border border-rule bg-paper p-4 shadow-pop">
      <div className="mb-3 font-sans text-[13px] font-bold">Báo cáo bình luận vi phạm</div>
      <div className="space-y-2.5">
        {REPORT_REASONS.map((r) => <Radio key={r} name={`rp-${id}`} checked={reason === r} onChange={() => setReason(r)}><span className="text-[13px]">{r}</span></Radio>)}
      </div>
      <button
        disabled={!reason}
        onClick={() => { report(id, reason); onClose(); toast('Cảm ơn bạn. Ban biên tập sẽ xem xét bình luận này.') }}
        className="btn btn-ink btn-sm mt-4 w-full"
      >
        Gửi báo cáo
      </button>
    </div>
  )
}

function CommentItem({ c, slug, onReply, depth = 0 }) {
  const liked = useComments((s) => Boolean(s.liked[c.id]))
  const reported = useComments((s) => s.reported[c.id])
  const toggleLike = useComments((s) => s.toggleLike)
  const [menu, setMenu] = useState(false)
  const [report, setReport] = useState(false)
  const menuRef = useClickAway(() => setMenu(false))
  const copy = () => {
    navigator.clipboard?.writeText(`${location.origin}/bai/${slug}#${c.id}`)
    toast('Đã sao chép liên kết bình luận.')
    setMenu(false)
  }
  return (
    <div id={c.id} className={cn('py-4', depth === 0 && 'border-b border-rule', depth > 0 && 'ml-6 border-l-2 border-rule pl-4 pt-3 pb-1')}>
      <div className="flex items-start gap-2.5">
        <Avatar name={c.name} tone={c.tone} size={32} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 font-sans text-[13px] font-bold">
            {c.name}
            {c.staff && <BadgeCheck size={15} className="text-link" aria-label="Phóng viên" />}
          </div>
          <div className="font-sans text-[11px] text-muted">
            {c.staff ? c.role : c.place} · {c.pending ? 'Đang chờ duyệt' : timeAgo(c.hoursAgo)}
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenu(!menu)} aria-label="Tuỳ chọn" className="rounded p-1 text-muted hover:bg-paper-2"><MoreHorizontal size={16} /></button>
          {menu && (
            <div className="anim-pop absolute right-0 top-7 z-10 w-48 rounded border border-rule bg-paper py-1 font-sans text-[13px] shadow-pop">
              <button onClick={copy} className="flex w-full items-center gap-2 px-3 py-2 hover:bg-paper-2"><Link2 size={14} /> Sao chép liên kết</button>
              {!c.mine && <button onClick={() => { setMenu(false); setReport(true) }} className="flex w-full items-center gap-2 px-3 py-2 hover:bg-paper-2"><Flag size={14} /> Báo cáo vi phạm</button>}
            </div>
          )}
          {report && <ReportMenu id={c.id} onClose={() => setReport(false)} />}
        </div>
      </div>
      {c.pending && <div className="mt-2 rounded bg-highlight px-2.5 py-1.5 font-sans text-[12px]">Bình luận của bạn đang chờ ban biên tập duyệt. Chỉ bạn nhìn thấy nó lúc này.</div>}
      {reported ? (
        <p className="mt-2 font-sans text-[13px] italic text-muted">Bạn đã báo cáo bình luận này.</p>
      ) : (
        <p className="mt-2 font-serif text-[15px] leading-relaxed">
          {c.replyTo && <span className="font-sans text-[13px] font-semibold text-link">@{c.replyTo} </span>}
          {c.text}
        </p>
      )}
      <div className="mt-2 flex items-center gap-4 font-sans text-[12px] text-muted">
        <button onClick={() => toggleLike(c.id)} className={cn('flex items-center gap-1 hover:text-ink', liked && 'font-semibold text-ink')}>
          <ThumbsUp size={13} fill={liked ? 'currentColor' : 'none'} /> {c.likes + (liked ? 1 : 0)} Thích
        </button>
        {depth === 0 && !c.pending && <button onClick={() => onReply(c)} className="hover:text-ink">Trả lời</button>}
      </div>
      {c.replies?.map((r) => <CommentItem key={r.id} c={r} slug={slug} depth={depth + 1} onReply={onReply} />)}
    </div>
  )
}

function Composer({ slug, replyTo, onDone }) {
  const user = useCurrentUser()
  const add = useComments((s) => s.add)
  const { pathname } = useLocation()
  const [text, setText] = useState('')
  const [notify, setNotify] = useState(true)
  const [focus, setFocus] = useState(Boolean(replyTo))
  if (!user) {
    return (
      <div className="rounded border border-rule bg-paper-2 p-4 font-sans text-[13px]">
        <p className="mb-3">Đăng nhập để chia sẻ suy nghĩ của bạn với cộng đồng bạn đọc.</p>
        <Link to={`/dang-nhap?next=${encodeURIComponent(pathname)}`} className="btn btn-ink btn-sm">Đăng nhập để bình luận</Link>
      </div>
    )
  }
  const name = [user.lastName, user.firstName].filter(Boolean).join(' ') || user.username || user.email.split('@')[0]
  const submit = () => {
    if (!text.trim()) return
    add(slug, {
      id: `me-${Date.now()}`, name, place: user.places?.[0]?.split(',')[0] || 'Việt Nam', tone: user.icon?.color,
      text: text.trim(), hoursAgo: 0, likes: 0, pending: true, mine: true, replyTo: replyTo?.name, replies: [],
    })
    setText('')
    setFocus(false)
    onDone?.()
    toast(notify ? 'Đã gửi. Chúng tôi sẽ báo qua email khi bình luận được duyệt.' : 'Đã gửi bình luận, đang chờ duyệt.')
  }
  return (
    <div className="rounded border border-rule p-3">
      {replyTo && <div className="mb-2 font-sans text-[12px] text-muted">Trả lời <b className="text-ink">{replyTo.name}</b> · <button onClick={onDone} className="underline">Huỷ</button></div>}
      <div className="mb-2 flex items-center gap-2 font-sans text-[13px]">
        <Avatar icon={user.icon} size={26} /> <b>{name}</b>
      </div>
      <textarea
        value={text}
        onFocus={() => setFocus(true)}
        onChange={(e) => setText(e.target.value.slice(0, MAX))}
        placeholder="Chia sẻ suy nghĩ của bạn…"
        rows={focus ? 5 : 2}
        className="w-full resize-none rounded border border-rule-2 bg-paper p-2.5 font-serif text-[15px] focus:border-ink focus:outline-none"
      />
      {focus && (
        <div className="mt-2 space-y-3">
          <div className="flex items-center justify-between font-sans text-[11px] text-muted">
            <Checkbox checked={notify} onChange={setNotify}><span className="text-[12px]">Báo qua email khi bình luận được duyệt hoặc có người trả lời</span></Checkbox>
            <span className="shrink-0 pl-2">{text.length}/{MAX}</span>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setFocus(false); setText(''); onDone?.() }} className="btn btn-line btn-sm">Huỷ</button>
            <button onClick={submit} disabled={!text.trim()} className="btn btn-ink btn-sm">Gửi</button>
          </div>
        </div>
      )}
    </div>
  )
}

export function CommentsDrawer() {
  const slug = useUI((s) => s.commentsFor)
  const open = useUI((s) => s.openComments)
  const a = slug ? getArticle(slug) : null
  return (
    <Drawer open={Boolean(a)} onClose={() => open(null)} side="right" label="Bình luận" className="w-[min(480px,100vw)]">
      {a && <CommentsPanel a={a} onClose={() => open(null)} />}
    </Drawer>
  )
}

function CommentsPanel({ a, onClose }) {
  const seed = useMemo(() => commentsFor(a), [a])
  const mine = useComments((s) => s.mine[a.slug]) || []
  const [tab, setTab] = useState('pick')
  const [sort, setSort] = useState('new')
  const [q, setQ] = useState('')
  const [searching, setSearching] = useState(false)
  const [replyTo, setReplyTo] = useState(null)
  const total = a.comments + mine.length

  const list = useMemo(() => {
    let l = [...mine, ...seed]
    if (tab === 'pick') l = l.filter((c) => c.pick || c.mine)
    if (tab === 'staff') l = l.filter((c) => c.staff || c.replies?.some((r) => r.staff))
    if (q.trim()) {
      const t = unaccent(q.toLowerCase())
      l = l.filter((c) => unaccent(`${c.name} ${c.text}`.toLowerCase()).includes(t))
    }
    if (tab === 'all') {
      if (sort === 'new') l.sort((x, y) => x.hoursAgo - y.hoursAgo)
      if (sort === 'old') l.sort((x, y) => y.hoursAgo - x.hoursAgo)
      if (sort === 'top') l.sort((x, y) => y.likes - x.likes)
    }
    return l
  }, [mine, seed, tab, sort, q])

  return (
    <>
      <div className="flex items-start justify-between gap-3 border-b border-rule px-5 py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 font-sans text-[12px] font-bold uppercase tracking-[0.08em] text-muted"><MessageSquare size={14} /> Thảo luận</div>
          <h2 className="mt-1 font-sans text-[15px] leading-snug"><b>{total} bình luận</b> về <span className="font-serif">{a.title}</span></h2>
        </div>
        <button onClick={onClose} aria-label="Đóng bình luận" className="shrink-0 rounded p-1.5 hover:bg-paper-2"><X size={20} /></button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-10">
        <div className="pt-4"><Composer key={replyTo?.id || 'root'} slug={a.slug} replyTo={replyTo} onDone={() => setReplyTo(null)} /></div>

        <div className="sticky top-0 z-[1] mt-4 bg-paper pb-2 pt-2">
          {searching ? (
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm trong bình luận" className="field-input h-9 pl-8 text-[13px]" />
              </div>
              <button onClick={() => { setSearching(false); setQ('') }} className="font-sans text-[13px] underline">Huỷ</button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex gap-1 font-sans text-[13px]">
                {[['pick', 'Bạn đọc chọn'], ['staff', 'Từ phóng viên'], ['all', 'Tất cả']].map(([k, l]) => (
                  <button key={k} onClick={() => setTab(k)} className={cn('rounded-full px-3 py-1.5', tab === k ? 'bg-ink text-paper' : 'hover:bg-paper-2')}>{l}</button>
                ))}
              </div>
              <button onClick={() => setSearching(true)} aria-label="Tìm trong bình luận" className="rounded p-1.5 hover:bg-paper-2"><Search size={16} /></button>
            </div>
          )}
          {tab === 'all' && !searching && (
            <div className="mt-2 flex justify-end">
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded border border-rule bg-paper px-2 py-1 font-sans text-[12px]">
                <option value="new">Mới nhất</option>
                <option value="old">Cũ nhất</option>
                <option value="top">Nhiều lượt thích</option>
              </select>
            </div>
          )}
          {q && <div className="mt-2 font-sans text-[12px] text-muted">{list.length} kết quả cho “{q}”</div>}
        </div>

        <p className="mt-1 rounded bg-paper-2 p-3 font-sans text-[12px] leading-relaxed text-muted">
          Chào mừng bạn đến khu thảo luận. Mọi bình luận đều được ban biên tập duyệt trước khi hiển thị. Hãy tôn trọng người khác và bám sát chủ đề bài viết.
        </p>

        {tab === 'pick' && (
          <div className="mt-4 rounded border border-rule p-4 text-center">
            <div className="font-serif text-[16px] font-bold">Phóng viên đang trò chuyện cùng bạn đọc</div>
            <p className="mt-1 font-sans text-[12px] text-muted">Xem các câu trả lời từ toà soạn ở mục “Từ phóng viên”.</p>
            <button onClick={() => setTab('staff')} className="mt-2 font-sans text-[12px] font-semibold underline">Xem ngay</button>
          </div>
        )}

        <div className="mt-2">
          {list.length === 0 && <p className="py-8 text-center font-sans text-[13px] text-muted">Không có bình luận phù hợp.</p>}
          {list.map((c) => <CommentItem key={c.id} c={c} slug={a.slug} onReply={(x) => { setReplyTo(x); document.querySelector('[aria-label="Bình luận"] .overflow-y-auto')?.scrollTo({ top: 0, behavior: 'smooth' }) }} />)}
        </div>
      </div>
    </>
  )
}
