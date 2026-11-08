/* ==========================================================
   Trình xem "truyện dọc": ảnh toàn màn hình phóng chậm (Ken Burns),
   hộp chú thích xuất hiện theo từng cảnh, thanh tiến trình phía trên.
   Bấm nửa trái / phải hoặc phím ← → để chuyển cảnh, ↑ ↓ để đổi video, Space để dừng.
   ========================================================== */
import { useCallback, useEffect, useState } from 'react'
import { X, Volume2, VolumeX, Pause, Play, ChevronUp, ChevronDown } from 'lucide-react'
import { getImage } from '@/data'
import { useLockScroll } from '@/components/ui'
import { cn } from '@/lib/cn'

const SLIDE_MS = 5200
const KB = ['kb-a', 'kb-b', 'kb-c']

export function StoryPlayer({ videos, index, onIndex, onClose }) {
  const v = videos[index]
  const [slide, setSlide] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const [muted, setMuted] = useState(true)
  useLockScroll(true)

  useEffect(() => { setSlide(0); setProgress(0) }, [index])

  const next = useCallback(() => {
    setProgress(0)
    if (slide < v.slides.length - 1) setSlide((s) => s + 1)
    else if (index < videos.length - 1) onIndex(index + 1)
    else onClose()
  }, [slide, v.slides.length, index, videos.length, onIndex, onClose])
  const prev = useCallback(() => {
    setProgress(0)
    if (slide > 0) setSlide((s) => s - 1)
    else if (index > 0) onIndex(index - 1)
  }, [slide, index, onIndex])

  /* Đồng hồ cảnh */
  useEffect(() => {
    if (paused) return
    let last = performance.now()
    let raf
    const tick = (now) => {
      const dt = now - last
      last = now
      setProgress((p) => {
        const n = p + dt / SLIDE_MS
        return n >= 1 ? 1 : n
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [paused, slide, index])
  useEffect(() => { if (progress >= 1) next() }, [progress, next])

  /* Bàn phím */
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowDown' && index < videos.length - 1) onIndex(index + 1)
      else if (e.key === 'ArrowUp' && index > 0) onIndex(index - 1)
      else if (e.key === ' ') { e.preventDefault(); setPaused((p) => !p) }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [next, prev, onClose, onIndex, index, videos.length])

  const s = v.slides[slide]
  const img = getImage(s.img)

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black" role="dialog" aria-modal="true" aria-label={v.title}>
      <style>{`
        @keyframes kb-a { from { transform: scale(1.02) translate(0,0) } to { transform: scale(1.18) translate(-3%, -2%) } }
        @keyframes kb-b { from { transform: scale(1.18) translate(3%, 1%) } to { transform: scale(1.04) translate(0,0) } }
        @keyframes kb-c { from { transform: scale(1.05) translate(2%, 2%) } to { transform: scale(1.2) translate(-2%, 0) } }
        @keyframes cap-in { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
      `}</style>

      {/* Nền mờ cho màn hình rộng */}
      {img && <img src={img.src} alt="" aria-hidden className="absolute inset-0 size-full scale-110 object-cover opacity-30 blur-2xl" />}

      <div className="relative h-full w-full overflow-hidden sm:h-[min(92vh,860px)] sm:w-auto sm:aspect-[9/16] sm:rounded-lg">
        {img && (
          <img
            key={`${index}-${slide}`}
            src={img.src}
            alt={s.text}
            className="absolute inset-0 size-full object-cover"
            style={{ animation: `${KB[(slide + index) % 3]} ${SLIDE_MS + 400}ms linear both`, animationPlayState: paused ? 'paused' : 'running' }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/60" />

        {/* Thanh tiến trình */}
        <div className="absolute inset-x-3 top-3 flex gap-1">
          {v.slides.map((_, i) => (
            <div key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/35">
              <div className="h-full bg-white" style={{ width: `${i < slide ? 100 : i === slide ? progress * 100 : 0}%` }} />
            </div>
          ))}
        </div>

        {/* Đầu: địa điểm + nút */}
        <div className="absolute inset-x-3 top-7 flex items-start justify-between text-white">
          <div className="font-serif leading-tight drop-shadow">
            <div className="text-[18px] font-bold">{v.place}</div>
            <div className="font-sans text-[12px] text-white/80">{v.by} · Tân Thời</div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Tiếp tục' : 'Tạm dừng'} className="rounded-full bg-black/30 p-2 hover:bg-black/50">{paused ? <Play size={16} /> : <Pause size={16} />}</button>
            <button onClick={() => setMuted((m) => !m)} aria-label={muted ? 'Bật tiếng' : 'Tắt tiếng'} title="Video minh hoạ không có âm thanh" className="rounded-full bg-black/30 p-2 hover:bg-black/50">{muted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
            <button onClick={onClose} aria-label="Đóng" className="rounded-full bg-black/30 p-2 hover:bg-black/50"><X size={16} /></button>
          </div>
        </div>

        {/* Vùng bấm chuyển cảnh */}
        <button aria-label="Cảnh trước" onClick={prev} className="absolute inset-y-20 left-0 w-1/3" />
        <button aria-label="Cảnh sau" onClick={next} className="absolute inset-y-20 right-0 w-2/3" />

        {/* Chú thích */}
        <div className="pointer-events-none absolute inset-x-5 bottom-16 sm:inset-x-6">
          {s.name && (
            <div key={`n${index}-${slide}`} className="mb-3 inline-block bg-white px-3 py-2 text-black" style={{ animation: 'cap-in .5s .2s ease both' }}>
              <div className="font-serif text-[18px] font-bold leading-tight">{s.name}</div>
              <div className="font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-black/60">{s.role}</div>
            </div>
          )}
          <p key={`t${index}-${slide}`} className="max-w-[340px] font-serif text-[21px] font-semibold leading-snug text-black" style={{ animation: 'cap-in .5s .5s ease both' }}>
            <span className="box-decoration-clone bg-white px-2 py-0.5 [-webkit-box-decoration-break:clone]">{s.text}</span>
          </p>
        </div>

        <div className="absolute inset-x-5 bottom-5 font-sans text-[12px] text-white/80">
          <span className="font-semibold text-white">{v.title}</span> · {index + 1}/{videos.length}
        </div>
      </div>

      {/* Đổi video (màn hình rộng) */}
      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-2 sm:flex">
        <button disabled={index === 0} onClick={() => onIndex(index - 1)} aria-label="Video trước" className={cn('rounded-full bg-white/15 p-2.5 text-white hover:bg-white/25', index === 0 && 'opacity-30')}><ChevronUp size={20} /></button>
        <button disabled={index === videos.length - 1} onClick={() => onIndex(index + 1)} aria-label="Video sau" className={cn('rounded-full bg-white/15 p-2.5 text-white hover:bg-white/25', index === videos.length - 1 && 'opacity-30')}><ChevronDown size={20} /></button>
      </div>
    </div>
  )
}
