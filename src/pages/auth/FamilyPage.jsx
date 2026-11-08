/* Gói Gia đình: chia sẻ Tân Thời với tối đa 3 người */
import { useNavigate } from 'react-router-dom'
import { Users } from 'lucide-react'
import { useTitle } from '@/components/ui'
import { PLANS, useCurrentUser, useUser, toast } from '@/store'
import { PLAN_FEATURES } from '@/features/account/plans'
import { perWeek, perMonth } from '@/features/account/shared'

const FACES = [['#bfe0e8', 'M'], ['#f7dca4', 'B'], ['#f4c7c3', 'L'], ['#cfe8c4', 'A']]

export default function FamilyPage() {
  useTitle('Gói Gia đình')
  const nav = useNavigate()
  const user = useCurrentUser()
  const changePlan = useUser((s) => s.changePlan)
  const p = PLANS.family
  const active = user?.subscription && user.subscription.status !== 'canceled'
  const isFamily = active && user.subscription.plan === 'family'

  const upgrade = () => {
    if (active) {
      changePlan('family')
      toast('Đã nâng cấp lên gói Trọn bộ Gia đình.')
      nav('/tai-khoan/goi')
    } else nav('/goi-doc/dung-thu?goi=family')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center">
      <div className="flex justify-center -space-x-3">
        {FACES.map(([c, l]) => (
          <span key={l} className="flex size-14 items-center justify-center rounded-full border-4 border-paper font-serif text-xl font-bold text-[#222]" style={{ background: c }}>{l}</span>
        ))}
      </div>
      <h1 className="mt-6 font-serif text-[30px] font-semibold leading-tight sm:text-[38px]">Nâng cấp lên Trọn bộ Gia đình.</h1>
      <p className="mt-3 font-sans text-[15px] text-muted">Chia sẻ Tân Thời với những người bạn quan tâm. Huỷ bất cứ lúc nào.</p>

      <div className="mx-auto mt-8 max-w-sm rounded border-2 border-ink p-5 text-left">
        <div className="flex items-center gap-2 font-sans text-[12px] font-bold uppercase tracking-wider"><Users size={15} /> 4 người dùng</div>
        <div className="mt-2 font-serif text-[20px] font-bold">{p.name}</div>
        <div className="mt-1 font-sans text-[14px]"><b>{perWeek(p.intro)}</b> <span className="text-muted">trong năm đầu, sau đó {perMonth(p.price)}</span></div>
        <ul className="mt-4 space-y-1.5 font-sans text-[13px] text-ink-2">
          {PLAN_FEATURES.family.map((f) => <li key={f}>• {f}</li>)}
        </ul>
        {isFamily ? (
          <p className="mt-5 rounded bg-paper-2 p-3 text-center font-sans text-[13px]">Bạn đang dùng gói này.</p>
        ) : (
          <button onClick={upgrade} className="btn btn-ink mt-5 w-full">{active ? 'Nâng cấp ngay' : 'Dùng thử 7 ngày'}</button>
        )}
      </div>
      <button onClick={() => nav(-1)} className="mt-6 font-sans text-[13px] underline">Tiếp tục mà không nâng cấp</button>
      <p className="mx-auto mt-10 max-w-xl font-sans text-[11px] leading-relaxed text-muted">
        Gói tự động gia hạn cho đến khi bạn huỷ. Giá ưu đãi áp dụng 12 tháng đầu, thanh toán mỗi 4 tuần; sau đó tính giá thường theo tháng. Bản demo: không có giao dịch thật.
      </p>
    </div>
  )
}
