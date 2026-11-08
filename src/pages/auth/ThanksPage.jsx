/* Cảm ơn sau khi đăng ký gói */
import { Link, useSearchParams } from 'react-router-dom'
import { useTitle } from '@/components/ui'
import { PLANS, useCurrentUser } from '@/store'
import { shortDate } from '@/lib/format'

/* Tranh minh hoạ bằng khối CSS: tách cà phê, tờ báo, bút chì */
function Still() {
  return (
    <div className="relative mx-auto h-64 w-64" aria-hidden>
      <div className="absolute bottom-6 left-4 h-40 w-32 -rotate-6 rounded-sm bg-paper shadow-pop">
        <div className="m-3 h-3 w-16 rounded bg-ink" />
        <div className="mx-3 h-16 rounded-sm bg-[#9fb8c8]" />
        <div className="m-3 space-y-1.5"><div className="h-1.5 rounded bg-rule-2" /><div className="h-1.5 w-4/5 rounded bg-rule-2" /><div className="h-1.5 w-3/5 rounded bg-rule-2" /></div>
      </div>
      <div className="absolute bottom-6 right-6 h-20 w-20 rounded-b-[40%] rounded-t-md bg-[#e8c9a8]">
        <div className="absolute -right-4 top-4 h-9 w-6 rounded-r-full border-4 border-[#e8c9a8]" />
        <div className="absolute inset-x-2 top-1.5 h-3 rounded-full bg-[#5b3a26]" />
      </div>
      {['#c8331f', '#f2c94c', '#121212'].map((c, i) => (
        <div key={c} className="absolute bottom-24 right-6 h-28 w-2 origin-bottom rounded-t-full" style={{ background: c, transform: `rotate(${-18 + i * 14}deg) translateX(${i * 10}px)` }} />
      ))}
      <div className="absolute inset-x-0 bottom-4 h-2 rounded-full bg-black/10 blur-sm" />
    </div>
  )
}

export default function ThanksPage() {
  useTitle('Cảm ơn bạn')
  const [sp] = useSearchParams()
  const user = useCurrentUser()
  const plan = PLANS[user?.subscription?.plan || sp.get('goi')] || PLANS.all
  const ends = user?.subscription ? new Date(user.subscription.trialEnds) : new Date(Date.now() + 7 * 86400000)
  return (
    <div className="wrap grid max-w-5xl items-center gap-10 py-12 md:grid-cols-2">
      <div>
        <h1 className="font-serif text-[32px] font-semibold leading-tight sm:text-[40px]">Cảm ơn bạn.<br />Chúc bạn có 7 ngày đọc không giới hạn.</h1>
        <p className="mt-3 font-sans text-[15px] text-muted">Gói {plan.name} đã được kích hoạt, miễn phí đến hết {shortDate(ends)}. Chúng tôi đã gửi xác nhận tới {user?.email || 'email của bạn'} (mô phỏng).</p>
        <Link to="/" className="btn btn-ink mt-6">Khám phá Tân Thời</Link>
        {plan.id !== 'family' && (
          <div className="mt-8 flex gap-4 rounded border border-rule p-4">
            <div className="flex -space-x-2">
              {['#bfe0e8', '#f7dca4', '#f4c7c3'].map((c) => <span key={c} className="size-8 rounded-full border-2 border-paper" style={{ background: c }} />)}
            </div>
            <div className="font-sans">
              <div className="text-[14px] font-semibold">Thêm 3 người vào gói của bạn</div>
              <p className="mt-0.5 text-[13px] text-muted">Mỗi người có đăng nhập riêng. Nâng cấp lên Trọn bộ Gia đình.</p>
              <Link to="/goi-doc/gia-dinh" className="btn btn-line btn-sm mt-3">Nâng cấp lên Gia đình</Link>
            </div>
          </div>
        )}
      </div>
      <Still />
    </div>
  )
}
