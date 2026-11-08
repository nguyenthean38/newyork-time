/* Chữ Ẩn — đoán từ tiếng Việt không dấu trong 6 lượt */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { HelpCircle, BarChart3, Settings, Delete, Share2, Shuffle, CalendarDays, PenLine, Check, X as XIcon } from 'lucide-react'
import { Modal, Toggle, useTitle } from '@/components/ui'
import { useUI } from '@/store'
import { cn } from '@/lib/cn'
import { ANSWERS, isValidGuess } from '@/features/games/words.js'
import {
  answerForDay, dayKey, dayNumber, parseDay, viDate, evaluate, keyStates, hardModeError,
  decodePuzzle, shareText, copyText,
} from '@/features/games/chuan.js'
import { useGames } from '@/features/games/store.js'
import { GameHeader, IconBtn, StatsRow, DistBars, Countdown, Splash } from './GameKit'

const ROWS = 6
const PRAISE = ['Thiên tài!', 'Xuất sắc!', 'Tuyệt vời!', 'Giỏi lắm!', 'Khá lắm!', 'Phù, suýt nữa!']
const KB = ['QWERTYUIOP', 'ASDFGHJKL', '+ZXCVBNM-']
const FLIP_MS = 300

/* ---------- Xác định câu đố từ URL ---------- */
function usePuzzle() {
  const [params] = useSearchParams()
  const code = params.get('p')
  const ngay = params.get('ngay')
  const rnd = params.get('ngau-nhien')
  return useMemo(() => {
    if (code) {
      const c = decodePuzzle(code)
      if (!c) return { error: 'Đường dẫn câu đố không hợp lệ hoặc đã bị cắt mất.' }
      return { mode: 'custom', key: `c-${code.slice(0, 24)}`, answer: c.w, info: null, by: c.n, message: c.m, title: c.n ? `Chữ Ẩn của ${c.n}` : 'Chữ Ẩn tự tạo' }
    }
    if (rnd != null) {
      const idx = Math.abs(parseInt(rnd, 10) || 0) % ANSWERS.length
      const a = ANSWERS[idx]
      return { mode: 'random', key: `r-${idx}`, answer: a.w, info: a, title: 'Chữ Ẩn luyện tập' }
    }
    const today = new Date()
    let d = parseDay(ngay) || today
    if (d > today) d = today
    const a = answerForDay(d)
    const k = dayKey(d)
    return { mode: 'daily', key: `d-${k}`, day: k, date: d, answer: a.w, info: a, title: `Chữ Ẩn số ${dayNumber(d) + 1}`, isToday: k === dayKey(today) }
  }, [code, ngay, rnd])
}

export default function ChuAnPage() {
  const pz = usePuzzle()
  useTitle('Chữ Ẩn')
  if (pz.error) {
    return (
      <>
        <GameHeader title="Chữ Ẩn" />
        <div className="mx-auto max-w-md px-6 py-20 text-center">
          <h1 className="font-serif text-2xl font-bold">Không mở được câu đố</h1>
          <p className="mt-3 font-sans text-muted">{pz.error}</p>
          <Link to="/tro-choi/chu-an" className="btn btn-ink btn-pill mt-6">Chơi câu đố hôm nay</Link>
        </div>
      </>
    )
  }
  return <Game key={pz.key} pz={pz} />
}

function Game({ pz }) {
  const nav = useNavigate()
  const len = pz.answer.length
  const settings = useGames((s) => s.settings)
  const setSetting = useGames((s) => s.setSetting)
  const saved = useGames((s) => s.chuAn.boards[pz.key])
  const stats = useGames((s) => s.chuAn.stats)
  const saveChuAn = useGames((s) => s.saveChuAn)
  const finishChuAn = useGames((s) => s.finishChuAn)

  const [guesses, setGuesses] = useState(saved?.guesses || [])
  const [status, setStatus] = useState(saved?.status || 'playing')
  const hard = saved?.guesses?.length ? Boolean(saved.hard) : settings.hard
  const [cur, setCur] = useState('')
  const [started, setStarted] = useState(false)
  const [reveal, setReveal] = useState(-1) // hàng đang lật
  const [bounce, setBounce] = useState(false)
  const [shake, setShake] = useState(false)
  const [flash, setFlash] = useState(null)
  const [modal, setModal] = useState(null) // 'help' | 'stats' | 'settings' | 'archive'
  const flashT = useRef()

  const say = useCallback((text, ms = 1500) => {
    clearTimeout(flashT.current)
    setFlash(text)
    flashT.current = setTimeout(() => setFlash(null), ms)
  }, [])

  useEffect(() => {
    if (!settings.seenHelp && started) {
      setModal('help')
      setSetting('seenHelp', true)
    }
  }, [started, settings.seenHelp, setSetting])

  const keys = useMemo(() => keyStates(reveal >= 0 ? guesses.slice(0, reveal) : guesses, pz.answer), [guesses, reveal, pz.answer])

  const bad = useCallback((msg) => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
    say(msg)
  }, [say])

  const submit = useCallback(() => {
    if (status !== 'playing' || reveal >= 0) return
    if (cur.length < len) return bad('Chưa đủ chữ cái')
    if (pz.mode !== 'custom' && !isValidGuess(cur)) return bad('Không có trong danh sách từ')
    if (hard) {
      const err = hardModeError(cur, guesses, pz.answer)
      if (err) return bad(err)
    }
    const next = [...guesses, cur]
    const won = cur === pz.answer
    const lost = !won && next.length >= ROWS
    const st = won ? 'won' : lost ? 'lost' : 'playing'
    setGuesses(next)
    setCur('')
    setReveal(next.length - 1)
    saveChuAn(pz.key, { guesses: next, status: st, hard })
    setTimeout(() => {
      setReveal(-1)
      setStatus(st)
      if (st !== 'playing') {
        if (pz.mode === 'daily') finishChuAn(pz.day, won, next.length)
        if (won) {
          setBounce(true)
          say(PRAISE[next.length - 1], 2000)
        } else {
          say(pz.info?.a || pz.answer, 2600)
        }
        setTimeout(() => setModal('stats'), won ? 1800 : 2400)
      }
    }, len * FLIP_MS + 350)
  }, [status, reveal, cur, len, pz, hard, guesses, saveChuAn, finishChuAn, say, bad])

  const press = useCallback((k) => {
    if (status !== 'playing' || reveal >= 0) return
    if (k === 'ENTER') return submit()
    if (k === 'BACK') return setCur((c) => c.slice(0, -1))
    if (/^[A-Z]$/.test(k)) setCur((c) => (c.length < len ? c + k : c))
  }, [status, reveal, submit, len])

  useEffect(() => {
    if (!started || modal || settings.onscreenOnly) return
    const h = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === 'Enter') { e.preventDefault(); press('ENTER') }
      else if (e.key === 'Backspace') press('BACK')
      else if (/^[a-zA-Z]$/.test(e.key)) press(e.key.toUpperCase())
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [started, modal, press, settings.onscreenOnly])

  const share = async () => {
    const txt = shareText({ title: pz.mode === 'daily' ? `Chữ Ẩn ${viDate(pz.date)}` : pz.title, guesses, answer: pz.answer, won: status === 'won', hard, contrast: settings.contrast })
    const r = await copyText(txt)
    say(r === 'failed' ? 'Không sao chép được' : r === 'shared' ? 'Đã mở chia sẻ' : 'Đã sao chép kết quả', 1800)
  }
  const playRandom = () => {
    setModal(null)
    nav(`/tro-choi/chu-an?ngau-nhien=${Math.floor(Math.random() * ANSWERS.length)}`)
  }

  const contrastVars = settings.contrast ? { '--c-hit': '#f5793a', '--c-near': '#85c0f9' } : undefined
  const actions = (
    <>
      <IconBtn label="Cách chơi" onClick={() => setModal('help')}><HelpCircle size={20} /></IconBtn>
      <IconBtn label="Thống kê" onClick={() => setModal('stats')}><BarChart3 size={20} /></IconBtn>
      <IconBtn label="Cài đặt" onClick={() => setModal('settings')}><Settings size={20} /></IconBtn>
    </>
  )

  /* ---------- Màn hình chào ---------- */
  if (!started) {
    const inProgress = guesses.length > 0 && status === 'playing'
    const done = status !== 'playing'
    return (
      <div style={contrastVars}>
        <GameHeader title="Chữ Ẩn" />
        <Splash
          icon="chuan"
          color="#cfe8c4"
          title="Chữ Ẩn"
          lines={pz.mode === 'custom'
            ? <>{pz.by ? <><b>{pz.by}</b> gửi bạn một từ {len} chữ cái.</> : `Một từ ${len} chữ cái đang chờ bạn.`} Bạn có 6 lượt đoán.</>
            : done ? 'Bạn đã chơi xong câu đố này. Xem lại kết quả nhé!' : inProgress ? 'Bạn đang chơi dở. Tiếp tục nào!' : 'Đoán từ tiếng Việt 5 chữ cái (gõ không dấu) trong 6 lượt.'}
          primary={<button onClick={() => setStarted(true)} className="btn btn-pill bg-[#121212] py-3.5 text-white hover:opacity-85">{done ? 'Xem kết quả' : inProgress ? 'Tiếp tục' : 'Chơi'}</button>}
          secondary={pz.mode === 'daily' ? (
            <>
              <button onClick={() => { setStarted(true); setModal('archive') }} className="btn btn-pill border border-[#121212] bg-transparent py-3 text-[#121212] hover:bg-white/40">Câu đố ngày trước</button>
              <button onClick={playRandom} className="font-sans text-[13px] font-semibold text-[#121212] underline underline-offset-2">Chơi ngẫu nhiên để luyện tập</button>
            </>
          ) : (
            <Link to="/tro-choi/chu-an" className="btn btn-pill border border-[#121212] bg-transparent py-3 text-[#121212] hover:bg-white/40">Câu đố hôm nay</Link>
          )}
          meta={pz.mode === 'daily'
            ? <><b>{pz.date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</b><br />Số {dayNumber(pz.date) + 1} · Biên tập: Ban Trò chơi Tân Thời</>
            : pz.message ? <>Đoán xong để đọc lời nhắn của {pz.by || 'người tạo'}.</> : null}
        />
      </div>
    )
  }

  /* ---------- Bàn chơi ---------- */
  const rows = Array.from({ length: ROWS }, (_, r) => {
    if (r < guesses.length) return { word: guesses[r], ev: evaluate(guesses[r], pz.answer), kind: 'done' }
    if (r === guesses.length && status === 'playing') return { word: cur, ev: null, kind: 'current' }
    return { word: '', ev: null, kind: 'empty' }
  })
  const tile = len <= 5 ? 62 : len === 6 ? 54 : 48

  return (
    <div style={contrastVars} className="flex min-h-dvh flex-col">
      <GameHeader title={pz.title} actions={actions} />
      <main className="relative mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-between px-2 pb-3 pt-4">
        {flash && (
          <div className="anim-fade pointer-events-none absolute left-1/2 top-3 z-30 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-4 py-2.5 font-sans text-[14px] font-bold text-paper shadow-pop">{flash}</div>
        )}
        {pz.mode === 'daily' && !pz.isToday && (
          <div className="mb-2 font-sans text-[12px] text-muted">Câu đố ngày {viDate(pz.date)}</div>
        )}
        <div className="flex flex-1 items-center">
          <div className="grid gap-[6px]" style={{ width: `min(${tile * len + 6 * (len - 1)}px, calc(100vw - 24px))` }}>
            {rows.map((row, r) => (
              <div
                key={r}
                className="grid gap-[6px]"
                style={{ gridTemplateColumns: `repeat(${len}, 1fr)`, animation: row.kind === 'current' && shake ? 'shake .5s' : undefined }}
              >
                {Array.from({ length: len }, (_, i) => {
                  const ch = row.word[i] || ''
                  const st = row.ev?.[i]
                  const flipping = r === reveal
                  const bouncing = bounce && r === guesses.length - 1 && status === 'won'
                  const delay = i * FLIP_MS + FLIP_MS * 0.8
                  return (
                    <div
                      key={i}
                      className={cn(
                        'flex aspect-square select-none items-center justify-center border-2 font-sans font-bold uppercase',
                        st ? `text-white ${st === 'hit' ? 'border-hit bg-hit' : st === 'near' ? 'border-near bg-near' : 'border-miss bg-miss'}` : ch ? 'border-faint text-ink' : 'border-rule-2',
                      )}
                      style={{
                        fontSize: `clamp(18px, ${len <= 5 ? 7.5 : 6.2}vw, ${len <= 5 ? 32 : 26}px)`,
                        animation: flipping
                          ? `flip-in ${FLIP_MS * 1.6}ms ease ${i * FLIP_MS}ms both`
                          : bouncing ? `bounce-up .6s ease ${i * 100}ms both`
                            : ch && row.kind === 'current' && i === row.word.length - 1 ? 'pop-in .1s ease' : undefined,
                        transition: flipping ? `background-color 0s ${delay}ms, border-color 0s ${delay}ms, color 0s ${delay}ms` : undefined,
                      }}
                    >
                      {ch}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {status !== 'playing' && reveal < 0 && (
          <div className="my-3 flex flex-wrap justify-center gap-2">
            <button onClick={() => setModal('stats')} className="btn btn-pill btn-line btn-sm">Xem kết quả</button>
            <button onClick={playRandom} className="btn btn-pill btn-ink btn-sm"><Shuffle size={14} /> Chơi ngẫu nhiên</button>
          </div>
        )}

        {/* Bàn phím */}
        <div className="mt-3 w-full max-w-[500px] select-none" aria-label="Bàn phím">
          {KB.map((row, ri) => (
            <div key={ri} className="mb-[7px] flex justify-center gap-[5px]">
              {ri === 1 && <div className="flex-[0.5]" />}
              {[...row].map((k) => {
                const code = k === '+' ? 'ENTER' : k === '-' ? 'BACK' : k
                const st = keys[k]
                const wide = code === 'ENTER' || code === 'BACK'
                return (
                  <button
                    key={k}
                    onClick={() => press(code)}
                    aria-label={code === 'ENTER' ? 'Nhập' : code === 'BACK' ? 'Xoá' : k}
                    className={cn(
                      'flex h-[54px] min-w-0 items-center justify-center rounded-[4px] font-sans font-bold transition-colors active:opacity-70',
                      wide ? 'flex-[1.5] text-[11px]' : 'flex-1 text-[15px]',
                      st === 'hit' ? 'bg-hit text-white' : st === 'near' ? 'bg-near text-white' : st === 'miss' ? 'bg-miss text-white' : 'bg-key text-ink',
                    )}
                  >
                    {code === 'ENTER' ? 'NHẬP' : code === 'BACK' ? <Delete size={20} /> : k}
                  </button>
                )
              })}
              {ri === 1 && <div className="flex-[0.5]" />}
            </div>
          ))}
        </div>
      </main>

      <HelpModal open={modal === 'help'} onClose={() => setModal(null)} len={len} />
      <SettingsModal open={modal === 'settings'} onClose={() => setModal(null)} canHard={guesses.length === 0} say={say} />
      <ArchiveModal open={modal === 'archive'} onClose={() => setModal(null)} />
      <ResultModal
        open={modal === 'stats'}
        onClose={() => setModal(null)}
        pz={pz}
        status={reveal >= 0 ? 'playing' : status}
        guesses={guesses}
        stats={stats}
        onShare={share}
        onRandom={playRandom}
      />
    </div>
  )
}

/* ---------- Hộp thoại: cách chơi ---------- */
function Example({ word, idx, st, text }) {
  return (
    <div className="mt-3">
      <div className="flex gap-1">
        {[...word].map((c, i) => (
          <div key={i} className={cn('flex size-9 items-center justify-center border-2 font-sans text-[18px] font-bold', i === idx ? (st === 'hit' ? 'border-hit bg-hit text-white' : st === 'near' ? 'border-near bg-near text-white' : 'border-miss bg-miss text-white') : 'border-faint')}>{c}</div>
        ))}
      </div>
      <p className="mt-1.5 font-sans text-[14px]">{text}</p>
    </div>
  )
}

function HelpModal({ open, onClose, len }) {
  return (
    <Modal open={open} onClose={onClose} title="Cách chơi">
      <div className="font-sans text-[15px] leading-relaxed">
        <p className="font-serif text-[18px]">Đoán từ trong 6 lượt.</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Mỗi lượt đoán là một từ tiếng Việt <b>{len} chữ cái, gõ không dấu</b> (Đ gõ là D).</li>
          <li>Màu ô cho biết bạn đoán gần đúng đến đâu.</li>
          <li>Hết ván, bạn sẽ thấy từ có dấu và nghĩa của nó.</li>
        </ul>
        <div className="mt-4 font-semibold">Ví dụ</div>
        <Example word="TRANG" idx={0} st="hit" text={<><b>T</b> có trong từ và đúng vị trí.</>} />
        <Example word="PHONG" idx={2} st="near" text={<><b>O</b> có trong từ nhưng sai vị trí.</>} />
        <Example word="CHUOI" idx={3} st="miss" text={<><b>O</b> không có trong từ.</>} />
        <p className="mt-4 border-t border-rule pt-3 text-[13px] text-muted">
          Câu đố mới mỗi ngày lúc nửa đêm. Muốn thử thách bạn bè? <Link to="/tro-choi/tao-chu-an" className="underline" onClick={onClose}>Tự tạo Chữ Ẩn</Link>.
        </p>
      </div>
    </Modal>
  )
}

/* ---------- Hộp thoại: cài đặt ---------- */
function SettingsModal({ open, onClose, canHard, say }) {
  const settings = useGames((s) => s.settings)
  const setSetting = useGames((s) => s.setSetting)
  const theme = useUI((s) => s.theme)
  const setTheme = useUI((s) => s.setTheme)
  const dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  const rows = [
    ['Chế độ khó', 'Mọi gợi ý đã lộ phải được dùng trong lượt đoán sau', settings.hard, (v) => {
      if (!canHard) return say('Chỉ đổi chế độ khó trước khi bắt đầu')
      setSetting('hard', v)
    }],
    ['Giao diện tối', 'Áp dụng cho toàn bộ Tân Thời', dark, (v) => setTheme(v ? 'dark' : 'light')],
    ['Màu tương phản cao', 'Cam và xanh dương, dễ phân biệt cho người mù màu', settings.contrast, (v) => setSetting('contrast', v)],
    ['Chỉ dùng bàn phím trên màn hình', 'Bỏ qua bàn phím vật lý', settings.onscreenOnly, (v) => setSetting('onscreenOnly', v)],
  ]
  return (
    <Modal open={open} onClose={onClose} title="Cài đặt">
      <ul className="divide-y divide-rule font-sans">
        {rows.map(([t, d, v, fn]) => (
          <li key={t} className="flex items-center justify-between gap-4 py-3.5">
            <div>
              <div className="text-[15px] font-semibold">{t}</div>
              <div className="text-[12px] text-muted">{d}</div>
            </div>
            <Toggle checked={v} onChange={fn} label={t} />
          </li>
        ))}
      </ul>
      <p className="mt-3 font-sans text-[11px] text-muted">© Tân Thời · Trò chơi chữ tiếng Việt (bản demo)</p>
    </Modal>
  )
}

/* ---------- Hộp thoại: câu đố ngày trước ---------- */
function ArchiveModal({ open, onClose }) {
  const boards = useGames((s) => s.chuAn.boards)
  const nav = useNavigate()
  const days = Array.from({ length: 21 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d
  })
  return (
    <Modal open={open} onClose={onClose} title="Câu đố ngày trước">
      <div className="grid grid-cols-3 gap-2 font-sans">
        {days.map((d, i) => {
          const k = dayKey(d)
          const b = boards[`d-${k}`]
          return (
            <button
              key={k}
              onClick={() => { onClose(); nav(i === 0 ? '/tro-choi/chu-an' : `/tro-choi/chu-an?ngay=${k}`) }}
              className="flex flex-col items-center rounded border border-rule px-2 py-2.5 hover:bg-paper-2"
            >
              <span className="text-[11px] text-muted">{i === 0 ? 'Hôm nay' : `Số ${dayNumber(d) + 1}`}</span>
              <span className="text-[14px] font-semibold">{d.getDate()}/{d.getMonth() + 1}</span>
              <span className="mt-1 flex h-4 items-center text-[11px]">
                {b?.status === 'won' ? <Check size={15} className="text-hit" /> : b?.status === 'lost' ? <XIcon size={15} className="text-son" /> : b?.guesses?.length ? '…' : ''}
              </span>
            </button>
          )
        })}
      </div>
      <p className="mt-3 flex items-center gap-1.5 font-sans text-[12px] text-muted"><CalendarDays size={14} /> Câu đố ngày trước vẫn được tính vào thống kê, nhưng chuỗi ngày chỉ nối khi chơi liên tiếp.</p>
    </Modal>
  )
}

/* ---------- Hộp thoại: kết quả + thống kê ---------- */
function ResultModal({ open, onClose, pz, status, guesses, stats, onShare, onRandom }) {
  const finished = status !== 'playing'
  const won = status === 'won'
  const info = pz.info
  const winPct = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0
  return (
    <Modal open={open} onClose={onClose} className="max-w-[440px]">
      {finished && (
        <div className="mb-5 text-center">
          <div className="font-mast text-[30px] font-black">{won ? 'Chúc mừng!' : 'Tiếc quá!'}</div>
          <p className="mt-1 font-sans text-[14px] text-muted">{won ? `Bạn đoán ra sau ${guesses.length} lượt.` : 'Hẹn bạn ở câu đố tiếp theo.'}</p>
          <div className="mx-auto mt-4 inline-flex flex-col items-center rounded-md border border-rule px-6 py-3">
            <div className="font-sans text-[11px] uppercase tracking-[0.1em] text-muted">Đáp án</div>
            <div className="font-serif text-[28px] font-bold tracking-[0.06em]">{info?.a || pz.answer}</div>
            {info?.m && <div className="font-sans text-[13px] text-muted">{info.m}</div>}
          </div>
          {pz.mode === 'custom' && pz.message && <p className="mt-3 font-serif text-[15px] italic">“{pz.message}” — {pz.by || 'người tạo'}</p>}
        </div>
      )}
      {pz.mode === 'daily' || !finished ? (
        <>
          <h3 className="mb-3 font-sans text-[13px] font-bold uppercase tracking-[0.08em]">Thống kê</h3>
          <StatsRow items={[[stats.played, 'Đã chơi'], [winPct, '% Thắng'], [stats.streak, 'Chuỗi hiện tại'], [stats.maxStreak, 'Chuỗi dài nhất']]} />
          <h3 className="mb-2 mt-5 font-sans text-[13px] font-bold uppercase tracking-[0.08em]">Phân bố số lượt đoán</h3>
          <DistBars dist={stats.dist} highlight={won && pz.mode === 'daily' ? guesses.length - 1 : -1} />
        </>
      ) : (
        <p className="text-center font-sans text-[13px] text-muted">Câu đố {pz.mode === 'custom' ? 'tự tạo' : 'luyện tập'} không tính vào thống kê.</p>
      )}
      {finished && (
        <div className="mt-6 grid grid-cols-2 items-center gap-4 border-t border-rule pt-5">
          <div className="text-center">
            <div className="font-sans text-[11px] uppercase tracking-[0.08em] text-muted">Câu đố mới sau</div>
            <Countdown />
          </div>
          <button onClick={onShare} className="btn btn-pill bg-hit py-3 text-white hover:opacity-90"><Share2 size={16} /> Chia sẻ</button>
        </div>
      )}
      <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 font-sans text-[13px] font-semibold">
        <button onClick={onRandom} className="flex items-center gap-1.5 underline underline-offset-2"><Shuffle size={14} /> Chơi ngẫu nhiên</button>
        <Link to="/tro-choi/tao-chu-an" className="flex items-center gap-1.5 underline underline-offset-2"><PenLine size={14} /> Tạo câu đố của bạn</Link>
        <Link to="/tro-choi/bo-tu" className="underline underline-offset-2">Thử Bộ Tứ</Link>
      </div>
    </Modal>
  )
}
