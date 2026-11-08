/* Thanh toán (demo an toàn): tài khoản → phương thức → xem lại. Không thu thông tin thẻ thật. */
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, CreditCard, Wallet, QrCode, Check } from 'lucide-react'
import { Radio, useTitle } from '@/components/ui'
import { PLANS, useCurrentUser, useUser, toast } from '@/store'
import { shortDate } from '@/lib/format'
import { DemoNote, DemoQR, perWeek, perMonth } from '@/features/account/shared'
import { Wordmark } from '@/components/brand/Logo'
import { cn } from '@/lib/cn'

const METHODS = [
  { id: 'card', label: 'Thẻ thử nghiệm', icon: CreditCard, summary: 'Thẻ thử nghiệm •••• 4242' },
  { id: 'wallet', label: 'Ví điện tử (demo)', icon: Wallet, summary: 'Ví điện tử (demo)' },
  { id: 'qr', label: 'Chuyển khoản QR (demo)', icon: QrCode, summary: 'Chuyển khoản QR (demo)' },
]

function ReadOnly({ label, value, className }) {
  return (
    <div className={className}>
      <div className="field-label">{label}</div>
      <input readOnly value={value} tabIndex={-1} aria-readonly="true" className="field-input cursor-not-allowed bg-paper-2 font-mono text-[14px] text-muted" />
    </div>
  )
}

function StepHead({ n, title, done, onEdit, active }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className={cn('font-sans text-[16px] font-semibold', !active && !done && 'text-faint')}>
        {n}. {title} {done && <Check size={16} className="ml-1 inline text-pos" />}
      </h2>
      {done && onEdit && <button onClick={onEdit} className="font-sans text-[13px] font-semibold underline">Sửa</button>}
    </div>
  )
}

export default function CheckoutPage() {
  useTitle('Thanh toán')
  const [sp] = useSearchParams()
  const plan = PLANS[sp.get('goi')] || PLANS.all
  const user = useCurrentUser()
  const { subscribe, logout } = useUser()
  const nav = useNavigate()
  const [step, setStep] = useState(2)
  const [method, setMethod] = useState('card')
  const [agree, setAgree] = useState(false)
  const day7 = new Date(Date.now() + 7 * 86400000)
  const after = new Date(Date.now() + 365 * 86400000)
  const self = `/thanh-toan?goi=${plan.id}`
  const active = user?.subscription && user.subscription.status !== 'canceled'

  const finish = () => {
    subscribe(plan.id, METHODS.find((m) => m.id === method).summary)
    toast('Bắt đầu 7 ngày dùng thử. Chúc bạn đọc vui!')
    nav(`/cam-on?goi=${plan.id}`, { replace: true })
  }

  const summary = (
    <aside className="bg-paper-2 px-5 py-6 font-sans sm:px-8 lg:min-h-full lg:py-12">
      <div className="kicker text-muted">Tóm tắt đơn hàng</div>
      <div className="mt-3 font-serif text-[20px] font-bold">Gói {plan.name}</div>
      <p className="mt-1 text-[13px] text-muted">{plan.desc}</p>
      <dl className="mt-5 space-y-2 border-t border-rule pt-4 text-[14px]">
        <div className="flex justify-between"><dt>Giá ưu đãi</dt><dd>{perWeek(plan.intro)}</dd></div>
        <div className="flex justify-between text-muted"><dt>Thanh toán mỗi 4 tuần</dt><dd>{(plan.intro * 4).toLocaleString('vi-VN')}₫</dd></div>
        <div className="flex justify-between border-t border-rule pt-3 font-semibold"><dt>Thanh toán hôm nay</dt><dd className="text-pos">0₫</dd></div>
      </dl>
      <ul className="mt-5 space-y-2 text-[12.5px] text-muted">
        <li>• Miễn phí đến hết {shortDate(day7)}.</li>
        <li>• Từ {shortDate(day7)}: {perWeek(plan.intro)} trong 12 tháng.</li>
        <li>• Từ {shortDate(after)}: {perMonth(plan.price)}.</li>
      </ul>
      <Link to="/goi-doc" className="mt-5 inline-block text-[13px] underline">Đổi gói</Link>
    </aside>
  )

  return (
    <div className="lg:grid lg:min-h-[calc(100dvh-56px-61px)] lg:grid-cols-[1fr_400px]">
      <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
        <div className="mb-6 flex items-center gap-3"><Wordmark size="sm" /><span className="font-sans text-[13px] text-muted">/ Thanh toán</span></div>
        <h1 className="font-serif text-[30px] font-semibold">Thanh toán</h1>
        <DemoNote className="mt-4"><b>Bản demo: không có giao dịch thật.</b> Trang này không thu thập thông tin thẻ hay tài khoản ngân hàng; các trường thẻ chỉ là dữ liệu thử nghiệm cố định.</DemoNote>

        {active && (
          <div className="mt-6 rounded border border-rule p-4 font-sans text-[14px]">
            Bạn đã có gói <b>{PLANS[user.subscription.plan].name}</b>. <Link to="/tai-khoan/goi" className="underline">Quản lý gói của bạn</Link>
          </div>
        )}

        {/* 1. Tài khoản */}
        <section className="mt-8 border-b border-rule pb-6">
          <StepHead n={1} title="Tài khoản" done={!!user} active />
          {user ? (
            <div className="mt-2 flex items-center justify-between font-sans text-[14px] text-muted">
              <span className="truncate">{user.email}</span>
              <button onClick={() => { logout(); nav(`/dang-nhap?next=${encodeURIComponent(self)}`) }} className="ml-3 shrink-0 text-[13px] font-semibold text-ink underline">Đổi tài khoản</button>
            </div>
          ) : (
            <div className="mt-3 font-sans text-[14px]">
              <p className="text-muted">Bạn cần đăng nhập hoặc tạo tài khoản miễn phí để tiếp tục.</p>
              <Link to={`/dang-nhap?next=${encodeURIComponent(self)}`} className="btn btn-ink mt-3">Đăng nhập / Tạo tài khoản</Link>
            </div>
          )}
        </section>

        {/* 2. Thanh toán */}
        <section className="border-b border-rule py-6">
          <StepHead n={2} title="Phương thức thanh toán" active={!!user && step === 2} done={!!user && step === 3} onEdit={() => setStep(2)} />
          {user && step === 2 && (
            <div className="mt-4">
              <p className="mb-4 font-sans text-[13px] text-muted">Bạn sẽ không bị tính phí trong thời gian dùng thử.</p>
              <div className="divide-y divide-rule rounded border border-rule">
                {METHODS.map((m) => (
                  <div key={m.id} className="p-4">
                    <Radio name="method" checked={method === m.id} onChange={() => setMethod(m.id)}>
                      <span className="flex items-center gap-2 font-sans font-medium"><m.icon size={17} /> {m.label}</span>
                    </Radio>
                    {method === m.id && m.id === 'card' && (
                      <div className="mt-4 grid grid-cols-2 gap-3 pl-7">
                        <ReadOnly label="Số thẻ thử nghiệm" value="4242 4242 4242 4242" className="col-span-2" />
                        <ReadOnly label="Hết hạn" value="12/30" />
                        <ReadOnly label="CVC" value="123" />
                        <p className="col-span-2 font-sans text-[12px] text-muted">Thẻ thử nghiệm cố định, không thể chỉnh sửa. Không nhập thẻ thật ở bất kỳ trang demo nào.</p>
                      </div>
                    )}
                    {method === m.id && m.id === 'wallet' && (
                      <p className="mt-3 pl-7 font-sans text-[13px] text-muted">Ở sản phẩm thật, bạn sẽ được chuyển sang ứng dụng ví để xác nhận. Bản demo bỏ qua bước này.</p>
                    )}
                    {method === m.id && m.id === 'qr' && (
                      <div className="mt-3 flex items-center gap-4 pl-7">
                        <DemoQR seed={`qr-${plan.id}`} size={96} />
                        <p className="font-sans text-[13px] text-muted">Mã QR minh hoạ, không chứa thông tin tài khoản nhận tiền.</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(3)} className="btn btn-ink mt-5 w-full">Tiếp tục</button>
              <p className="mt-3 flex items-center justify-center gap-1.5 font-sans text-[12px] text-muted"><Lock size={13} /> Biểu mẫu demo — không có dữ liệu nào được gửi đi</p>
            </div>
          )}
          {user && step === 3 && <div className="mt-2 font-sans text-[14px] text-muted">{METHODS.find((m) => m.id === method).summary}</div>}
        </section>

        {/* 3. Xem lại */}
        <section className="py-6">
          <StepHead n={3} title="Xem lại và xác nhận" active={!!user && step === 3} />
          {user && step === 3 && (
            <div className="mt-4 font-sans">
              <div className="rounded border border-rule p-4 text-[14px]">
                <div className="font-semibold">Gói {plan.name} — dùng thử 7 ngày</div>
                <div className="mt-2 flex justify-between text-muted"><span>Hôm nay</span><span>0₫</span></div>
                <div className="flex justify-between text-muted"><span>{shortDate(day7)}</span><span>{(plan.intro * 4).toLocaleString('vi-VN')}₫ / 4 tuần</span></div>
                <div className="flex justify-between text-muted"><span>{shortDate(after)}</span><span>{perMonth(plan.price)}</span></div>
              </div>
              <div className="mt-4 rounded bg-paper-2 p-4 text-[12.5px] leading-relaxed text-ink-2">
                <div className="mb-1 font-semibold">Điều khoản tự động gia hạn</div>
                Nếu bạn không huỷ trước {shortDate(day7)}, gói sẽ tự động chuyển sang trả phí và gia hạn mỗi 4 tuần với giá {perWeek(plan.intro)} trong 12 tháng,
                sau đó {perMonth(plan.price)} cho đến khi bạn huỷ. Bạn có thể huỷ bất cứ lúc nào trong mục Tài khoản; quyền truy cập kéo dài đến hết kỳ đã thanh toán.
                Giá có thể thay đổi và sẽ được thông báo trước.
              </div>
              <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-[13px]">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 size-4 accent-[var(--c-ink)]" />
                Tôi đã đọc và đồng ý với điều khoản tự động gia hạn.
              </label>
              <button onClick={finish} disabled={!agree} className="btn btn-son mt-5 w-full py-4">Bắt đầu dùng thử miễn phí</button>
            </div>
          )}
        </section>
      </div>
      {summary}
    </div>
  )
}
