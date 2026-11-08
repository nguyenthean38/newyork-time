/* Thành phần giao diện dùng chung */
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Check, X, CircleCheck, CircleAlert, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/cn'
import { getImage } from '@/data'
import { useToast } from '@/store'

/* ---------- Ảnh có ghi nguồn ---------- */
export function Img({ k, alt = '', ratio = '3/2', className, imgClass, credit = false, creditLink = false, caption, priority = false, sizes }) {
  const img = getImage(k)
  return (
    <figure className={className}>
      <div className="story-img relative" style={{ aspectRatio: ratio }}>
        {img ? (
          <img
            src={img.src}
            alt={alt || caption || ''}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            sizes={sizes}
            className={cn('absolute inset-0 size-full object-cover', imgClass)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-paper-3 to-rule" />
        )}
      </div>
      {(credit || caption) && img && (
        <figcaption className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
          {caption && <span className="font-sans text-[13px] leading-snug text-muted">{caption}</span>}
          {credit && (creditLink ? (
            <a href={img.page} target="_blank" rel="noreferrer" className="credit ml-auto hover:underline">
              Ảnh: {img.credit} / Wikimedia Commons, {img.license}
            </a>
          ) : (
            <span className="credit ml-auto">Ảnh: {img.credit} / Wikimedia Commons, {img.license}</span>
          ))}
        </figcaption>
      )}
    </figure>
  )
}

/* ---------- Khoá cuộn khi mở lớp phủ ---------- */
export function useLockScroll(on) {
  useEffect(() => {
    if (!on) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [on])
}

function useEsc(on, cb) {
  useEffect(() => {
    if (!on) return
    const h = (e) => e.key === 'Escape' && cb()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [on, cb])
}

/* ---------- Hộp thoại ---------- */
export function Modal({ open, onClose, title, children, className, hideClose }) {
  useLockScroll(open)
  useEsc(open, onClose)
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="anim-fade absolute inset-0 bg-black/45" onClick={onClose} />
      <div className={cn('anim-pop relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-lg bg-paper p-6 shadow-pop sm:rounded-lg', className)}>
        {!hideClose && (
          <button onClick={onClose} aria-label="Đóng" className="absolute right-3 top-3 rounded p-1.5 text-muted hover:bg-paper-2 hover:text-ink">
            <X size={20} />
          </button>
        )}
        {title && <h2 className="mb-4 pr-8 font-serif text-xl font-bold">{title}</h2>}
        {children}
      </div>
    </div>,
    document.body,
  )
}

/* ---------- Ngăn kéo (trái / phải) ---------- */
export function Drawer({ open, onClose, side = 'left', label, children, className }) {
  useLockScroll(open)
  useEsc(open, onClose)
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label={label}>
      <div className="anim-fade absolute inset-0 bg-black/40" onClick={onClose} />
      <aside
        className={cn(
          'absolute top-0 flex h-full w-[min(380px,92vw)] flex-col bg-paper shadow-pop',
          side === 'left' ? 'anim-right left-0' : 'anim-left right-0',
          className,
        )}
      >
        {children}
      </aside>
    </div>,
    document.body,
  )
}

/* ---------- Công tắc ---------- */
export function Toggle({ checked, onChange, label, id }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn('relative h-6 w-[46px] shrink-0 rounded-full transition-colors', checked ? 'bg-hit' : 'bg-rule-2')}
    >
      <span className={cn('absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform', checked ? 'translate-x-[22px]' : 'translate-x-0.5')} />
    </button>
  )
}

/* ---------- Ô đánh dấu ---------- */
export function Checkbox({ checked, onChange, children, className }) {
  return (
    <label className={cn('flex cursor-pointer items-start gap-2.5 text-[13px] leading-snug text-ink-2', className)}>
      <span
        className={cn(
          'mt-px flex size-[18px] shrink-0 items-center justify-center rounded-[3px] border transition-colors',
          checked ? 'border-link bg-link text-white' : 'border-rule-2 bg-paper',
        )}
      >
        {checked && <Check size={13} strokeWidth={3} />}
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{children}</span>
    </label>
  )
}

/* ---------- Ô chọn một ---------- */
export function Radio({ checked, onChange, children, className, name }) {
  return (
    <label className={cn('flex cursor-pointer items-start gap-3 text-sm leading-snug', className)}>
      <span className={cn('mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors', checked ? 'border-ink' : 'border-rule-2')}>
        {checked && <span className="size-2 rounded-full bg-ink" />}
      </span>
      <input type="radio" name={name} className="sr-only" checked={checked} onChange={onChange} />
      <span className="flex-1">{children}</span>
    </label>
  )
}

/* ---------- Trường nhập ---------- */
export function Field({ label, error, hint, className, right, ...props }) {
  const id = props.id || props.name
  return (
    <div className={className}>
      {label && <label htmlFor={id} className="field-label">{label}</label>}
      <div className="relative">
        <input id={id} className={cn('field-input', right && 'pr-16')} aria-invalid={error ? 'true' : undefined} {...props} />
        {right && <div className="absolute inset-y-0 right-3 flex items-center">{right}</div>}
      </div>
      {error && <p className="mt-1.5 text-[13px] text-son">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-[12px] text-muted">{hint}</p>}
    </div>
  )
}

export function PasswordField({ label = 'Mật khẩu', ...props }) {
  const [show, setShow] = useState(false)
  return (
    <Field
      label={label}
      type={show ? 'text' : 'password'}
      autoComplete="current-password"
      right={
        <button type="button" onClick={() => setShow(!show)} className="flex items-center gap-1 text-[13px] font-semibold text-ink-2 hover:text-ink" aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
          {show ? 'Ẩn' : 'Hiện'}
        </button>
      }
      {...props}
    />
  )
}

/* ---------- Ảnh đại diện chữ cái ---------- */
export function Avatar({ name = '', icon, size = 36, tone, className }) {
  const letter = icon?.value || (name.trim()[0] || '?').toUpperCase()
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-serif font-bold text-[#222]', className)}
      style={{ width: size, height: size, fontSize: size * 0.44, background: icon?.color || tone || '#e2e2e2' }}
      aria-hidden
    >
      {letter}
    </span>
  )
}

/* ---------- Hộp thông báo góc dưới ---------- */
export function Toaster() {
  const { items, remove } = useToast()
  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[90] flex flex-col items-center gap-2 px-4" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded border border-rule bg-paper px-4 py-3 text-sm shadow-pop" style={{ animation: 'toast-in .25s ease both' }}>
          {t.tone === 'error' ? <CircleAlert size={18} className="shrink-0 text-son" /> : <CircleCheck size={18} className="shrink-0 text-pos" />}
          <span className="flex-1">{t.text}</span>
          <button onClick={() => remove(t.id)} aria-label="Đóng" className="text-muted hover:text-ink"><X size={16} /></button>
        </div>
      ))}
    </div>,
    document.body,
  )
}

/* ---------- Đóng khi bấm ra ngoài ---------- */
export function useClickAway(cb) {
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => ref.current && !ref.current.contains(e.target) && cb()
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [cb])
  return ref
}

/* ---------- Đặt tiêu đề trang ---------- */
export function useTitle(t) {
  useEffect(() => {
    document.title = t ? `${t} — Tân Thời` : 'Tân Thời — Tin tức, phân tích và trò chơi chữ'
  }, [t])
}

/* ---------- Tiêu đề khối chuyên mục ---------- */
export function SectionHead({ children, to, more = 'Xem thêm', className }) {
  return (
    <div className={cn('mb-4 flex items-baseline justify-between border-t border-ink pt-2', className)}>
      <h2 className="font-sans text-[15px] font-bold">{children}</h2>
      {to && <Link to={to} className="text-[13px] text-muted hover:text-ink">{more} ›</Link>}
    </div>
  )
}
