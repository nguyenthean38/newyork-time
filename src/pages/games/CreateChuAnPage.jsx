/* Tạo Chữ Ẩn — người chơi tự đặt từ, nhận đường dẫn để gửi bạn bè */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Copy, Play, MessageSquare, ArrowLeft } from 'lucide-react'
import { Field, useTitle } from '@/components/ui'
import { unaccent } from '@/lib/format'
import { encodePuzzle, copyText } from '@/features/games/chuan.js'
import { GameHeader, GameIcon } from './GameKit'
import { toast } from '@/store'

export default function CreateChuAnPage() {
  useTitle('Tạo Chữ Ẩn')
  const nav = useNavigate()
  const [step, setStep] = useState('intro') // intro | form | done
  const [word, setWord] = useState('')
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [code, setCode] = useState('')

  const clean = (s) => unaccent(s).toUpperCase().replace(/[^A-Z]/g, '').slice(0, 7)
  const valid = word.length >= 4 && word.length <= 7 && name.trim().length > 0
  const link = code ? `${window.location.origin}/tro-choi/chu-an?p=${code}` : ''

  const create = (e) => {
    e.preventDefault()
    if (word.length < 4) return setErr('Từ cần có từ 4 đến 7 chữ cái.')
    if (!name.trim()) return setErr('Hãy nhập tên hiển thị của bạn.')
    setErr('')
    setCode(encodePuzzle({ w: word, n: name.trim().slice(0, 30), m: msg.trim().slice(0, 80) }))
    setStep('done')
  }

  const copy = async () => {
    const r = await copyText(`${name.trim()} gửi bạn một Chữ Ẩn ${word.length} chữ cái. Đoán thử nhé: ${link}`)
    toast(r === 'failed' ? 'Không sao chép được, hãy chép thủ công.' : 'Đã sao chép đường dẫn — gửi cho bạn bè thôi!', { tone: r === 'failed' ? 'error' : 'ok' })
  }

  if (step === 'intro') {
    return (
      <>
        <GameHeader title="Tạo Chữ Ẩn" />
        <div className="relative flex min-h-[calc(100dvh-52px)] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
          <div className="pointer-events-none absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'linear-gradient(var(--c-rule) 1px, transparent 1px), linear-gradient(90deg, var(--c-rule) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="relative">
            <GameIcon kind="create" size={64} className="mx-auto" />
            <h1 className="mt-4 font-mast text-[36px] font-black leading-tight sm:text-[44px]">Tự tạo Chữ Ẩn</h1>
            <p className="mx-auto mt-3 max-w-md font-serif text-[20px] leading-snug">Thách bạn bè đoán một từ do bạn chọn. Từ có thể dài từ 4 đến 7 chữ cái.</p>
            <button onClick={() => setStep('form')} className="btn btn-pill btn-ink mt-8 px-10 py-3.5">Bắt đầu tạo</button>
            <p className="mt-4 font-sans text-[13px] text-muted">Hoặc <Link to="/tro-choi/chu-an" className="underline">chơi câu đố hôm nay</Link></p>
          </div>
        </div>
      </>
    )
  }

  if (step === 'done') {
    const preview = [...word].map((c, i) => (i === 0 || i === word.length - 1 ? c : ''))
    return (
      <>
        <GameHeader title="Tạo Chữ Ẩn" />
        <div className="mx-auto flex min-h-[calc(100dvh-52px)] max-w-md flex-col items-center justify-center px-6 py-14 text-center">
          <h1 className="font-serif text-[26px] leading-snug">Từ hay đấy, <b>{name.trim()}</b>.<br />Sẵn sàng chia sẻ chưa?</h1>
          <div className="mt-6 flex gap-1.5">
            {preview.map((c, i) => (
              <div key={i} className={`flex size-12 items-center justify-center border-2 font-sans text-[22px] font-bold ${c ? 'border-hit bg-hit text-white' : 'border-rule-2 bg-paper-3'}`}>{c}</div>
            ))}
          </div>
          {msg && <p className="mt-4 flex items-center gap-2 font-sans text-[14px] text-muted"><MessageSquare size={15} /> “{msg}”</p>}
          <div className="mt-6 w-full rounded border border-rule bg-paper-2 px-3 py-2.5 text-left font-mono text-[12px] break-all text-muted">{link}</div>
          <div className="mt-5 flex w-full flex-col gap-2.5">
            <button onClick={copy} className="btn btn-pill btn-ink py-3.5"><Copy size={16} /> Sao chép đường dẫn</button>
            <button onClick={() => nav(`/tro-choi/chu-an?p=${code}`)} className="btn btn-pill btn-line py-3"><Play size={16} /> Chơi thử</button>
            <button onClick={() => { setStep('form'); setCode('') }} className="mt-1 flex items-center justify-center gap-1 font-sans text-[13px] font-semibold underline underline-offset-2"><ArrowLeft size={14} /> Sửa từ</button>
          </div>
          <p className="mt-6 font-sans text-[12px] text-muted">Từ được mã hoá trong đường dẫn để người nhận không nhìn thấy đáp án.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <GameHeader title="Tạo Chữ Ẩn" />
      <form onSubmit={create} className="mx-auto max-w-md px-6 py-12">
        <h1 className="font-serif text-[26px] font-bold">Chọn từ của bạn</h1>
        <p className="mt-1 font-sans text-[14px] text-muted">Gõ không dấu — dấu sẽ được bỏ tự động.</p>
        <div className="mt-6 space-y-5">
          <Field
            label="Từ 4–7 chữ cái"
            name="word"
            value={word}
            onChange={(e) => setWord(clean(e.target.value))}
            placeholder="VD: HOAMAI, BANHMI, TRANG"
            autoComplete="off"
            className="[&_input]:font-bold [&_input]:tracking-[0.2em]"
            hint={`${word.length}/7 chữ cái`}
          />
          <Field label="Tên hiển thị" name="name" value={name} onChange={(e) => setName(e.target.value.slice(0, 30))} placeholder="Tên bạn bè sẽ thấy" hint={`${name.length}/30 ký tự`} />
          <Field label="Lời nhắn (không bắt buộc)" name="msg" value={msg} onChange={(e) => setMsg(e.target.value.slice(0, 80))} placeholder="Hiện ra khi người chơi đoán xong" hint={`${msg.length}/80 ký tự`} />
        </div>
        {err && <p className="mt-4 font-sans text-[13px] text-son">{err}</p>}
        <button type="submit" disabled={!valid} className="btn btn-pill mt-7 w-full py-3.5 enabled:bg-hit enabled:text-white">Xong</button>
        <p className="mt-4 font-sans text-[12px] leading-relaxed text-muted">
          Tên hiển thị và lời nhắn sẽ hiện cho người nhận đường dẫn. Đừng nhập thông tin cá nhân nhạy cảm. Câu đố được lưu ngay trong đường dẫn, Tân Thời không lưu trên máy chủ.
        </p>
      </form>
    </>
  )
}
