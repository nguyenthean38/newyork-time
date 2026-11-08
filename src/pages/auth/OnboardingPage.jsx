/* Chào mừng tài khoản mới: chọn chủ đề → bản tin gợi ý → tải ứng dụng → sẵn sàng */
import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Star, Plus, Check, CircleCheck } from 'lucide-react'
import { useTitle } from '@/components/ui'
import { useUser, useCurrentUser, toast } from '@/store'
import { INTERESTS, NEWSLETTERS } from '@/data/newsletters'
import { DemoQR, PhoneMock } from '@/features/account/shared'
import { cn } from '@/lib/cn'

const INTEREST_ART = {
  'tin-tuc': ['#121212', '#f2f2f2', '▤'], 'tro-choi': ['#f2c94c', '#121212', '▦'], 'am-thuc': ['#e76f51', '#fff', '◐'],
  nghe: ['#3a0ca3', '#fff', '◉'], 'van-hoa': ['#6d597a', '#fff', '❚'], 'the-thao': ['#2a9d8f', '#fff', '⚑'],
}
const REC = { 'tin-tuc': ['sang-nay', 'toi-nay'], 'tro-choi': ['tro-choi-moi'], 'am-thuc': ['bep-toi-nay', 'an-gi-cuoi-tuan'], nghe: ['song-cham'], 'van-hoa': ['gia-sach', 'cuoi-tuan-di-dau'], 'the-thao': ['tin-nong'] }

function Steps({ n }) {
  return <div className="font-sans text-[13px] text-muted">Bước {n} / 3</div>
}

export function NewsletterTile({ n, on, onToggle }) {
  return (
    <div className={cn('flex flex-col rounded border p-3 transition-colors', on ? 'border-ink' : 'border-rule')}>
      <div className="flex items-start justify-between">
        <span className="flex size-12 items-center justify-center rounded-sm font-serif text-[22px]" style={{ background: n.art[0], color: n.art[1] }} aria-hidden>{n.glyph}</span>
        <button onClick={onToggle} aria-pressed={on} aria-label={on ? `Bỏ chọn ${n.name}` : `Chọn ${n.name}`} className={cn('flex size-7 items-center justify-center rounded-full border transition-colors', on ? 'border-ink bg-ink text-paper' : 'border-rule-2 hover:border-ink')}>
          {on ? <Check size={15} /> : <Plus size={15} />}
        </button>
      </div>
      <div className="meta mt-3">{n.freq}</div>
      <div className="mt-0.5 font-serif text-[16px] font-bold">{n.name}</div>
      <p className="mt-1 font-sans text-[12.5px] leading-snug text-muted">{n.desc}</p>
    </div>
  )
}

export default function OnboardingPage() {
  useTitle('Chào mừng bạn')
  const [sp] = useSearchParams()
  const next = sp.get('next') || '/'
  const nav = useNavigate()
  const user = useCurrentUser()
  const { update, toggleNewsletter } = useUser()
  const [step, setStep] = useState(1)
  const [picked, setPicked] = useState(() => user?.interests?.length ? user.interests : ['tin-tuc'])
  const [showAll, setShowAll] = useState(false)

  if (!user) return <Navigate to={`/dang-nhap?next=${encodeURIComponent('/chao-mung')}`} replace />

  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const recIds = [...new Set(picked.flatMap((p) => REC[p] || []))]
  const list = showAll ? NEWSLETTERS : NEWSLETTERS.filter((n) => recIds.includes(n.id) || n.featured).slice(0, 8)

  if (step === 1) {
    return (
      <div className="wrap max-w-4xl py-10">
        <Steps n={1} />
        <h1 className="mt-2 font-serif text-[28px] font-semibold leading-tight">Bạn muốn khám phá gì trên Tân Thời?</h1>
        <p className="mt-2 font-sans text-[14px] text-muted">Chọn vài chủ đề, chúng tôi sẽ gợi ý bản tin phù hợp. Bạn có thể đổi bất cứ lúc nào.</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {INTERESTS.map((it) => {
            const on = picked.includes(it.id)
            const [bg, fg, g] = INTEREST_ART[it.id]
            return (
              <button
                key={it.id}
                onClick={() => !it.locked && toggle(it.id)}
                aria-pressed={on}
                className={cn('flex items-start gap-3 rounded border p-3 text-left transition-colors', on ? 'border-ink bg-paper-2' : 'border-rule hover:border-rule-2', it.locked && 'cursor-default')}
              >
                <span className="flex size-14 shrink-0 items-center justify-center rounded-sm font-serif text-2xl" style={{ background: bg, color: fg }} aria-hidden>{g}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between">
                    <span className="font-serif text-[17px] font-bold">{it.name}</span>
                    <Star size={18} className={on ? 'fill-ink text-ink' : 'text-faint'} />
                  </span>
                  <span className="mt-1 block font-sans text-[12.5px] leading-snug text-muted">{it.desc}{it.locked && ' (luôn bao gồm)'}</span>
                </span>
              </button>
            )
          })}
        </div>
        <div className="mt-8 flex justify-end gap-2">
          <button onClick={() => nav(next)} className="btn btn-line">Để sau</button>
          <button onClick={() => { update({ interests: picked }); setStep(2) }} className="btn btn-ink">Tiếp tục</button>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="wrap max-w-5xl py-10">
        <Steps n={2} />
        <h1 className="mt-2 font-serif text-[28px] font-semibold leading-tight">Dựa trên lựa chọn của bạn, đây là những bản tin nên thử</h1>
        <p className="mt-2 font-sans text-[14px] text-muted">Thêm một hoặc nhiều bản tin. Gửi tới {user.email}.</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((n) => (
            <NewsletterTile key={n.id} n={n} on={user.newsletters.includes(n.id)} onToggle={() => toggleNewsletter(n.id)} />
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-rule pt-4 font-sans text-[13px]">
          <span className="text-muted">Còn {NEWSLETTERS.length} bản tin về tin tức, ẩm thực, văn hoá và trò chơi.</span>
          {!showAll && <button onClick={() => setShowAll(true)} className="btn btn-line btn-sm">Xem tất cả</button>}
        </div>
        <div className="mt-8 flex justify-end gap-2">
          <button onClick={() => setStep(1)} className="btn btn-line">Quay lại</button>
          <button onClick={() => { toast(`Đã đăng ký ${user.newsletters.length} bản tin.`); setStep(3) }} className="btn btn-ink">Tiếp tục</button>
        </div>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="wrap max-w-3xl py-10 text-center">
        <Steps n={3} />
        <h1 className="mt-2 font-serif text-[28px] font-semibold leading-tight">Thiết lập xong rồi. Mang Tân Thời theo bên mình</h1>
        <p className="mt-2 font-sans text-[14px] text-muted">Quét mã để tải ứng dụng (minh hoạ) và đăng nhập bằng cùng tài khoản.</p>
        <div className="mt-6 flex flex-col items-center gap-2">
          <DemoQR seed={user.email} />
          <span className="font-sans text-[12px] text-muted">Mã QR minh hoạ, không dẫn tới ứng dụng thật</span>
        </div>
        <div className="mt-8 flex items-end justify-center gap-3 overflow-hidden">
          <PhoneMock kind="food" tone="#e76f51" className="hidden translate-y-4 sm:block" />
          <PhoneMock kind="news" tone="#9fb8c8" />
          <PhoneMock kind="games" />
          <PhoneMock kind="news" tone="#e8c9a8" className="hidden translate-y-4 sm:block" />
        </div>
        <button onClick={() => setStep(4)} className="mt-10 font-sans text-[14px] font-semibold underline">Để sau</button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <CircleCheck size={44} className="mx-auto text-pos" strokeWidth={1.5} />
      <h1 className="mt-4 font-serif text-[28px] font-semibold">Bạn đã sẵn sàng!</h1>
      <p className="mt-2 font-sans text-[14px] text-muted">Quản lý bản tin và cài đặt bất cứ lúc nào trong mục Tài khoản.</p>
      <div className="mt-7 space-y-2.5">
        <button onClick={() => nav(next === '/chao-mung' ? '/' : next)} className="btn btn-ink w-full">Đọc trang nhất</button>
        <Link to="/goi-doc/dung-thu" className="btn btn-line w-full">Dùng thử gói Trọn bộ 7 ngày</Link>
      </div>
    </div>
  )
}
