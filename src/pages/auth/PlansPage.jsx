/* Trang gói đọc: chọn gói, bảng so sánh, câu hỏi thường gặp */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Minus, ChevronDown } from 'lucide-react'
import { useTitle } from '@/components/ui'
import { PLANS, useCurrentUser } from '@/store'
import { PLAN_FEATURES, COMPARE, PLAN_FAQ } from '@/features/account/plans'
import { perWeek, perMonth } from '@/features/account/shared'
import { cn } from '@/lib/cn'

export function PlanFaq() {
  return (
    <div className="divide-y divide-rule border-y border-rule">
      {PLAN_FAQ.map(([q, a]) => (
        <details key={q} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-sans text-[15px] font-semibold">
            {q}
            <ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-2 font-sans text-[14px] leading-relaxed text-muted">{a}</p>
        </details>
      ))}
    </div>
  )
}

export default function PlansPage() {
  useTitle('Gói đọc')
  const nav = useNavigate()
  const user = useCurrentUser()
  const [sel, setSel] = useState('all')
  const active = user?.subscription && user.subscription.status !== 'canceled'

  return (
    <div className="pb-16">
      <section className="border-b border-rule bg-paper-2">
        <div className="wrap max-w-5xl py-12 text-center">
          <div className="kicker text-son">Ưu đãi giới hạn · 7 ngày dùng thử miễn phí</div>
          <h1 className="mx-auto mt-3 max-w-2xl font-serif text-[32px] font-semibold leading-tight sm:text-[42px]">Hiểu thế giới rõ hơn, mỗi ngày.</h1>
          <p className="mx-auto mt-3 max-w-xl font-sans text-[15px] leading-relaxed text-muted">
            Báo chí độc lập, trò chơi chữ tiếng Việt, công thức đã thử nghiệm và podcast — chỉ từ {perWeek(PLANS.news.intro)} trong năm đầu.
          </p>
          {active && (
            <p className="mt-4 font-sans text-[14px]">Bạn đang dùng gói <b>{PLANS[user.subscription.plan].name}</b>. <Link to="/tai-khoan/goi" className="underline">Quản lý gói</Link></p>
          )}
        </div>
      </section>

      <div className="wrap max-w-5xl">
        <div className="-mt-px grid gap-4 pt-10 md:grid-cols-3">
          {Object.values(PLANS).map((p) => {
            const on = sel === p.id
            return (
              <button
                key={p.id}
                onClick={() => setSel(p.id)}
                aria-pressed={on}
                className={cn('relative flex flex-col rounded border-2 p-5 text-left transition-colors', on ? 'border-ink' : 'border-rule hover:border-rule-2')}
              >
                {p.id === 'all' && <span className="absolute -top-3 left-5 rounded-sm bg-son px-2 py-0.5 font-sans text-[11px] font-bold uppercase tracking-wider text-white">Phổ biến nhất</span>}
                <div className="flex items-center justify-between">
                  <span className="font-serif text-[20px] font-bold">{p.name}</span>
                  <span className={cn('flex size-5 items-center justify-center rounded-full border-2', on ? 'border-ink' : 'border-rule-2')}>{on && <span className="size-2.5 rounded-full bg-ink" />}</span>
                </div>
                <p className="mt-1 font-sans text-[13px] text-muted">{p.desc}</p>
                <div className="mt-4 font-sans">
                  <span className="text-[26px] font-bold">{p.intro.toLocaleString('vi-VN')}₫</span>
                  <span className="text-[14px] text-muted">/tuần</span>
                </div>
                <div className="font-sans text-[12px] text-muted">trong 12 tháng đầu, sau đó {perMonth(p.price)}</div>
                <ul className="mt-4 space-y-2 border-t border-rule pt-4 font-sans text-[13px]">
                  {PLAN_FEATURES[p.id].map((f) => <li key={f} className="flex gap-2"><Check size={15} className="mt-0.5 shrink-0 text-pos" /> {f}</li>)}
                </ul>
              </button>
            )
          })}
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <button onClick={() => nav(`/goi-doc/dung-thu?goi=${sel}`)} className="btn btn-son w-full max-w-sm py-4 text-[15px]">Dùng thử miễn phí — gói {PLANS[sel].name}</button>
          <span className="font-sans text-[12px] text-muted">Huỷ bất cứ lúc nào. Bản demo: không có giao dịch thật.</span>
        </div>

        <h2 className="mt-16 font-serif text-[24px] font-bold">So sánh các gói</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] font-sans text-[14px]">
            <thead>
              <tr className="border-b-2 border-ink text-left">
                <th className="py-3 pr-4 font-semibold">Quyền lợi</th>
                {Object.values(PLANS).map((p) => <th key={p.id} className="px-2 py-3 text-center font-semibold">{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([label, has]) => (
                <tr key={label} className="border-b border-rule">
                  <td className="py-3 pr-4">{label}</td>
                  {Object.keys(PLANS).map((id) => (
                    <td key={id} className="px-2 py-3 text-center">
                      {has.includes(id) ? <Check size={17} className="mx-auto text-pos" aria-label="Có" /> : <Minus size={17} className="mx-auto text-faint" aria-label="Không" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="font-serif text-[24px] font-bold">Câu hỏi thường gặp</h2>
            <p className="mt-2 font-sans text-[14px] text-muted">Muốn mua cho cả nhà? <Link to="/goi-doc/gia-dinh" className="underline">Xem gói Gia đình</Link>.</p>
          </div>
          <PlanFaq />
        </div>
      </div>
    </div>
  )
}
