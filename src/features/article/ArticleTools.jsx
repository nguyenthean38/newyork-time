/* Thanh công cụ dưới sapo: Nghe · Tặng bài · Chia sẻ · Lưu · Bình luận · Cỡ chữ */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Play, Pause, Gift, Forward, Bookmark, MessageSquare, Link2, Mail, Share2, Type, RotateCcw, RotateCw, X, Check } from 'lucide-react'
import { Modal, useClickAway } from '@/components/ui'
import { useUI, useUser, useCurrentUser, toast } from '@/store'
import { useSpeech, articleText } from './useSpeech'
import { listenSeconds } from '@/data'
import { useCommentCount } from '@/features/comments/CommentsDrawer'
import { cn } from '@/lib/cn'

const pill = 'flex h-9 items-center gap-1.5 rounded-full border border-rule-2 px-3 font-sans text-[13px] hover:border-ink transition-colors'
const round = 'flex size-9 items-center justify-center rounded-full border border-rule-2 hover:border-ink transition-colors'

function fmt(sec) {
  const m = Math.floor(sec / 60)
  const s = String(sec % 60).padStart(2, '0')
  return `${m}:${s}`
}

/* ---------- Nghe bài ---------- */
function ListenButton({ a }) {
  const sp = useSpeech()
  const total = listenSeconds(a)
  if (!sp.supported) {
    return <span className="font-sans text-[13px] text-muted">Nghe · {fmt(total)} phút</span>
  }
  const active = sp.state !== 'idle'
  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={() => (sp.state === 'playing' ? sp.pause() : sp.play(articleText(a)))}
        aria-label={sp.state === 'playing' ? 'Tạm dừng' : 'Nghe bài viết'}
        className="flex size-9 items-center justify-center rounded-full border border-ink hover:bg-paper-2"
      >
        {sp.state === 'playing' ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" className="ml-0.5" />}
      </button>
      {!active ? (
        <span className="font-sans text-[13px]">Nghe · {fmt(total)} phút</span>
      ) : (
        <div className="flex items-center gap-2 font-sans text-[12px]">
          <button onClick={() => sp.skip(-1)} aria-label="Lùi lại" className="text-muted hover:text-ink"><RotateCcw size={15} /></button>
          <div className="h-1 w-20 overflow-hidden rounded bg-rule sm:w-28"><div className="h-full bg-ink transition-[width] duration-500" style={{ width: `${sp.progress * 100}%` }} /></div>
          <button onClick={() => sp.skip(1)} aria-label="Tiến tới" className="text-muted hover:text-ink"><RotateCw size={15} /></button>
          <button onClick={() => sp.changeRate(sp.rate >= 1.5 ? 0.75 : sp.rate + 0.25)} className="w-9 rounded border border-rule px-1 text-[11px] font-semibold">{sp.rate}x</button>
          <button onClick={sp.stop} aria-label="Dừng" className="text-muted hover:text-ink"><X size={15} /></button>
        </div>
      )}
    </div>
  )
}

/* ---------- Tặng bài viết ---------- */
function GiftModal({ a, open, onClose }) {
  const user = useCurrentUser()
  const subbed = user?.subscription && user.subscription.status !== 'canceled'
  const [copied, setCopied] = useState(false)
  const link = `${location.origin}/bai/${a.slug}?qua=${btoa(`${user?.accountNo || 'x'}-${a.slug.length}`).replace(/=/g, '')}`
  return (
    <Modal open={open} onClose={onClose} title="Tặng bài viết này">
      {subbed ? (
        <div className="font-sans text-[14px]">
          <p className="text-ink-2">Người nhận có thể đọc trọn bài mà không cần đăng ký. Bạn còn <b>9 lượt tặng</b> trong tháng này.</p>
          <div className="mt-4 flex gap-2">
            <input readOnly value={link} className="field-input h-10 flex-1 text-[12px]" onFocus={(e) => e.target.select()} />
            <button
              onClick={() => { navigator.clipboard?.writeText(link); setCopied(true); toast('Đã sao chép liên kết tặng.') }}
              className="btn btn-ink btn-sm h-10"
            >
              {copied ? <><Check size={14} /> Đã chép</> : 'Sao chép'}
            </button>
          </div>
        </div>
      ) : (
        <div className="font-sans text-[14px]">
          <p className="text-ink-2">Người đăng ký gói đọc có thể tặng 10 bài viết mỗi tháng cho bất kỳ ai — kể cả người chưa có tài khoản.</p>
          <Link to="/goi-doc" onClick={onClose} className="btn btn-son mt-4 w-full">Đăng ký để tặng bài — 9.000₫/tuần</Link>
          {!user && <Link to="/dang-nhap" onClick={onClose} className="mt-3 block text-center text-[13px] underline">Đã có gói? Đăng nhập</Link>}
        </div>
      )}
    </Modal>
  )
}

/* ---------- Chia sẻ ---------- */
function ShareMenu({ a, onClose }) {
  const ref = useClickAway(onClose)
  const url = `${location.origin}/bai/${a.slug}`
  const enc = encodeURIComponent
  const items = [
    [Link2, 'Sao chép liên kết', () => { navigator.clipboard?.writeText(url); toast('Đã sao chép liên kết.'); onClose() }],
    [Mail, 'Email', () => { window.location.href = `mailto:?subject=${enc(a.title)}&body=${enc(url)}` }],
    [Share2, 'Facebook', () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, '_blank', 'noopener')],
    [Share2, 'X', () => window.open(`https://x.com/intent/post?url=${enc(url)}&text=${enc(a.title)}`, '_blank', 'noopener')],
    [Share2, 'LinkedIn', () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, '_blank', 'noopener')],
  ]
  if (navigator.share) items.push([Forward, 'Ứng dụng khác…', () => navigator.share({ title: a.title, url }).catch(() => {})])
  return (
    <div ref={ref} className="anim-pop absolute right-0 top-11 z-20 w-56 rounded border border-rule bg-paper py-1.5 shadow-pop">
      <div className="px-4 pb-1.5 pt-1 font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-muted">Chia sẻ bài viết</div>
      {items.map(([I, l, fn]) => (
        <button key={l} onClick={fn} className="flex w-full items-center gap-3 px-4 py-2 font-sans text-[14px] hover:bg-paper-2"><I size={15} /> {l}</button>
      ))}
    </div>
  )
}

/* ---------- Cỡ chữ ---------- */
function TextSize({ onClose }) {
  const scale = useUI((s) => s.readerScale)
  const set = useUI((s) => s.setReaderScale)
  const ref = useClickAway(onClose)
  const opts = [[0.9, 'Nhỏ'], [1, 'Vừa'], [1.12, 'Lớn'], [1.25, 'Rất lớn']]
  return (
    <div ref={ref} className="anim-pop absolute right-0 top-11 z-20 w-60 rounded border border-rule bg-paper p-4 shadow-pop">
      <div className="mb-3 font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-muted">Cỡ chữ</div>
      <div className="grid grid-cols-4 gap-1">
        {opts.map(([v, l], i) => (
          <button key={v} onClick={() => set(v)} className={cn('flex flex-col items-center gap-1 rounded py-2 font-serif hover:bg-paper-2', scale === v && 'bg-paper-3 font-bold')}>
            <span style={{ fontSize: 14 + i * 3 }}>A</span>
            <span className="font-sans text-[10px]">{l}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function ArticleTools({ a }) {
  const user = useCurrentUser()
  const toggleSaved = useUser((s) => s.toggleSaved)
  const openComments = useUI((s) => s.openComments)
  const nav = useNavigate()
  const [gift, setGift] = useState(false)
  const [menu, setMenu] = useState(null) // 'share' | 'size'
  const saved = user?.saved.includes(a.slug)
  const count = useCommentCount(a)
  const save = () => {
    if (!user) {
      toast('Đăng nhập để lưu bài vào danh sách đọc.')
      nav(`/dang-nhap?next=/bai/${a.slug}`)
      return
    }
    const now = toggleSaved(a.slug)
    toast(now ? 'Đã lưu vào danh sách đọc.' : 'Đã bỏ khỏi danh sách đọc.')
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4">
      <ListenButton a={a} />
      <div className="relative flex items-center gap-2">
        <button onClick={() => setGift(true)} className={pill}><Gift size={16} /> <span className="hidden sm:inline">Tặng bài</span></button>
        <button onClick={() => setMenu(menu === 'share' ? null : 'share')} aria-label="Chia sẻ" className={round}><Forward size={16} /></button>
        <button onClick={save} aria-label={saved ? 'Bỏ lưu' : 'Lưu bài'} className={cn(round, saved && 'border-ink bg-ink text-paper')}>
          <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <button onClick={() => setMenu(menu === 'size' ? null : 'size')} aria-label="Cỡ chữ" className={round}><Type size={16} /></button>
        <button onClick={() => openComments(a.slug)} className={pill} aria-label={`${count} bình luận`}><MessageSquare size={16} /> {count}</button>
        {menu === 'share' && <ShareMenu a={a} onClose={() => setMenu(null)} />}
        {menu === 'size' && <TextSize onClose={() => setMenu(null)} />}
      </div>
      <GiftModal a={a} open={gift} onClose={() => setGift(false)} />
    </div>
  )
}
