/* Quên mật khẩu: email → mã xác minh → mật khẩu mới → xong */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CircleCheck } from 'lucide-react'
import { Field, PasswordField, useTitle } from '@/components/ui'
import { useUser, toast } from '@/store'
import { AuthShell, DemoNote, isEmail } from '@/features/account/shared'

export default function ForgotPage() {
  useTitle('Đặt lại mật khẩu')
  const nav = useNavigate()
  const { exists, resetPassword, pendingEmail } = useUser()
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState(pendingEmail || '')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')

  const send = (e) => {
    e?.preventDefault()
    if (!isEmail(email)) return setErr('Vui lòng nhập một địa chỉ email hợp lệ.')
    if (!exists(email)) return setErr('Không tìm thấy tài khoản với email này.')
    setSent(String(Math.floor(100000 + Math.random() * 900000)))
    setCode('')
    setErr('')
    setStep('code')
  }
  const verify = (e) => {
    e.preventDefault()
    if (code !== sent) return setErr('Mã xác minh chưa đúng.')
    setErr('')
    setStep('password')
  }
  const save = (e) => {
    e.preventDefault()
    if (pw.length < 8) return setErr('Mật khẩu cần có ít nhất 8 ký tự.')
    resetPassword(email, pw)
    setStep('done')
  }

  if (step === 'done') {
    return (
      <AuthShell>
        <div className="text-center">
          <CircleCheck size={44} className="mx-auto text-pos" strokeWidth={1.5} />
          <h1 className="mt-4 font-serif text-[26px] font-semibold">Đăng nhập đã được cập nhật</h1>
          <p className="mt-2 font-sans text-[14px] text-muted">Mật khẩu mới đã được lưu và bạn đã được đăng nhập.</p>
          <button onClick={() => { toast('Mật khẩu đã được đổi.'); nav('/', { replace: true }) }} className="btn btn-ink mt-6 w-full">Tiếp tục</button>
        </div>
      </AuthShell>
    )
  }
  if (step === 'password') {
    return (
      <AuthShell title="Đặt mật khẩu mới" sub={`Email ${email} đã được xác minh. Hãy chọn mật khẩu mới, bạn sẽ được đăng nhập ngay.`}>
        <form onSubmit={save}>
          <PasswordField label="Mật khẩu mới" name="new-password" autoComplete="new-password" autoFocus value={pw} onChange={(e) => { setPw(e.target.value); setErr('') }} error={err} hint="Ít nhất 8 ký tự." />
          <button className="btn btn-ink mt-5 w-full" disabled={!pw}>Lưu mật khẩu</button>
        </form>
      </AuthShell>
    )
  }
  if (step === 'code') {
    return (
      <AuthShell title="Kiểm tra email để đặt lại mật khẩu" sub={`Nhập mã chúng tôi đã gửi tới ${email}. Mã hết hạn sau 10 phút.`}>
        <DemoNote className="mb-5">Bản demo không gửi email thật. Mã xác minh của bạn là <b className="font-mono tracking-widest text-ink">{sent}</b>.</DemoNote>
        <form onSubmit={verify}>
          <Field label="Mã xác minh" name="code" inputMode="numeric" maxLength={6} autoFocus value={code} onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setErr('') }} error={err} />
          <button className="btn btn-ink mt-4 w-full" disabled={code.length !== 6}>Xác nhận</button>
        </form>
        <p className="mt-5 text-center font-sans text-[13px] text-muted">
          Không nhận được mã? Kiểm tra thư rác hoặc <button onClick={send} className="underline">gửi lại mã</button>.
        </p>
      </AuthShell>
    )
  }
  return (
    <AuthShell title="Quên mật khẩu?" sub="Nhập email của tài khoản, chúng tôi sẽ gửi mã để bạn đặt lại mật khẩu.">
      <form onSubmit={send} noValidate>
        <Field label="Địa chỉ email" name="email" type="email" autoComplete="email" autoFocus value={email} onChange={(e) => { setEmail(e.target.value); setErr('') }} error={err} />
        <button className="btn btn-ink mt-4 w-full">Gửi mã</button>
      </form>
      <Link to="/dang-nhap" className="mt-5 block text-center font-sans text-[13px] underline">Quay lại đăng nhập</Link>
    </AuthShell>
  )
}
