/* Đăng nhập / tạo tài khoản: bước email → mật khẩu hoặc tạo mới */
import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Apple, Mail, Check } from 'lucide-react'
import { Field, PasswordField, Checkbox, Modal, useTitle } from '@/components/ui'
import { useUser, toast } from '@/store'
import { AuthShell, DemoNote, Divider, Terms, isEmail } from '@/features/account/shared'
import { cn } from '@/lib/cn'

/* Chữ G đơn sắc trung tính — không dùng logo nhiều màu của Google */
function GoogleGlyph() {
  return <span className="flex size-5 items-center justify-center rounded-full border border-current font-sans text-[11px] font-bold">G</span>
}

function strength(pw) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

const SOCIAL_EMAIL = { google: 'ban.doc.demo@gmail.com', apple: 'ban.doc.demo@icloud.com' }

export default function LoginPage() {
  const [sp] = useSearchParams()
  const next = sp.get('next') || '/'
  const nav = useNavigate()
  const { exists, login, signup, socialLogin, loginDirect, setPending, pendingEmail } = useUser()
  const [step, setStep] = useState('email') // email | password | create | otp
  const [email, setEmail] = useState(pendingEmail || '')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [marketing, setMarketing] = useState(false)
  const [social, setSocial] = useState(null)
  const [otp, setOtp] = useState('')
  const [code, setCode] = useState('')
  useTitle(step === 'create' ? 'Tạo tài khoản' : 'Đăng nhập')

  const go = (to) => nav(to, { replace: true })

  const submitEmail = (e) => {
    e.preventDefault()
    if (!isEmail(email)) return setErr('Vui lòng nhập một địa chỉ email hợp lệ.')
    setErr('')
    setPending(email.trim().toLowerCase())
    setStep(exists(email) ? 'password' : 'create')
  }
  const submitLogin = (e) => {
    e.preventDefault()
    const r = login(email, pw)
    if (!r.ok) return setErr(r.error)
    toast('Đăng nhập thành công. Chào mừng bạn trở lại!')
    go(next)
  }
  const submitCreate = (e) => {
    e.preventDefault()
    if (pw.length < 8) return setErr('Mật khẩu cần có ít nhất 8 ký tự.')
    signup(email, pw, marketing)
    toast('Tài khoản của bạn đã được tạo.')
    go(`/chao-mung?next=${encodeURIComponent(next)}`)
  }
  const sendOtp = () => {
    setOtp(String(Math.floor(100000 + Math.random() * 900000)))
    setCode('')
    setErr('')
    setStep('otp')
  }
  const submitOtp = (e) => {
    e.preventDefault()
    if (code.trim() !== otp) return setErr('Mã chưa đúng. Hãy kiểm tra lại.')
    loginDirect(email)
    toast('Đăng nhập thành công bằng mã một lần.')
    go(next)
  }
  const confirmSocial = () => {
    const isNew = !exists(SOCIAL_EMAIL[social])
    socialLogin(social)
    toast(`Đã đăng nhập bằng tài khoản ${social === 'google' ? 'Google' : 'Apple'} mô phỏng.`)
    setSocial(null)
    go(isNew ? `/chao-mung?next=${encodeURIComponent(next)}` : next)
  }

  const st = useMemo(() => strength(pw), [pw])
  const emailRow = (
    <div className="mb-4">
      <div className="field-label">Địa chỉ email</div>
      <div className="flex h-11 items-center justify-between rounded-[3px] border border-rule bg-paper-2 px-3 font-sans text-[14px] text-muted">
        <span className="truncate">{email}</span>
        <button type="button" onClick={() => { setStep('email'); setPw(''); setErr('') }} className="ml-3 shrink-0 text-[13px] font-semibold text-ink underline">Sửa</button>
      </div>
    </div>
  )

  return (
    <>
      {step === 'email' && (
        <AuthShell title="Đăng nhập hoặc tạo tài khoản" sub="Một tài khoản cho tin tức, trò chơi, ẩm thực và podcast của Tân Thời.">
          <form onSubmit={submitEmail} noValidate>
            <Field label="Địa chỉ email" name="email" type="email" autoComplete="email" autoFocus value={email} onChange={(e) => { setEmail(e.target.value); setErr('') }} error={err} placeholder="ten@vidu.com" />
            <button className="btn btn-ink mt-4 w-full">Tiếp tục</button>
          </form>
          <Terms />
          <Divider />
          <div className="space-y-2.5">
            <button onClick={() => setSocial('google')} className="btn btn-line w-full"><GoogleGlyph /> Tiếp tục với Google</button>
            <button onClick={() => setSocial('apple')} className="btn btn-line w-full"><Apple size={18} /> Tiếp tục với Apple</button>
          </div>
          <p className="mt-6 text-center font-sans text-[13px]">
            Chưa sẵn sàng? <Link to="/goi-doc" className="font-semibold underline">Xem các gói đọc</Link>
          </p>
        </AuthShell>
      )}

      {step === 'password' && (
        <AuthShell title="Chào mừng trở lại" sub="Nhập mật khẩu để đăng nhập.">
          <form onSubmit={submitLogin}>
            {emailRow}
            <PasswordField name="password" autoFocus value={pw} onChange={(e) => { setPw(e.target.value); setErr('') }} error={err} />
            <Link to="/quen-mat-khau" className="mt-2 inline-block font-sans text-[13px] underline">Quên mật khẩu?</Link>
            <button className="btn btn-ink mt-5 w-full" disabled={!pw}>Đăng nhập</button>
          </form>
          <button onClick={sendOtp} className="btn btn-line mt-3 w-full"><Mail size={16} /> Gửi mã đăng nhập một lần</button>
        </AuthShell>
      )}

      {step === 'otp' && (
        <AuthShell title="Nhập mã đăng nhập" sub={`Chúng tôi đã gửi mã 6 chữ số tới ${email}. Mã có hiệu lực trong 10 phút.`}>
          <DemoNote className="mb-5">Bản demo không gửi email thật. Mã của bạn là <b className="font-mono tracking-widest text-ink">{otp}</b>.</DemoNote>
          <form onSubmit={submitOtp}>
            <Field label="Mã xác minh" name="otp" inputMode="numeric" maxLength={6} autoFocus value={code} onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setErr('') }} error={err} />
            <button className="btn btn-ink mt-4 w-full" disabled={code.length !== 6}>Đăng nhập</button>
          </form>
          <button onClick={sendOtp} className="mt-4 block w-full text-center font-sans text-[13px] underline">Gửi lại mã</button>
          <button onClick={() => setStep('password')} className="mt-2 block w-full text-center font-sans text-[13px] text-muted underline">Dùng mật khẩu</button>
        </AuthShell>
      )}

      {step === 'create' && (
        <AuthShell title="Tạo tài khoản miễn phí" sub="Chỉ cần một mật khẩu là xong.">
          <form onSubmit={submitCreate}>
            {emailRow}
            <PasswordField name="new-password" autoComplete="new-password" autoFocus value={pw} onChange={(e) => { setPw(e.target.value); setErr('') }} error={err} />
            <div className="mt-2 flex gap-1" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={cn('h-1 flex-1 rounded-full', i < st ? (st < 2 ? 'bg-son' : st < 3 ? 'bg-near' : 'bg-hit') : 'bg-rule')} />
              ))}
            </div>
            <p className={cn('mt-1.5 flex items-center gap-1 font-sans text-[12px]', pw.length >= 8 ? 'text-pos' : 'text-muted')}>
              {pw.length >= 8 && <Check size={13} />} Ít nhất 8 ký tự{pw && ` · Độ mạnh: ${['rất yếu', 'yếu', 'khá', 'mạnh', 'rất mạnh'][st]}`}
            </p>
            <Checkbox checked={marketing} onChange={setMarketing} className="mt-4">
              Tôi muốn nhận thông tin cập nhật và ưu đãi từ Tân Thời. Có thể huỷ bất cứ lúc nào.
            </Checkbox>
            <Terms />
            <button className="btn btn-ink mt-4 w-full" disabled={!pw}>Tạo tài khoản</button>
          </form>
        </AuthShell>
      )}

      <Modal open={!!social} onClose={() => setSocial(null)} title={`Tiếp tục với ${social === 'google' ? 'Google' : 'Apple'}`}>
        <DemoNote>
          Đây là bản demo nên <b>không có kết nối thật</b> tới {social === 'google' ? 'Google' : 'Apple'}. Bấm "Tiếp tục" để đăng nhập bằng một tài khoản mô phỏng
          ({SOCIAL_EMAIL[social]}). Không có dữ liệu nào được gửi đi.
        </DemoNote>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={() => setSocial(null)} className="btn btn-line btn-sm">Huỷ</button>
          <button onClick={confirmSocial} className="btn btn-ink btn-sm">Tiếp tục</button>
        </div>
      </Modal>
    </>
  )
}
