/* Các trang chỉnh sửa tập trung: tên, tên người dùng, ảnh đại diện, email, mật khẩu, địa điểm */
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X, MapPin } from 'lucide-react'
import { Field, PasswordField, Avatar } from '@/components/ui'
import { useUser, toast } from '@/store'
import { unaccent } from '@/lib/format'
import { CITIES } from './cities'
import { FocusPage } from './AccountShell'
import { BackLink, ICON_COLORS, isEmail } from './shared'
import { cn } from '@/lib/cn'

function useDone() {
  const nav = useNavigate()
  return (msg) => { toast(msg); nav('/tai-khoan') }
}

function Actions({ disabled, label = 'Lưu' }) {
  return (
    <div className="mt-6 flex items-center gap-4">
      <button disabled={disabled} className="btn btn-ink">{label}</button>
      <BackLink>Huỷ</BackLink>
    </div>
  )
}

export function NameEdit({ user }) {
  const update = useUser((s) => s.update)
  const done = useDone()
  const [last, setLast] = useState(user.lastName)
  const [first, setFirst] = useState(user.firstName)
  const dirty = last.trim() !== user.lastName || first.trim() !== user.firstName
  return (
    <FocusPage title="Họ và tên" sub="Tân Thời sẽ gọi bạn bằng tên này trong lời chào và email.">
      <form onSubmit={(e) => { e.preventDefault(); update({ lastName: last.trim(), firstName: first.trim() }); done('Đã cập nhật họ tên.') }}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Họ" name="lastName" autoComplete="family-name" value={last} onChange={(e) => setLast(e.target.value)} maxLength={40} />
          <Field label="Tên" name="firstName" autoComplete="given-name" value={first} onChange={(e) => setFirst(e.target.value)} maxLength={30} />
        </div>
        <Actions disabled={!dirty || !first.trim()} />
      </form>
    </FocusPage>
  )
}

export function UsernameEdit({ user }) {
  const update = useUser((s) => s.update)
  const done = useDone()
  const [v, setV] = useState(user.username)
  const clean = v.trim().toLowerCase()
  const err = clean && !/^[a-z0-9._]{3,24}$/.test(clean) ? 'Từ 3–24 ký tự: chữ không dấu, số, dấu chấm hoặc gạch dưới.' : ''
  return (
    <FocusPage title="Tên người dùng" sub="Người khác sẽ thấy tên này khi bạn bình luận hoặc chia sẻ kết quả trò chơi.">
      <form onSubmit={(e) => { e.preventDefault(); if (err) return; update({ username: clean }); done('Đã cập nhật tên người dùng.') }}>
        <Field label="Tên người dùng" name="username" value={v} onChange={(e) => setV(e.target.value)} error={err} hint="Ví dụ: ban.doc_hanoi" autoCapitalize="off" />
        <Actions disabled={!clean || !!err || clean === user.username} />
      </form>
    </FocusPage>
  )
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').concat(['Đ'])

export function IconEdit({ user }) {
  const update = useUser((s) => s.update)
  const done = useDone()
  const [tab, setTab] = useState('letter')
  const [letter, setLetter] = useState(user.icon?.value || 'A')
  const [color, setColor] = useState(user.icon?.color || ICON_COLORS[0])
  const dirty = letter !== user.icon?.value || color !== user.icon?.color
  return (
    <FocusPage title="Ảnh đại diện" sub="Chọn một chữ cái và một màu. Ảnh đại diện hiện cạnh bình luận và trong tài khoản của bạn.">
      <div className="mb-5 flex items-center gap-4">
        <Avatar icon={{ value: letter, color }} size={64} />
        <span className="font-sans text-[13px] text-muted">Xem trước</span>
      </div>
      <div role="tablist" className="mb-4 flex gap-5 border-b border-rule font-sans text-[14px]">
        {[['letter', 'Chữ cái'], ['color', 'Màu']].map(([id, l]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={cn('-mb-px border-b-2 pb-2', tab === id ? 'border-ink font-semibold' : 'border-transparent text-muted')}>{l}</button>
        ))}
      </div>
      {tab === 'letter' ? (
        <div className="grid grid-cols-6 gap-2.5 sm:grid-cols-7">
          {LETTERS.map((l, i) => (
            <button key={l} onClick={() => setLetter(l)} aria-label={`Chữ ${l}`} aria-pressed={letter === l} className={cn('flex aspect-square items-center justify-center rounded-full font-serif text-[17px] font-bold text-[#222] ring-offset-2 ring-offset-paper transition', letter === l ? 'ring-2 ring-ink' : 'hover:scale-105')} style={{ background: ICON_COLORS[i % ICON_COLORS.length] }}>
              {l}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {ICON_COLORS.map((c) => (
            <button key={c} onClick={() => setColor(c)} aria-label={`Màu ${c}`} aria-pressed={color === c} className={cn('flex size-12 items-center justify-center rounded-full font-serif text-[18px] font-bold text-[#222] ring-offset-2 ring-offset-paper', color === c && 'ring-2 ring-ink')} style={{ background: c }}>
              {letter}
            </button>
          ))}
        </div>
      )}
      <form onSubmit={(e) => { e.preventDefault(); update({ icon: { kind: 'letter', value: letter, color } }); done('Đã cập nhật ảnh đại diện.') }}>
        <Actions disabled={!dirty} label="Lưu và hoàn tất" />
      </form>
    </FocusPage>
  )
}

export function EmailEdit({ user }) {
  const changeEmail = useUser((s) => s.changeEmail)
  const done = useDone()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (!isEmail(email)) return setErr('Vui lòng nhập một địa chỉ email hợp lệ.')
    const r = changeEmail(email, pw)
    if (!r.ok) return setErr(r.error)
    done(`Email đã được đổi. Từ giờ hãy đăng nhập bằng ${email.trim().toLowerCase()}.`)
  }
  return (
    <FocusPage title="Đổi email" sub={`Bạn đang đăng nhập bằng ${user.email}. Bản tin và thông báo sẽ được gửi tới email mới.`}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field label="Email mới" name="email" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setErr('') }} />
        {user.password && <PasswordField label="Mật khẩu hiện tại" name="password" value={pw} onChange={(e) => { setPw(e.target.value); setErr('') }} />}
        {err && <p className="font-sans text-[13px] text-son">{err}</p>}
        <div className="flex items-center justify-between">
          <Actions disabled={!email || (user.password && !pw)} />
          {user.password && <Link to="/quen-mat-khau" className="mt-6 font-sans text-[13px] underline">Quên mật khẩu?</Link>}
        </div>
      </form>
    </FocusPage>
  )
}

export function PasswordEdit({ user }) {
  const changePassword = useUser((s) => s.changePassword)
  const done = useDone()
  const [oldPw, setOld] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (pw.length < 8) return setErr('Mật khẩu mới cần ít nhất 8 ký tự.')
    const r = changePassword(oldPw, pw)
    if (!r.ok) return setErr(r.error)
    done('Đã cập nhật mật khẩu.')
  }
  return (
    <FocusPage title={user.password ? 'Đổi mật khẩu' : 'Tạo mật khẩu'} sub="Dùng mật khẩu bạn chưa dùng ở trang nào khác.">
      <form onSubmit={submit} className="space-y-4">
        {user.password && <PasswordField label="Mật khẩu hiện tại" name="current" value={oldPw} onChange={(e) => { setOld(e.target.value); setErr('') }} />}
        <PasswordField label="Mật khẩu mới" name="new-password" autoComplete="new-password" value={pw} onChange={(e) => { setPw(e.target.value); setErr('') }} hint="Ít nhất 8 ký tự." />
        {err && <p className="font-sans text-[13px] text-son">{err}</p>}
        <Actions disabled={!pw || (user.password && !oldPw)} />
      </form>
    </FocusPage>
  )
}

export function PlacesEdit({ user }) {
  const { addPlace, removePlace } = useUser()
  const [q, setQ] = useState('')
  const matches = useMemo(() => {
    const t = unaccent(q.trim().toLowerCase())
    if (!t) return []
    return CITIES.filter((c) => unaccent(c.label.toLowerCase()).includes(t) && !user.places.includes(c.label)).slice(0, 6)
  }, [q, user.places])
  const add = (label) => {
    if (addPlace(label)) toast(`Đã thêm ${label}.`)
    else toast('Bạn chỉ lưu được tối đa 25 địa điểm.', { tone: 'error' })
    setQ('')
  }
  return (
    <FocusPage title="Địa điểm đã lưu" sub="Thêm tối đa 25 thành phố để nhận tin địa phương, thời tiết và gợi ý phù hợp hơn.">
      <div className="relative">
        <Field label="Thành phố hoặc tỉnh" name="city" placeholder="Ví dụ: Đà Lạt, Huế" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" disabled={user.places.length >= 25} />
        {q.trim() && (
          <ul className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded border border-rule bg-paper shadow-pop" role="listbox">
            {matches.map((c) => (
              <li key={c.label}>
                <button onClick={() => add(c.label)} className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left font-sans hover:bg-paper-2">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-muted" />
                  <span><span className="block text-[14px]">{c.name}</span><span className="block text-[12px] text-muted">{c.region}</span></span>
                </button>
              </li>
            ))}
            {matches.length === 0 && <li className="px-3 py-2.5 font-sans text-[13px] text-muted">Không tìm thấy địa điểm phù hợp.</li>}
          </ul>
        )}
      </div>
      <div className="mt-2 font-sans text-[12px] text-muted">{user.places.length}/25 địa điểm</div>
      <ul className="mt-4">
        {user.places.map((p) => (
          <li key={p} className="flex items-center justify-between border-b border-rule py-3 font-sans text-[14px]">
            {p}
            <button onClick={() => { removePlace(p); toast(`Đã xoá ${p}.`) }} className="flex items-center gap-1 text-[13px] font-semibold underline"><X size={14} /> Xoá</button>
          </li>
        ))}
      </ul>
      <div className="mt-6"><BackLink /></div>
    </FocusPage>
  )
}
