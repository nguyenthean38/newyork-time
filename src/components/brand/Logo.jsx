import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

/**
 * Măng-sét "Tân Thời": chữ serif tương phản cao, dấu chấm đỏ son ở cuối.
 * size: 'xl' (trang nhất) | 'md' (thanh trên) | 'sm'
 */
export function Wordmark({ size = 'md', className, to = '/' }) {
  const s = {
    xl: 'text-[44px] sm:text-[64px] lg:text-[76px] tracking-[-0.02em]',
    md: 'text-[26px] sm:text-[30px] tracking-[-0.015em]',
    sm: 'text-[20px] tracking-[-0.01em]',
  }[size]
  const dot = { xl: 'size-[9px] sm:size-[12px] lg:size-[14px]', md: 'size-[6px]', sm: 'size-[5px]' }[size]
  return (
    <Link to={to} aria-label="Tân Thời — về trang nhất" className={cn('inline-flex items-baseline font-mast font-black leading-none text-ink select-none', s, className)}>
      Tân Thời
      <span className={cn('ml-[0.06em] inline-block rounded-full bg-son', dot)} aria-hidden />
    </Link>
  )
}

/** Biểu tượng vuông chữ T, dùng ở góc trái thanh điều hướng bài viết. */
export function Mark({ className }) {
  return (
    <Link to="/" aria-label="Tân Thời — về trang nhất" className={cn('relative inline-flex size-8 items-center justify-center font-mast text-[26px] font-black leading-none text-ink', className)}>
      T
      <span className="absolute bottom-[5px] right-[3px] size-[5px] rounded-full bg-son" aria-hidden />
    </Link>
  )
}
