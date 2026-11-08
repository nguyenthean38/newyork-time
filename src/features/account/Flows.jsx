/* Luồng xoá tài khoản và huỷ gói */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MessageCircle, Phone, CircleCheck } from 'lucide-react'
import { Checkbox, Radio } from '@/components/ui'
import { PLANS, useUser, toast } from '@/store'
import { shortDate } from '@/lib/format'
import { FocusPage } from './AccountShell'
import { BackLink, perWeek } from './shared'
import { cn } from '@/lib/cn'

/** Đánh dấu đang rời trang sau khi xoá, để trang tài khoản không chuyển hướng về đăng nhập. */
export const leaving = { current: false }

/* ---------- Xoá tài khoản ---------- */
export function DeleteFlow({ user }) {
  const del = useUser((s) => s.deleteAccount)
  const nav = useNavigate()
  const [reason, setReason] = useState('')
  const [ok, setOk] = useState(false)
  const [busy, setBusy] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    setBusy(true)
    setTimeout(() => {
      // Rời trang trước rồi mới xoá, tránh bị chuyển hướng về trang đăng nhập
      leaving.current = true
      nav('/', { replace: true })
      setTimeout(() => { del(); toast('Tài khoản của bạn đã được xoá.') }, 0)
      setTimeout(() => { leaving.current = false }, 3000)
    }, 700)
  }
  return (
    <FocusPage title="Xoá tài khoản">
      <form onSubmit={submit} className="font-sans text-[14px] leading-relaxed">
        <p><b>Tài khoản Tân Thời sẽ bị xoá:</b><br /><span className="text-muted">{user.email}</span></p>
        <p className="mt-4">Bạn sẽ mất vĩnh viễn mọi lịch sử gắn với tài khoản, gồm danh sách đọc, thống kê trò chơi, bản tin và bình luận. <b>Không thể hoàn tác.</b></p>
        <div className="mt-4 rounded bg-paper-2 p-4">
          <div className="font-semibold">Điều gì sẽ xảy ra</div>
          <p className="mt-1 text-[13px] text-muted">
            Sau khi xoá, bạn không đăng nhập được vào Tin tức, Trò chơi, Ẩm thực hay ứng dụng.
            {user.subscription && user.subscription.status !== 'canceled' && ' Gói đọc hiện tại sẽ bị huỷ ngay lập tức.'}
          </p>
        </div>
        <label htmlFor="reason" className="field-label mt-6">Cho chúng tôi biết lý do bạn xoá tài khoản (không bắt buộc)</label>
        <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={500} rows={4} className="field-input h-auto py-2.5" />
        <div className="mt-1 text-right text-[12px] text-muted">Còn {500 - reason.length} ký tự</div>
        <Checkbox checked={ok} onChange={setOk} className="mt-3">Tôi xác nhận muốn xoá tài khoản Tân Thời của mình.</Checkbox>
        <div className="mt-6 flex items-center gap-4">
          <button disabled={!ok || busy} className="btn btn-ink">{busy ? 'Đang xoá…' : 'Xoá tài khoản'}</button>
          <BackLink>Quay lại tài khoản</BackLink>
        </div>
      </form>
    </FocusPage>
  )
}

/* ---------- Huỷ gói ---------- */
const REASONS = [
  ['khong-dung', 'Tôi không dùng nhiều'],
  ['dat', 'Gói quá đắt so với nhu cầu'],
  ['truy-cap', 'Tôi gặp khó khăn khi truy cập một số phần'],
  ['cach-khac', 'Tôi đọc tin bằng cách khác'],
  ['noi-dung', 'Tôi không hài lòng với nội dung'],
  ['khac', 'Lý do khác'],
]

export function CancelFlow({ user }) {
  const { cancelSubscription, changePlan } = useUser()
  const nav = useNavigate()
  const sub = user.subscription
  const [step, setStep] = useState('options')
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')

  if (!sub || (sub.status === 'canceled' && step !== 'done')) {
    return (
      <FocusPage title="Không có gói để huỷ" sub={sub ? 'Gói của bạn đã được huỷ trước đó.' : 'Bạn chưa đăng ký gói đọc nào.'}>
        <BackLink to="/tai-khoan/goi">Về trang gói của bạn</BackLink>
      </FocusPage>
    )
  }
  const plan = PLANS[sub.plan]
  const daysLeft = Math.max(0, Math.ceil((sub.trialEnds - Date.now()) / 86400000))

  if (step === 'options') {
    return (
      <FocusPage title={`Có nhiều cách để huỷ gói ${plan.name}`} sub="Xin lưu ý: sau khi huỷ, bạn chỉ còn truy cập giới hạn khi hết kỳ hiện tại.">
        <div className="space-y-6 font-sans text-[14px]">
          <div>
            <div className="flex items-center gap-2 font-semibold"><MessageCircle size={16} /> Trò chuyện với nhân viên chăm sóc</div>
            <p className="mt-1 text-muted">8:00 – 20:00 hằng ngày. (Bản demo: không có nhân viên thật.)</p>
          </div>
          <div>
            <div className="font-semibold">Huỷ trực tuyến</div>
            <p className="mt-1 text-muted">Tự huỷ gói ngay, không cần liên hệ ai.</p>
            <button onClick={() => setStep('reason')} className="btn btn-ink btn-sm mt-3">Huỷ trực tuyến</button>
          </div>
          <div>
            <div className="flex items-center gap-2 font-semibold"><Phone size={16} /> Gọi điện</div>
            <p className="mt-1 text-muted">Tổng đài minh hoạ 1900 0000 (không có thật), 8:00 – 17:00 từ Thứ Hai đến Thứ Sáu.</p>
          </div>
          <BackLink to="/tai-khoan/goi">Giữ gói của tôi</BackLink>
        </div>
      </FocusPage>
    )
  }

  if (step === 'reason') {
    return (
      <FocusPage title={`Vì sao bạn muốn huỷ gói ${plan.name}?`}>
        <div className="space-y-2 font-sans">
          {REASONS.map(([id, label]) => (
            <div key={id} className={cn('rounded border p-3.5', reason === id ? 'border-ink' : 'border-rule')}>
              <Radio name="reason" checked={reason === id} onChange={() => setReason(id)}>{label}</Radio>
              {reason === id && id === 'khong-dung' && sub.plan !== 'news' && (
                <div className="mt-3 rounded bg-paper-2 p-3 pl-4 text-[13px]">
                  Gói <b>Tin tức</b> có thể hợp với bạn hơn: chỉ {perWeek(PLANS.news.intro)}, vẫn đọc không giới hạn.
                  <button onClick={() => { changePlan('news'); toast('Đã chuyển sang gói Tin tức.'); nav('/tai-khoan/goi') }} className="btn btn-line btn-sm mt-3 block">Chuyển gói</button>
                </div>
              )}
              {reason === id && id === 'dat' && (
                <div className="mt-3 rounded bg-paper-2 p-3 pl-4 text-[13px]">Ưu đãi giữ chân (minh hoạ): giảm 50% trong 3 tháng tới nếu bạn ở lại.
                  <button onClick={() => { toast('Đã áp dụng ưu đãi giảm 50% (mô phỏng).'); nav('/tai-khoan/goi') }} className="btn btn-line btn-sm mt-3 block">Nhận ưu đãi</button>
                </div>
              )}
            </div>
          ))}
          <label htmlFor="note" className="field-label pt-4">Trước khi tiếp tục, bạn có muốn góp ý thêm cho chúng tôi?</label>
          <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={500} className="field-input h-auto py-2.5" />
          <div className="text-right text-[12px] text-muted">Còn {500 - note.length} ký tự</div>
          <div className="flex items-center justify-between pt-2">
            <BackLink to="/tai-khoan/goi">Giữ gói</BackLink>
            <button disabled={!reason} onClick={() => setStep('confirm')} className="btn btn-ink">Tiếp tục</button>
          </div>
        </div>
      </FocusPage>
    )
  }

  if (step === 'confirm') {
    return (
      <FocusPage title={`Bạn còn ${daysLeft} ngày dùng thử, sau đó gói sẽ chuyển sang giá ưu đãi.`} sub={`Bạn đang ở giữa kỳ dùng thử gói ${plan.name}, miễn phí đến ${shortDate(new Date(sub.trialEnds))}.`}>
        <div className="rounded border border-rule p-4 font-sans">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[15px] font-semibold">{plan.name}</div>
              <p className="mt-1 text-[13px] text-muted">{plan.desc}</p>
            </div>
            <div className="shrink-0 text-right text-[13px]"><b>Miễn phí đến</b><br />{shortDate(new Date(sub.trialEnds))}</div>
          </div>
          <button onClick={() => { toast('Tuyệt! Gói của bạn được giữ nguyên.'); nav('/tai-khoan/goi') }} className="btn btn-ink btn-sm mt-4 w-full">Giữ gói của tôi</button>
        </div>
        <p className="mt-4 font-sans text-[12.5px] leading-relaxed text-muted">Khi huỷ, bạn vẫn truy cập được đến hết thời gian dùng thử và sẽ không bị tính phí.</p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <BackLink to="/tai-khoan">Về tài khoản</BackLink>
          <button onClick={() => { cancelSubscription(REASONS.find((r) => r[0] === reason)?.[1]); setStep('done') }} className="btn btn-line">Xác nhận huỷ</button>
        </div>
      </FocusPage>
    )
  }

  return (
    <FocusPage title={`Bạn đã huỷ gói ${plan.name}`}>
      <CircleCheck size={40} className="text-pos" strokeWidth={1.5} />
      <p className="mt-3 font-sans text-[14px] text-muted">Chúng tôi đã gửi email xác nhận tới {user.email} (mô phỏng). Bạn vẫn truy cập đầy đủ đến hết {shortDate(new Date(sub.trialEnds))} và có thể tiếp tục gói bất cứ lúc nào.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/tai-khoan/goi" className="btn btn-ink">Xem gói của bạn</Link>
        <Link to="/" className="btn btn-line">Về trang nhất</Link>
      </div>
    </FocusPage>
  )
}
