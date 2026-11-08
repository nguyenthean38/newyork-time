/* Ưu đãi dùng thử 7 ngày: dòng thời gian hôm nay → ngày 7 → sau đó */
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { useTitle } from '@/components/ui'
import { PLANS, useCurrentUser } from '@/store'
import { shortDate } from '@/lib/format'
import { perWeek } from '@/features/account/shared'

export default function TrialPage() {
  useTitle('Dùng thử 7 ngày')
  const [sp] = useSearchParams()
  const plan = PLANS[sp.get('goi')] || PLANS.all
  const user = useCurrentUser()
  const nav = useNavigate()
  const day7 = new Date(Date.now() + 7 * 86400000)
  const checkout = `/thanh-toan?goi=${plan.id}`
  const go = () => nav(user ? checkout : `/dang-nhap?next=${encodeURIComponent(checkout)}`)

  const steps = [
    ['Hôm nay', 'Truy cập không giới hạn ngay lập tức. Không trừ tiền.'],
    [`Ngày 5 · ${shortDate(new Date(Date.now() + 5 * 86400000))}`, 'Chúng tôi gửi email nhắc trước khi hết dùng thử.'],
    [`Ngày 7 · ${shortDate(day7)}`, `Bắt đầu tính ${perWeek(plan.intro)}, thanh toán mỗi 4 tuần. Huỷ trước ngày này để không bị tính phí.`],
  ]

  return (
    <div className="relative mx-auto max-w-lg px-4 py-12">
      <Link to="/" aria-label="Đóng" className="absolute right-4 top-4 rounded p-1.5 text-muted hover:bg-paper-2 hover:text-ink"><X size={20} /></Link>
      <h1 className="text-center font-serif text-[28px] font-semibold leading-tight sm:text-[32px]">Dùng thử 7 ngày miễn phí.<br />Tài khoản của bạn bao gồm gói {plan.name}.</h1>
      <p className="mt-3 text-center font-sans text-[14px] text-muted">{plan.desc}</p>

      <div className="mt-8 rounded border border-rule p-5">
        <span className="rounded-sm bg-paper-3 px-2 py-0.5 font-sans text-[11px] font-bold uppercase tracking-wider">Cách dùng thử hoạt động</span>
        <ol className="relative mt-5 space-y-6 border-l-2 border-rule pl-6">
          {steps.map(([t, d], i) => (
            <li key={t} className="relative">
              <span className={`absolute -left-[33px] top-0.5 size-4 rounded-full border-2 ${i === 0 ? 'border-ink bg-ink' : 'border-rule-2 bg-paper'}`} />
              <div className="font-sans text-[14px] font-semibold">{t}</div>
              <p className="mt-0.5 font-sans text-[13px] leading-snug text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </div>

      <button onClick={go} className="btn btn-ink mt-6 w-full py-4">Tiếp tục thanh toán</button>
      <p className="mt-3 text-center font-sans text-[12px] text-muted">Bạn sẽ không bị tính phí trong 7 ngày dùng thử. Bản demo: không có giao dịch thật.</p>
      <Link to="/goi-doc" className="mt-5 block text-center font-sans text-[13px] font-semibold underline">Xem các gói khác</Link>
    </div>
  )
}
