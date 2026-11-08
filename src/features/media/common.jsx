/* Thành phần dùng chung cho các trang tìm kiếm / media */
import { useState, useCallback } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { unaccent } from '@/lib/format'
import { useClickAway } from '@/components/ui'

/** Tô vàng các từ khớp, không phân biệt dấu (giữ nguyên chữ gốc). */
export function Highlight({ text = '', q = '' }) {
  const words = unaccent(q.toLowerCase()).split(/\s+/).filter((w) => w.length > 1)
  if (!words.length) return text
  const base = unaccent(text.normalize('NFC').toLowerCase())
  const src = text.normalize('NFC')
  if (base.length !== src.length) return text
  const marks = new Array(src.length).fill(false)
  for (const w of words) {
    let i = base.indexOf(w)
    while (i !== -1) {
      for (let k = i; k < i + w.length; k++) marks[k] = true
      i = base.indexOf(w, i + w.length)
    }
  }
  const out = []
  let buf = ''
  let on = marks[0]
  for (let i = 0; i < src.length; i++) {
    if (marks[i] !== on) {
      out.push(on ? <mark key={i} className="bg-highlight text-ink">{buf}</mark> : buf)
      buf = ''
      on = marks[i]
    }
    buf += src[i]
  }
  out.push(on ? <mark key="end" className="bg-highlight text-ink">{buf}</mark> : buf)
  return out
}

/** Nút thả xuống có ô nội dung tuỳ ý. */
export function Popover({ label, active, children, align = 'left', width = 260 }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useClickAway(close)
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          'flex h-9 items-center gap-1.5 rounded-[3px] border px-3 font-sans text-[13px] transition-colors',
          active ? 'border-ink bg-ink text-paper' : 'border-rule-2 hover:border-ink',
        )}
      >
        {label}
        <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div
          className={cn('anim-pop absolute top-full z-30 mt-1.5 rounded border border-rule bg-paper p-3 shadow-pop', align === 'right' ? 'right-0' : 'left-0')}
          style={{ width: `min(${width}px, calc(100vw - 32px))` }}
        >
          {typeof children === 'function' ? children(close) : children}
        </div>
      )}
    </div>
  )
}

const WD = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
export const isoDay = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/** Lịch chọn khoảng ngày: bấm ngày đầu rồi ngày cuối. */
export function RangeCalendar({ from, to, onChange }) {
  const init = from ? new Date(from) : new Date()
  const [view, setView] = useState(new Date(init.getFullYear(), init.getMonth(), 1))
  const y = view.getFullYear()
  const m = view.getMonth()
  const offset = (new Date(y, m, 1).getDay() + 6) % 7
  const days = new Date(y, m + 1, 0).getDate()
  const cells = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => new Date(y, m, i + 1))]
  const today = isoDay(new Date())
  const pick = (d) => {
    const k = isoDay(d)
    if (!from || (from && to)) onChange(k, '')
    else if (k < from) onChange(k, from)
    else onChange(from, k)
  }
  return (
    <div className="font-sans text-[12px]">
      <div className="mb-2 flex items-center justify-between">
        <button type="button" onClick={() => setView(new Date(y, m - 1, 1))} className="rounded p-1 hover:bg-paper-2" aria-label="Tháng trước"><ChevronLeft size={15} /></button>
        <div className="font-semibold">Tháng {m + 1}, {y}</div>
        <button type="button" onClick={() => setView(new Date(y, m + 1, 1))} className="rounded p-1 hover:bg-paper-2" aria-label="Tháng sau"><ChevronRight size={15} /></button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {WD.map((w) => <div key={w} className="py-1 text-[11px] text-muted">{w}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />
          const k = isoDay(d)
          const edge = k === from || k === to
          const inside = from && to && k > from && k < to
          return (
            <button
              type="button"
              key={k}
              onClick={() => pick(d)}
              disabled={k > today}
              className={cn(
                'h-8 rounded text-[12px] disabled:text-faint disabled:opacity-40',
                edge ? 'bg-ink font-semibold text-paper' : inside ? 'bg-paper-3' : 'hover:bg-paper-2',
                k === today && !edge && 'font-bold underline',
              )}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
