/* Một tập podcast: trình phát, bản ghi lời có đánh dấu dòng đang phát, các tập khác */
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Play, Pause, RotateCcw, RotateCw, FileText, X, Share2, Bookmark, Volume2, ChevronLeft, ChevronRight } from 'lucide-react'
import { EPISODE_BY_ID, EPISODES, SHOW_BY_ID, fmtDuration } from '@/data/media'
import { getArticle } from '@/data'
import { Img, Toggle, useTitle, useLockScroll } from '@/components/ui'
import { usePlayer, canSpeak } from '@/features/media/usePlayer'
import { toast } from '@/store'
import { timeAgo, shortDate, hoursAgoDate } from '@/lib/format'
import { cn } from '@/lib/cn'
import NotFoundPage from '../NotFoundPage'

function Transcript({ p, ep, onClose }) {
  const box = useRef(null)
  useLockScroll(true)
  useEffect(() => {
    const el = box.current?.querySelector('[data-active="true"]')
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [p.current])
  return (
    <div className="fixed inset-0 z-[75] flex justify-center bg-black/50" role="dialog" aria-label="Bản ghi lời">
      <div className="anim-pop relative flex h-full w-full max-w-[720px] flex-col bg-paper">
        <div className="flex items-center justify-between border-b border-rule px-5 py-3">
          <div className="kicker">Bản ghi lời</div>
          <button onClick={onClose} aria-label="Đóng bản ghi" className="rounded-full border border-rule p-1.5 hover:bg-paper-2"><X size={18} /></button>
        </div>
        <div ref={box} className="flex-1 overflow-y-auto px-5 py-6 sm:px-10">
          <h2 className="font-serif text-[26px] font-bold leading-tight">{ep.title}</h2>
          <p className="mt-2 font-serif text-[16px] text-ink-2">{ep.desc}</p>
          <p className="mt-2 font-sans text-[12px] text-muted">{shortDate(hoursAgoDate(ep.hoursAgo))} · Bản ghi do máy tạo và biên tập viên rà soát.</p>
          <div className="mt-8 space-y-5">
            {p.timeline.map((l, i) => (
              <button
                key={i}
                data-active={i === p.current}
                onClick={() => p.jumpToLine(i)}
                className={cn('block w-full rounded px-3 py-2 text-left transition-colors', i === p.current ? 'bg-highlight' : 'hover:bg-paper-2')}
              >
                <span className="block font-sans text-[12px] font-semibold text-muted">{l.who} · {fmtDuration(l.start)}</span>
                <span className="mt-1 block font-serif text-[17px] leading-relaxed">{l.text}</span>
              </button>
            ))}
          </div>
        </div>
        <MiniControls p={p} duration={ep.duration} />
      </div>
    </div>
  )
}

function MiniControls({ p, duration }) {
  return (
    <div className="flex items-center gap-3 border-t border-rule px-5 py-3">
      <button onClick={p.toggle} aria-label={p.playing ? 'Tạm dừng' : 'Phát'} className="flex size-10 items-center justify-center rounded-full bg-ink text-paper">
        {p.playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" className="translate-x-px" />}
      </button>
      <input type="range" min={0} max={duration} step={1} value={p.time} onChange={(e) => p.seek(+e.target.value)} aria-label="Tua" className="h-1 flex-1 accent-[var(--c-son)]" />
      <span className="w-24 text-right font-sans text-[12px] tabular-nums text-muted">{fmtDuration(p.time)} / {fmtDuration(duration)}</span>
    </div>
  )
}

export default function EpisodePage() {
  const { id } = useParams()
  const ep = EPISODE_BY_ID[id]
  useTitle(ep?.title)
  if (!ep) return <NotFoundPage />
  return <Episode key={ep.id} ep={ep} />
}

function Episode({ ep }) {
  const show = SHOW_BY_ID[ep.show]
  const p = usePlayer({ duration: ep.duration, lines: ep.transcript })
  const [showTx, setShowTx] = useState(false)
  const rail = useRef(null)
  const related = ep.related && getArticle(ep.related)
  const more = EPISODES.filter((e) => e.id !== ep.id)

  return (
    <div>
      {/* Khung phát */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 opacity-30 blur-2xl" aria-hidden><Img k={show.image} ratio="16/9" className="h-full scale-125 [&>div]:h-full" /></div>
        <div className="relative mx-auto grid max-w-[1000px] items-center gap-8 px-4 py-10 sm:px-6 md:grid-cols-[260px_1fr] md:py-14">
          <div className="relative mx-auto w-[200px] md:w-full">
            <Img k={show.image} ratio="1/1" alt={show.name} priority className="shadow-2xl" />
            <span className="absolute inset-x-0 bottom-0 py-2 text-center font-mast text-[20px] font-black" style={{ background: show.color }}>{show.name}</span>
          </div>
          <div>
            <Link to="/nghe" className="kicker text-white/70 hover:text-white">{show.name} · Podcast</Link>
            <h1 className="mt-2 font-serif text-[28px] font-bold leading-tight sm:text-[36px]">{ep.title}</h1>
            <p className="mt-3 font-serif text-[17px] leading-snug text-white/80">{ep.desc}</p>
            <div className="mt-1 font-sans text-[12px] text-white/60">Dẫn chương trình: {show.host} · {timeAgo(ep.hoursAgo)}</div>

            {/* Điều khiển */}
            <div className="mt-6 flex items-center gap-4">
              <button onClick={() => p.skip(-15)} aria-label="Lùi 15 giây" className="relative rounded-full p-2 hover:bg-white/10"><RotateCcw size={24} /><span className="absolute inset-0 flex items-center justify-center pt-0.5 font-sans text-[8px] font-bold">15</span></button>
              <button onClick={p.toggle} aria-label={p.playing ? 'Tạm dừng' : 'Phát'} className="flex size-16 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105">
                {p.playing ? <Pause size={26} fill="currentColor" /> : <Play size={26} fill="currentColor" className="translate-x-0.5" />}
              </button>
              <button onClick={() => p.skip(15)} aria-label="Tiến 15 giây" className="relative rounded-full p-2 hover:bg-white/10"><RotateCw size={24} /><span className="absolute inset-0 flex items-center justify-center pt-0.5 font-sans text-[8px] font-bold">15</span></button>
              <button onClick={p.cycleSpeed} aria-label="Đổi tốc độ" className="ml-2 min-w-[52px] rounded-full border border-white/40 px-3 py-1.5 font-sans text-[13px] font-semibold hover:bg-white/10">{p.speed}×</button>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <span className="w-12 font-sans text-[12px] tabular-nums text-white/70">{fmtDuration(p.time)}</span>
              <input type="range" min={0} max={ep.duration} step={1} value={p.time} onChange={(e) => p.seek(+e.target.value)} aria-label="Thanh tiến trình" className="h-1 flex-1 accent-[var(--c-son)]" />
              <span className="w-12 text-right font-sans text-[12px] tabular-nums text-white/70">-{fmtDuration(ep.duration - p.time)}</span>
            </div>
            <div className="mt-4 rounded bg-white/10 px-4 py-3 font-serif text-[15px] leading-snug">
              <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-white/60">{p.timeline[p.current]?.who}</span>
              <p key={p.current} className="anim-fade mt-0.5">{p.timeline[p.current]?.text}</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 font-sans text-[13px]">
              <button onClick={() => setShowTx(true)} className="flex items-center gap-1.5 underline-offset-2 hover:underline"><FileText size={15} /> Bản ghi lời</button>
              <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast('Đã sao chép liên kết.') }} className="flex items-center gap-1.5 hover:underline"><Share2 size={15} /> Chia sẻ</button>
              <button onClick={() => toast('Đã thêm vào danh sách nghe (minh hoạ).')} className="flex items-center gap-1.5 hover:underline"><Bookmark size={15} /> Lưu</button>
              {canSpeak() && (
                <label className="flex items-center gap-2 text-white/80">
                  <Volume2 size={15} /> Giọng đọc máy
                  <Toggle checked={p.voice} onChange={p.setVoice} label="Bật giọng đọc máy tiếng Việt" />
                </label>
              )}
            </div>
            {!p.voice && <p className="mt-3 font-sans text-[11px] text-white/50">Bản demo: không có tệp âm thanh, thanh tiến trình chạy mô phỏng. Bật "Giọng đọc máy" để nghe trình duyệt đọc bản ghi.</p>}
          </div>
        </div>
      </section>

      <div className="wrap max-w-[1000px] py-10">
        {related && (
          <Link to={`/bai/${related.slug}`} className="group mb-10 flex items-center gap-4 border-y border-rule py-4">
            <Img k={related.image} ratio="1/1" className="w-[72px] shrink-0" />
            <div className="min-w-0">
              <div className="kicker text-muted">Đọc bài liên quan</div>
              <div className="hl story-link mt-1 text-[17px] leading-snug">{related.title}</div>
            </div>
          </Link>
        )}

        <div className="mb-4 flex items-center justify-between border-t border-ink pt-2">
          <h2 className="font-sans text-[15px] font-bold">Các tập khác</h2>
          <div className="flex gap-1">
            <button onClick={() => rail.current?.scrollBy({ left: -300, behavior: 'smooth' })} aria-label="Trước" className="rounded-full border border-rule p-1.5 hover:bg-paper-2"><ChevronLeft size={16} /></button>
            <button onClick={() => rail.current?.scrollBy({ left: 300, behavior: 'smooth' })} aria-label="Sau" className="rounded-full border border-rule p-1.5 hover:bg-paper-2"><ChevronRight size={16} /></button>
          </div>
        </div>
        <div ref={rail} className="no-scrollbar flex snap-x gap-5 overflow-x-auto pb-2">
          {more.map((e) => {
            const s = SHOW_BY_ID[e.show]
            return (
              <Link key={e.id} to={`/nghe/${e.id}`} className="group w-[200px] shrink-0 snap-start">
                <div className="relative">
                  <Img k={s.image} ratio="1/1" alt={s.name} />
                  <span className="absolute bottom-2 left-2 flex size-9 items-center justify-center rounded-full bg-white text-black"><Play size={15} fill="currentColor" className="translate-x-px" /></span>
                </div>
                <div className="meta mt-2">{s.name} · {fmtDuration(e.duration)}</div>
                <div className="hl story-link mt-1 text-[15px] leading-snug">{e.title}</div>
              </Link>
            )
          })}
        </div>
      </div>

      {showTx && <Transcript p={p} ep={ep} onClose={() => setShowTx(false)} />}
    </div>
  )
}
