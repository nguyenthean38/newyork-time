/* Bộ Tứ — xếp 16 từ thành 4 nhóm, mỗi nhóm 4 từ có điểm chung */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { HelpCircle, BarChart3, Share2 } from 'lucide-react'
import { Modal, useTitle } from '@/components/ui'
import { cn } from '@/lib/cn'
import { useGames } from '@/features/games/store.js'
import { puzzleForDay, shuffle, LEVEL_COLORS, LEVEL_NAMES } from '@/features/games/botu.js'
import { dayKey, parseDay, viDate, copyText } from '@/features/games/chuan.js'
import { GameHeader, IconBtn, StatsRow, Countdown, Splash } from './GameKit'

const MAX_MISTAKES = 4
const EMOJI = ['🟨', '🟩', '🟦', '🟪']

export default function BoTuPage() {
  useTitle('Bộ Tứ')
  const [params] = useSearchParams()
  const today = new Date()
  let d = parseDay(params.get('ngay')) || today
  if (d > today) d = today
  const k = dayKey(d)
  return <Game key={k} date={d} day={k} isToday={k === dayKey(today)} />
}

function Game({ date, day, isToday }) {
  const pz = useMemo(() => puzzleForDay(date), [date])
  const key = `b-${day}`
  const saved = useGames((s) => s.boTu.boards[key])
  const stats = useGames((s) => s.boTu.stats)
  const saveBoTu = useGames((s) => s.saveBoTu)
  const finishBoTu = useGames((s) => s.finishBoTu)

  const [solved, setSolved] = useState(saved?.solved || []) // chỉ số nhóm theo thứ tự giải
  const [history, setHistory] = useState(saved?.history || []) // mỗi lượt: mảng level của 4 từ
  const [mistakes, setMistakes] = useState(saved?.mistakes || 0)
  const [status, setStatus] = useState(saved?.status || 'playing')
  const [order, setOrder] = useState(() => pz.tiles)
  const [sel, setSel] = useState([])
  const [started, setStarted] = useState(false)
  const [shake, setShake] = useState(false)
  const [jump, setJump] = useState(false)
  const [flash, setFlash] = useState(null)
  const [modal, setModal] = useState(null)
  const flashT = useRef()

  const say = useCallback((t, ms = 1700) => {
    clearTimeout(flashT.current)
    setFlash(t)
    flashT.current = setTimeout(() => setFlash(null), ms)
  }, [])

  const solvedWords = useMemo(() => new Set(solved.flatMap((i) => pz.groups[i].words)), [solved, pz])
  const remaining = order.filter((w) => !solvedWords.has(w))
  const levelOf = useCallback((w) => pz.groups.find((g) => g.words.includes(w)).level, [pz])

  const persist = (patch) => saveBoTu(key, { solved, history, mistakes, status, ...patch })

  const toggle = (w) => {
    if (status !== 'playing') return
    setSel((s) => (s.includes(w) ? s.filter((x) => x !== w) : s.length < 4 ? [...s, w] : s))
  }

  const submit = () => {
    if (sel.length !== 4 || status !== 'playing') return
    const levels = sel.map(levelOf)
    const sig = [...sel].sort().join('|')
    if (history.some((h) => h.sig === sig)) return say('Bạn đã thử nhóm này rồi')
    const nextHistory = [...history, { sig, levels }]
    setHistory(nextHistory)
    const counts = levels.reduce((m, l) => ({ ...m, [l]: (m[l] || 0) + 1 }), {})
    const max = Math.max(...Object.values(counts))
    setJump(true)
    setTimeout(() => {
      setJump(false)
      if (max === 4) {
        const g = levels[0]
        const nextSolved = [...solved, g]
        setSolved(nextSolved)
        setSel([])
        const won = nextSolved.length === 4
        const st = won ? 'won' : 'playing'
        setStatus(st)
        saveBoTu(key, { solved: nextSolved, history: nextHistory, mistakes, status: st })
        if (won) {
          finishBoTu(day, true, mistakes)
          say(['Hoàn hảo!', 'Xuất sắc!', 'Tốt lắm!', 'Phù, vừa kịp!'][mistakes] || 'Hoàn thành!', 2000)
          setTimeout(() => setModal('result'), 1600)
        }
      } else {
        setShake(true)
        setTimeout(() => setShake(false), 500)
        const m = mistakes + 1
        setMistakes(m)
        if (max === 3) say('Gần đúng! Còn một từ')
        if (m >= MAX_MISTAKES) {
          // Lộ đáp án các nhóm chưa giải
          const rest = pz.groups.map((g) => g.level).filter((l) => !solved.includes(l))
          let i = 0
          const reveal = () => {
            if (i >= rest.length) return
            const s = [...solved, ...rest.slice(0, i + 1)]
            setSolved(s)
            i++
            setTimeout(reveal, 650)
          }
          setSel([])
          setStatus('lost')
          saveBoTu(key, { solved: [...solved, ...rest], history: nextHistory, mistakes: m, status: 'lost' })
          finishBoTu(day, false, m)
          if (max !== 3) say('Hết lượt rồi', 1500)
          setTimeout(reveal, 900)
          setTimeout(() => setModal('result'), 900 + rest.length * 650 + 600)
        } else {
          persist({ history: nextHistory, mistakes: m })
        }
      }
    }, 650)
  }

  useEffect(() => {
    if (!started) return
    const h = (e) => {
      if (modal) return
      if (e.key === 'Enter') submit()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })

  const share = async () => {
    const grid = history.map((h) => h.levels.map((l) => EMOJI[l]).join('')).join('\n')
    const r = await copyText(`Bộ Tứ số ${pz.number}\n${grid}\n\nChơi tại Tân Thời · Trò chơi`)
    say(r === 'failed' ? 'Không sao chép được' : 'Đã sao chép kết quả')
  }

  const actions = (
    <>
      <IconBtn label="Cách chơi" onClick={() => setModal('help')}><HelpCircle size={20} /></IconBtn>
      <IconBtn label="Thống kê" onClick={() => setModal('result')}><BarChart3 size={20} /></IconBtn>
    </>
  )

  if (!started) {
    const done = status !== 'playing'
    return (
      <>
        <GameHeader title="Bộ Tứ" />
        <Splash
          icon="botu"
          color="#dccdf0"
          title="Bộ Tứ"
          lines="Tìm bốn nhóm, mỗi nhóm bốn từ có chung một điều gì đó."
          primary={<button onClick={() => setStarted(true)} className="btn btn-pill bg-[#121212] py-3.5 text-white hover:opacity-85">{done ? 'Xem kết quả' : history.length ? 'Tiếp tục' : 'Chơi'}</button>}
          secondary={<button onClick={() => { setStarted(true); setModal('help') }} className="btn btn-pill border border-[#121212] bg-transparent py-3 text-[#121212] hover:bg-white/40">Cách chơi</button>}
          meta={<><b>{date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</b><br />Số {pz.number} · Biên tập: Ban Trò chơi Tân Thời</>}
        />
      </>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <GameHeader title={`Bộ Tứ số ${pz.number}`} actions={actions} />
      <main className="relative mx-auto w-full max-w-[600px] flex-1 px-3 py-6">
        {flash && <div className="anim-fade pointer-events-none absolute left-1/2 top-2 z-30 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-4 py-2.5 font-sans text-[14px] font-bold text-paper shadow-pop">{flash}</div>}
        <p className="mb-4 text-center font-sans text-[15px]">{isToday ? 'Tạo thành bốn nhóm, mỗi nhóm bốn từ!' : `Câu đố ngày ${viDate(date)}`}</p>

        <div className="grid gap-2">
          {solved.map((gi) => {
            const g = pz.groups[gi]
            return (
              <div key={gi} className="anim-pop flex min-h-[72px] flex-col items-center justify-center rounded-md px-3 py-3 text-center text-[#121212]" style={{ background: LEVEL_COLORS[g.level] }}>
                <div className="font-sans text-[15px] font-bold uppercase">{g.name}</div>
                <div className="mt-0.5 font-sans text-[14px]">{g.words.join(', ')}</div>
              </div>
            )
          })}
          {remaining.length > 0 && (
            <div className="grid grid-cols-4 gap-2" style={{ animation: shake ? 'shake .5s' : undefined }}>
              {remaining.map((w, i) => {
                const on = sel.includes(w)
                return (
                  <button
                    key={w}
                    onClick={() => toggle(w)}
                    disabled={status !== 'playing'}
                    className={cn(
                      'flex min-h-[72px] items-center justify-center rounded-md px-1 text-center font-sans font-bold uppercase leading-tight transition-colors sm:min-h-[80px]',
                      w.length > 8 ? 'text-[11px] sm:text-[13px]' : w.length > 5 ? 'text-[13px] sm:text-[15px]' : 'text-[15px] sm:text-[17px]',
                      on ? 'bg-[#5a594e] text-white' : 'bg-paper-3 text-ink hover:bg-rule',
                    )}
                    style={{ animation: jump && on ? `bounce-up .45s ease ${sel.indexOf(w) * 90}ms` : undefined }}
                    aria-pressed={on}
                  >
                    <span className="break-words">{w}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {status === 'playing' && (
          <>
            <div className="mt-5 flex items-center justify-center gap-2 font-sans text-[14px]">
              Lượt sai còn lại:
              <span className="flex gap-1.5">
                {Array.from({ length: MAX_MISTAKES }, (_, i) => (
                  <span key={i} className={cn('size-3 rounded-full transition-all', i < MAX_MISTAKES - mistakes ? 'bg-[#5a594e]' : 'scale-50 bg-rule')} />
                ))}
              </span>
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button onClick={() => setOrder(shuffle(order))} className="btn btn-pill btn-line">Xáo trộn</button>
              <button onClick={() => setSel([])} disabled={!sel.length} className="btn btn-pill btn-line disabled:border-rule-2 disabled:bg-transparent disabled:text-faint">Bỏ chọn</button>
              <button onClick={submit} disabled={sel.length !== 4} className="btn btn-pill btn-ink disabled:border disabled:border-rule-2 disabled:bg-transparent disabled:text-faint">Gửi</button>
            </div>
          </>
        )}
        {status !== 'playing' && (
          <div className="mt-6 flex justify-center gap-2">
            <button onClick={() => setModal('result')} className="btn btn-pill btn-ink">Xem kết quả</button>
            <Link to="/tro-choi/chu-an" className="btn btn-pill btn-line">Chơi Chữ Ẩn</Link>
          </div>
        )}
      </main>

      <Modal open={modal === 'help'} onClose={() => setModal(null)} title="Cách chơi">
        <div className="font-sans text-[15px] leading-relaxed">
          <p className="font-serif text-[18px]">Tìm những nhóm bốn từ có chung một điều gì đó.</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Chọn bốn từ rồi bấm <b>Gửi</b> để kiểm tra.</li>
            <li>Mỗi câu đố có đúng một lời giải. Cẩn thận với những từ tưởng như thuộc hai nhóm!</li>
            <li>Bạn được sai tối đa 4 lần.</li>
          </ul>
          <div className="mt-4 font-semibold">Ví dụ nhóm</div>
          <ul className="mt-1 space-y-1 text-[14px]">
            <li><b>Con giáp:</b> TÝ, NGỌ, THÂN, HỢI</li>
            <li><b>Bánh ___:</b> XÈO, CHƯNG, MÌ, CUỐN</li>
          </ul>
          <div className="mt-4 font-semibold">Màu sắc theo độ khó</div>
          <div className="mt-2 grid grid-cols-4 gap-1.5 text-center text-[12px] font-semibold text-[#121212]">
            {LEVEL_COLORS.map((c, i) => <div key={c} className="rounded py-1.5" style={{ background: c }}>{LEVEL_NAMES[i]}</div>)}
          </div>
        </div>
      </Modal>

      <Modal open={modal === 'result'} onClose={() => setModal(null)} className="max-w-[420px]">
        {status !== 'playing' && (
          <div className="mb-5 text-center">
            <div className="font-mast text-[30px] font-black">{status === 'won' ? (mistakes === 0 ? 'Hoàn hảo!' : 'Làm tốt lắm!') : 'Lần sau nhé!'}</div>
            <p className="mt-1 font-sans text-[14px] text-muted">Bộ Tứ số {pz.number}</p>
            <div className="mt-4 inline-grid gap-1">
              {history.map((h, i) => (
                <div key={i} className="flex gap-1">
                  {h.levels.map((l, j) => <span key={j} className="size-6 rounded-[3px]" style={{ background: LEVEL_COLORS[l] }} />)}
                </div>
              ))}
            </div>
          </div>
        )}
        <h3 className="mb-3 font-sans text-[13px] font-bold uppercase tracking-[0.08em]">Thống kê</h3>
        <StatsRow items={[[stats.played, 'Đã chơi'], [stats.played ? Math.round((stats.wins / stats.played) * 100) : 0, '% Hoàn thành'], [stats.streak, 'Chuỗi hiện tại'], [stats.perfect || 0, 'Không sai lần nào']]} />
        {status !== 'playing' && (
          <div className="mt-6 grid grid-cols-2 items-center gap-4 border-t border-rule pt-5">
            <div className="text-center">
              <div className="font-sans text-[11px] uppercase tracking-[0.08em] text-muted">Câu đố mới sau</div>
              <Countdown />
            </div>
            <button onClick={share} className="btn btn-pill btn-ink py-3"><Share2 size={16} /> Chia sẻ</button>
          </div>
        )}
      </Modal>
    </div>
  )
}
