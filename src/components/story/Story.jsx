/* Các khối hiển thị bài viết dùng ở trang nhất, chuyên mục, tìm kiếm */
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { timeAgo } from '@/lib/format'
import { authorsOf } from '@/data'
import { Img } from '@/components/ui'

export const articleUrl = (a) => `/bai/${a.slug}`

/** Nhãn nhỏ phía trên tiêu đề: TRỰC TIẾP (đỏ, nhấp nháy) hoặc chuyên mục / thể loại. */
export function Kicker({ a, className }) {
  if (a.live) {
    return (
      <div className={cn('mb-1.5 flex items-center gap-2', className)}>
        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-son">
          <span className="live-dot size-1.5 rounded-full bg-son" />
          Trực tiếp
        </span>
        <span className="text-[12px] text-son">{timeAgo(a.date)}</span>
      </div>
    )
  }
  const label = a.type === 'opinion' ? 'Ý kiến' : a.kicker
  if (!label) return null
  return <div className={cn('kicker mb-1.5', a.type === 'opinion' && 'text-son', className)}>{label}</div>
}

export function ReadTime({ a, className }) {
  return <div className={cn('meta mt-2', className)}>{a.read} phút đọc</div>
}

/** "Hà Linh và Bùi Gia Huy" */
export function bylineText(a) {
  const names = authorsOf(a).map((x) => x.name)
  if (names.length <= 1) return names[0] || ''
  return `${names.slice(0, -1).join(', ')} và ${names.at(-1)}`
}

/**
 * Khối bài linh hoạt.
 * size: 'xl' | 'lg' | 'md' | 'sm' | 'xs'
 * img: 'top' | 'right' | 'left' | false
 */
export function Story({ a, size = 'md', img = false, dek = false, ratio = '3/2', credit = false, className, byline = false, priority }) {
  if (!a) return null
  const hl = {
    xl: 'text-[28px] sm:text-[34px] leading-[1.12]',
    lg: 'text-[24px] sm:text-[27px] leading-[1.15]',
    md: 'text-[19px] sm:text-[20px] leading-[1.22]',
    sm: 'text-[16px] sm:text-[17px] leading-[1.25]',
    xs: 'text-[15px] leading-[1.28]',
  }[size]
  const isOpinion = a.type === 'opinion'
  const media = img && (
    <Img k={a.image} ratio={ratio} credit={credit} alt={a.caption} priority={priority} className={cn(img === 'right' && 'w-[38%] shrink-0', img === 'left' && 'w-[38%] shrink-0')} />
  )
  return (
    <article className={cn('group', className)}>
      <Link to={articleUrl(a)} className={cn('block', (img === 'right' || img === 'left') && 'flex gap-4')}>
        {img === 'top' && <div className="mb-3">{media}</div>}
        {img === 'left' && media}
        <div className="min-w-0 flex-1">
          <Kicker a={a} />
          {isOpinion && byline && <div className="mb-1 font-sans text-[13px] font-bold">{bylineText(a)}</div>}
          <h3 className={cn('story-link', isOpinion ? 'hl-light' : 'hl', hl)}>{a.title}</h3>
          {dek && <p className={cn('dek mt-2', size === 'xl' || size === 'lg' ? 'text-[17px]' : 'text-[15px]')}>{a.dek}</p>}
          {byline && !isOpinion && <div className="mt-2 font-sans text-[12px] text-muted">{bylineText(a)}</div>}
          <ReadTime a={a} />
        </div>
        {img === 'right' && media}
      </Link>
    </article>
  )
}

/** Dòng bài dạng danh sách (tìm kiếm, mới nhất, chuyên mục). */
export function StoryRow({ a, showSection = true, className }) {
  return (
    <article className={cn('group border-b border-rule py-5', className)}>
      <Link to={articleUrl(a)} className="grid grid-cols-[1fr_auto] gap-x-5 sm:grid-cols-[110px_1fr_auto]">
        <div className="col-span-2 mb-1 font-sans text-[12px] text-muted sm:col-span-1 sm:mb-0 sm:pt-1">{timeAgo(a.date)}</div>
        <div className="min-w-0">
          {showSection && <div className="kicker mb-1 text-muted">{a.sub || a.kicker}</div>}
          <h3 className="hl story-link text-[19px] leading-snug">{a.title}</h3>
          <p className="dek mt-1.5 line-clamp-2 text-[15px]">{a.dek}</p>
          <div className="mt-2 font-sans text-[11px] uppercase tracking-[0.06em] text-muted">{bylineText(a)}</div>
        </div>
        <Img k={a.image} ratio="1/1" className="w-[88px] sm:w-[150px]" alt={a.caption} />
      </Link>
    </article>
  )
}
