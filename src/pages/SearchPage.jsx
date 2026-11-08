/* Tìm kiếm: ô tìm lớn, bộ lọc thời gian / chuyên mục / loại bài / sắp xếp — tất cả lưu trên URL */
import { useMemo, useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { ARTICLES, searchArticles } from '@/data'
import { SECTIONS, SECTION_BY_SLUG } from '@/data/sections'
import { Img, Checkbox, useTitle } from '@/components/ui'
import { articleUrl, bylineText } from '@/components/story/Story'
import { Highlight, Popover, RangeCalendar } from '@/features/media/common'
import { numDate, timeAgo } from '@/lib/format'
import { cn } from '@/lib/cn'

const TIMES = [
  ['all', 'Mọi lúc'],
  ['24h', '24 giờ qua'],
  ['7d', '7 ngày qua'],
  ['30d', '30 ngày qua'],
  ['custom', 'Tuỳ chọn ngày'],
]
const TYPES = [
  ['tin', 'Tin'],
  ['phan-tich', 'Phân tích'],
  ['phong-su', 'Phóng sự & chân dung'],
  ['y-kien', 'Ý kiến'],
  ['cong-thuc', 'Công thức'],
  ['diem-sach', 'Điểm sách'],
  ['truc-tiep', 'Trực tiếp'],
]
const SORTS = [
  ['rel', 'Liên quan nhất'],
  ['new', 'Mới nhất'],
  ['old', 'Cũ nhất'],
]
const SUGGEST = ['metro', 'cà phê', 'phở', 'trí tuệ nhân tạo', 'Hội An', 'bóng đá']

function typeOf(a) {
  if (a.live) return 'truc-tiep'
  if (a.type === 'opinion') return 'y-kien'
  if (a.type === 'recipe') return 'cong-thuc'
  if (a.type === 'review') return 'diem-sach'
  if (/phân tích/i.test(a.kicker || '')) return 'phan-tich'
  if (/phóng sự|chân dung|điều tra/i.test(a.kicker || '')) return 'phong-su'
  return 'tin'
}
const TYPE_LABEL = Object.fromEntries(TYPES)

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const t = params.get('t') || 'all'
  const from = params.get('from') || ''
  const to = params.get('to') || ''
  const cmRaw = params.get('cm') || ''
  const loRaw = params.get('lo') || ''
  const cm = cmRaw.split(',').filter(Boolean)
  const lo = loRaw.split(',').filter(Boolean)
  const sx = params.get('sx') || (q ? 'rel' : 'new')
  const [draft, setDraft] = useState(q)
  const [limit, setLimit] = useState(10)
  useEffect(() => { setDraft(q); setLimit(10) }, [q])
  useTitle(q ? `Tìm "${q}"` : 'Tìm kiếm')

  const set = (patch) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(patch)) {
      if (v === '' || v == null || (Array.isArray(v) && !v.length)) next.delete(k)
      else next.set(k, Array.isArray(v) ? v.join(',') : v)
    }
    setParams(next, { replace: true })
    setLimit(10)
  }

  const results = useMemo(() => {
    const cms = cmRaw.split(',').filter(Boolean)
    const los = loRaw.split(',').filter(Boolean)
    let list = q ? searchArticles(q) : [...ARTICLES]
    const now = Date.now()
    const H = 3600000
    if (t === '24h') list = list.filter((a) => now - a.date < 24 * H)
    if (t === '7d') list = list.filter((a) => now - a.date < 7 * 24 * H)
    if (t === '30d') list = list.filter((a) => now - a.date < 30 * 24 * H)
    if (t === 'custom' && from) {
      const f = new Date(`${from}T00:00:00`).getTime()
      const e = new Date(`${to || from}T23:59:59`).getTime()
      list = list.filter((a) => a.date >= f && a.date <= e)
    }
    if (cms.length) list = list.filter((a) => cms.includes(a.section))
    if (los.length) list = list.filter((a) => los.includes(typeOf(a)))
    if (sx === 'new') list.sort((a, b) => b.date - a.date)
    if (sx === 'old') list.sort((a, b) => a.date - b.date)
    return list
  }, [q, t, from, to, cmRaw, loRaw, sx])

  const submit = (e) => {
    e.preventDefault()
    set({ q: draft.trim() })
  }
  const anyFilter = t !== 'all' || cm.length > 0 || lo.length > 0
  const timeLabel = t === 'custom' && from
    ? `${numDate(new Date(`${from}T00:00:00`))}${to ? ` – ${numDate(new Date(`${to}T00:00:00`))}` : ''}`
    : (TIMES.find(([k]) => k === t) || TIMES[0])[1]

  return (
    <div className="wrap max-w-[980px] py-8 sm:py-10">
      <form onSubmit={submit} className="flex items-center gap-2 border-b-2 border-ink pb-2">
        <Search size={22} className="shrink-0 text-muted" />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Tìm bài viết, chủ đề…"
          aria-label="Từ khoá tìm kiếm"
          className="min-w-0 flex-1 bg-transparent py-2 font-serif text-[22px] placeholder:text-faint focus:outline-none sm:text-[30px]"
        />
        {draft && (
          <button type="button" onClick={() => { setDraft(''); set({ q: '' }) }} aria-label="Xoá từ khoá" className="rounded p-1.5 text-muted hover:bg-paper-2 hover:text-ink"><X size={18} /></button>
        )}
        <button type="submit" className="btn btn-ink btn-sm">Tìm</button>
      </form>

      {/* Bộ lọc */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Popover label={timeLabel} active={t !== 'all'} width={290}>
          {(close) => (
            <div className="font-sans text-[13px]">
              <ul className="space-y-0.5">
                {TIMES.map(([k, l]) => (
                  <li key={k}>
                    <button
                      type="button"
                      onClick={() => { set({ t: k === 'all' ? '' : k, from: k === 'custom' ? from : '', to: k === 'custom' ? to : '' }); if (k !== 'custom') close() }}
                      className={cn('w-full rounded px-2 py-1.5 text-left hover:bg-paper-2', t === k && 'font-semibold')}
                    >
                      {t === k ? '✓ ' : ''}{l}
                    </button>
                  </li>
                ))}
              </ul>
              {t === 'custom' && (
                <div className="mt-3 border-t border-rule pt-3">
                  <RangeCalendar from={from} to={to} onChange={(f, e) => set({ t: 'custom', from: f, to: e })} />
                  <div className="mt-2 flex items-center justify-between">
                    <button type="button" onClick={() => set({ from: '', to: '' })} className="text-[12px] underline">Xoá ngày</button>
                    <button type="button" onClick={close} className="btn btn-ink btn-sm">Xong</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Popover>

        <Popover label={cm.length ? `Chuyên mục (${cm.length})` : 'Chuyên mục'} active={cm.length > 0}>
          <div className="space-y-2.5">
            <Checkbox checked={!cm.length} onChange={() => set({ cm: [] })}>Tất cả</Checkbox>
            {SECTIONS.map((s) => (
              <Checkbox key={s.slug} checked={cm.includes(s.slug)} onChange={(v) => set({ cm: v ? [...cm, s.slug] : cm.filter((x) => x !== s.slug) })}>
                {s.name} <span className="text-faint">({ARTICLES.filter((a) => a.section === s.slug).length})</span>
              </Checkbox>
            ))}
          </div>
        </Popover>

        <Popover label={lo.length ? `Loại bài (${lo.length})` : 'Loại bài'} active={lo.length > 0}>
          <div className="space-y-2.5">
            <Checkbox checked={!lo.length} onChange={() => set({ lo: [] })}>Tất cả</Checkbox>
            {TYPES.map(([k, l]) => (
              <Checkbox key={k} checked={lo.includes(k)} onChange={(v) => set({ lo: v ? [...lo, k] : lo.filter((x) => x !== k) })}>{l}</Checkbox>
            ))}
          </div>
        </Popover>

        {anyFilter && (
          <button onClick={() => set({ t: '', from: '', to: '', cm: [], lo: [] })} className="px-1 font-sans text-[13px] underline underline-offset-2">Xoá bộ lọc</button>
        )}

        <div className="ml-auto">
          <Popover label={`Sắp xếp: ${(SORTS.find(([k]) => k === sx) || SORTS[1])[1]}`} align="right" width={200}>
            {(close) => (
              <ul className="font-sans text-[13px]">
                {SORTS.filter(([k]) => q || k !== 'rel').map(([k, l]) => (
                  <li key={k}>
                    <button onClick={() => { set({ sx: k }); close() }} className={cn('w-full rounded px-2 py-1.5 text-left hover:bg-paper-2', sx === k && 'font-semibold')}>
                      {sx === k ? '✓ ' : ''}{l}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Popover>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2 border-b border-ink pb-2 font-sans">
        <h1 className="text-[15px] font-bold">{q ? 'Kết quả tìm kiếm' : 'Mới nhất'}</h1>
        <div className="text-[13px] text-muted">
          {q ? <>{results.length.toLocaleString('vi-VN')} kết quả cho <b className="text-ink">“{q}”</b></> : `${results.length} bài viết`}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="py-16 text-center">
          <div className="font-serif text-[26px] font-bold">0 kết quả</div>
          <p className="mx-auto mt-2 max-w-md font-sans text-[14px] text-muted">
            Không tìm thấy bài viết nào{q && <> cho “{q}”</>}{anyFilter ? ' với bộ lọc hiện tại' : ''}. Hãy thử từ khoá ngắn hơn, gõ không dấu hoặc xoá bớt bộ lọc.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {SUGGEST.map((s) => (
              <button key={s} onClick={() => set({ q: s, t: '', from: '', to: '', cm: [], lo: [] })} className="btn btn-line btn-sm btn-pill">{s}</button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <ol>
            {results.slice(0, limit).map((a) => (
              <li key={a.slug} className="border-b border-rule py-5">
                <Link to={articleUrl(a)} className="group grid grid-cols-[1fr_auto] gap-x-5 sm:grid-cols-[120px_1fr_auto]">
                  <div className="col-span-2 mb-1 font-sans text-[12px] text-muted sm:col-span-1 sm:mb-0 sm:pt-1">{timeAgo(a.date)}</div>
                  <div className="min-w-0">
                    <div className={cn('kicker mb-1', a.live ? 'text-son' : 'text-muted')}>
                      {SECTION_BY_SLUG[a.section]?.name} · {TYPE_LABEL[typeOf(a)]}
                    </div>
                    <h3 className="hl story-link text-[18px] leading-snug sm:text-[19px]"><Highlight text={a.title} q={q} /></h3>
                    <p className="dek mt-1.5 line-clamp-3 text-[15px]"><Highlight text={a.dek} q={q} /></p>
                    <div className="mt-2 font-sans text-[11px] uppercase tracking-[0.06em] text-muted">{bylineText(a)}</div>
                  </div>
                  <Img k={a.image} ratio="1/1" className="w-[84px] sm:w-[150px]" alt={a.caption} />
                </Link>
              </li>
            ))}
          </ol>
          {limit < results.length && (
            <div className="mt-8 text-center">
              <button onClick={() => setLimit((l) => l + 10)} className="btn btn-line">Xem thêm kết quả</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
