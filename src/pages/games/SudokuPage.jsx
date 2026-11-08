/* Sudoku — câu đố mỗi ngày theo ba mức độ, có ghi chú, hoàn tác, kiểm tra lỗi */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { HelpCircle, Pause, Play, Undo2, Eraser, Pencil, RotateCcw, Shuffle } from 'lucide-react'
import { Modal, Toggle, useTitle } from '@/components/ui'
import { cn } from '@/lib/cn'
import { useGames, fmtTime } from '@/features/games/store.js'
import { generate, LEVELS, PEERS, ROW, COL, BOX, hashStr } from '@/features/games/sudoku.js'
import { dayKey } from '@/features/games/chuan.js'
import { GameHeader, IconBtn } from './GameKit'

const emptyNotes = () => Array.from({ length: 81 }, () => [])

export default function SudokuPage() {
  useTitle('Sudoku')
  const [level, setLevel] = useState('de')
  const [seedExtra, setSeedExtra] = useState(0)
  const today = dayKey()
  const key = `s-${today}-${level}${seedExtra ? `-${seedExtra}` : ''}`
  return (
    <Game
      key={key}
      gameKey={key}
      level={level}
      seed={hashStr(`${today}-${level}`) + seedExtra}
      onLevel={(l) => { setLevel(l); setSeedExtra(0) }}
      onNew={() => setSeedExtra(1 + Math.floor(Math.random() * 1e6))}
      daily={!seedExtra}
    />
  )
}

function Game({ gameKey, level, seed, onLevel, onNew, daily }) {
  const { puzzle, solution } = useMemo(() => generate(level, seed), [level, seed])
  const saved = useGames((s) => s.sudoku.boards[gameKey])
  const best = useGames((s) => s.sudoku.best[level])
  const saveSudoku = useGames((s) => s.saveSudoku)
  const finishSudoku = useGames((s) => s.finishSudoku)

  const [cells, setCells] = useState(saved?.cells || puzzle)
  const [notes, setNotes] = useState(saved?.notes || emptyNotes())
  const [time, setTime] = useState(saved?.time || 0)
  const [done, setDone] = useState(saved?.done || false)
  const [sel, setSel] = useState(() => puzzle.findIndex((v) => v === 0))
  const [noteMode, setNoteMode] = useState(false)
  const [autoCheck, setAutoCheck] = useState(true)
  const [paused, setPaused] = useState(false)
  const [modal, setModal] = useState(null)
  const [record, setRecord] = useState(false)
  const undo = useRef([])

  // Đồng hồ
  useEffect(() => {
    if (done || paused || modal) return
    const id = setInterval(() => setTime((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [done, paused, modal])

  // Lưu thời gian mỗi 10 giây để tải lại trang không mất đồng hồ
  useEffect(() => {
    if (time && time % 10 === 0 && !done) saveSudoku(gameKey, { cells, notes, time, done })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time])

  // Lưu tiến độ (mỗi khi bàn thay đổi; thời gian lưu kèm)
  useEffect(() => {
    saveSudoku(gameKey, { cells, notes, time, done })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cells, notes, done])

  const given = (i) => puzzle[i] !== 0

  const setValue = useCallback((v) => {
    if (sel < 0 || given(sel) || done || paused) return
    undo.current.push({ cells, notes })
    if (undo.current.length > 200) undo.current.shift()
    if (noteMode && v) {
      if (cells[sel]) return
      const n = notes.map((x) => [...x])
      n[sel] = n[sel].includes(v) ? n[sel].filter((x) => x !== v) : [...n[sel], v].sort()
      setNotes(n)
      return
    }
    const c = [...cells]
    c[sel] = c[sel] === v ? 0 : v
    setCells(c)
    if (v) {
      // Xoá ghi chú trùng số ở các ô liên quan
      const n = notes.map((x) => [...x])
      n[sel] = []
      PEERS[sel].forEach((j) => { n[j] = n[j].filter((x) => x !== v) })
      setNotes(n)
    }
    if (c.every((x, i) => x === solution[i])) {
      setDone(true)
      const isRecord = finishSudoku(level, time)
      setRecord(isRecord)
      setTimeout(() => setModal('win'), 400)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, cells, notes, noteMode, done, paused, solution, level, time, finishSudoku])

  const doUndo = () => {
    const last = undo.current.pop()
    if (!last || done) return
    setCells(last.cells)
    setNotes(last.notes)
  }

  const reset = () => {
    undo.current = []
    setCells(puzzle)
    setNotes(emptyNotes())
    setTime(0)
    setDone(false)
    setModal(null)
  }

  useEffect(() => {
    const h = (e) => {
      if (modal) return
      if (/^[1-9]$/.test(e.key)) return setValue(+e.key)
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') return setValue(0)
      if (e.key === 'n' || e.key === 'N') return setNoteMode((m) => !m)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') return doUndo()
      const mv = { ArrowUp: -9, ArrowDown: 9, ArrowLeft: -1, ArrowRight: 1 }[e.key]
      if (mv) {
        e.preventDefault()
        setSel((s) => {
          const n = (s < 0 ? 0 : s) + mv
          if (mv === -1 && s % 9 === 0) return s
          if (mv === 1 && s % 9 === 8) return s
          return n < 0 || n > 80 ? s : n
        })
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })

  const selVal = sel >= 0 ? cells[sel] : 0
  const counts = useMemo(() => {
    const c = Array(10).fill(0)
    cells.forEach((v, i) => { if (v && v === solution[i]) c[v]++ })
    return c
  }, [cells, solution])
  const filled = cells.filter(Boolean).length

  const actions = (
    <>
      <span className="mr-1 font-sans text-[14px] font-semibold tabular-nums">{fmtTime(time)}</span>
      <IconBtn label={paused ? 'Tiếp tục' : 'Tạm dừng'} onClick={() => setPaused(!paused)}>{paused ? <Play size={19} /> : <Pause size={19} />}</IconBtn>
      <IconBtn label="Cách chơi" onClick={() => setModal('help')}><HelpCircle size={20} /></IconBtn>
    </>
  )

  return (
    <div className="flex min-h-dvh flex-col">
      <GameHeader title="Sudoku" actions={actions} />
      <main className="mx-auto w-full max-w-[980px] flex-1 px-3 py-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full border border-rule p-1 font-sans text-[13px]">
            {Object.entries(LEVELS).map(([k, v]) => (
              <button key={k} onClick={() => onLevel(k)} className={cn('rounded-full px-4 py-1.5 font-semibold', level === k ? 'bg-ink text-paper' : 'hover:bg-paper-2')}>{v.name}</button>
            ))}
          </div>
          <div className="font-sans text-[12px] text-muted">
            {daily ? `Câu đố ngày ${new Date().toLocaleDateString('vi-VN')}` : 'Câu đố luyện tập'}{best ? ` · Kỷ lục ${LEVELS[level].name}: ${fmtTime(best)}` : ''}
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-center">
          {/* Lưới */}
          <div className="relative w-full max-w-[min(520px,calc(100vw-24px))]">
            <div className="grid aspect-square grid-cols-9 border-2 border-ink bg-paper">
              {cells.map((v, i) => {
                const r = ROW(i), c = COL(i)
                const isSel = i === sel
                const related = sel >= 0 && (ROW(sel) === r || COL(sel) === c || BOX(sel) === BOX(i))
                const same = selVal && v === selVal
                const wrong = autoCheck && v && v !== solution[i]
                return (
                  <button
                    key={i}
                    onClick={() => setSel(i)}
                    aria-label={`Hàng ${r + 1}, cột ${c + 1}${v ? `, số ${v}` : ', trống'}`}
                    className={cn(
                      'relative flex items-center justify-center border-rule-2 font-sans tabular-nums outline-none',
                      c % 3 === 2 && c !== 8 ? 'border-r-2 border-r-ink' : c !== 8 && 'border-r',
                      r % 3 === 2 && r !== 8 ? 'border-b-2 border-b-ink' : r !== 8 && 'border-b',
                      isSel ? 'bg-[#f3d36b]/70' : same ? 'bg-[#9cc0ec]/55' : related ? 'bg-paper-3' : '',
                      paused && 'text-transparent',
                    )}
                  >
                    {v ? (
                      <span className={cn('text-[clamp(18px,5.4vw,28px)]', given(i) ? 'font-bold text-ink' : wrong ? 'font-semibold text-son' : 'font-semibold text-link')}>{v}</span>
                    ) : notes[i].length > 0 && !paused ? (
                      <span className="grid size-full grid-cols-3 p-[2px] text-[clamp(7px,1.9vw,11px)] leading-none text-muted">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <span key={n} className="flex items-center justify-center">{notes[i].includes(n) ? n : ''}</span>)}
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
            {paused && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-paper/90">
                <div className="font-mast text-[28px] font-black">Tạm dừng</div>
                <button onClick={() => setPaused(false)} className="btn btn-pill btn-ink mt-4"><Play size={16} /> Tiếp tục</button>
              </div>
            )}
          </div>

          {/* Bảng điều khiển */}
          <div className="w-full max-w-[520px] md:w-[300px]">
            <div className="grid grid-cols-4 gap-2 font-sans text-[12px]">
              {[
                [Undo2, 'Hoàn tác', doUndo, false],
                [Eraser, 'Xoá', () => setValue(0), false],
                [Pencil, noteMode ? 'Ghi chú: Bật' : 'Ghi chú', () => setNoteMode(!noteMode), noteMode],
                [RotateCcw, 'Làm lại', () => setModal('reset'), false],
              ].map(([I, l, fn, on]) => (
                <button key={l} onClick={fn} className={cn('flex flex-col items-center gap-1 rounded-md border py-2.5', on ? 'border-ink bg-ink text-paper' : 'border-rule hover:bg-paper-2')}>
                  <I size={19} /> {l}
                </button>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-9 gap-1.5 md:grid-cols-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  onClick={() => setValue(n)}
                  disabled={counts[n] >= 9}
                  className={cn(
                    'flex aspect-[3/4] items-center justify-center rounded-md bg-paper-3 font-sans text-[22px] font-semibold text-link hover:bg-rule md:aspect-square md:text-[28px]',
                    counts[n] >= 9 && 'opacity-30',
                    noteMode && 'text-muted',
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-md border border-rule px-4 py-3 font-sans text-[14px]">
              <span>Tự kiểm tra lỗi</span>
              <Toggle checked={autoCheck} onChange={setAutoCheck} label="Tự kiểm tra lỗi" />
            </div>
            <div className="mt-3 flex items-center justify-between font-sans text-[12px] text-muted">
              <span>Đã điền {filled}/81 ô</span>
              <button onClick={onNew} className="flex items-center gap-1 font-semibold text-ink underline underline-offset-2"><Shuffle size={13} /> Câu đố mới</button>
            </div>
            <p className="mt-3 hidden font-sans text-[12px] text-muted md:block">Bàn phím: số 1–9 để điền, mũi tên để di chuyển, N bật ghi chú, Ctrl+Z hoàn tác.</p>
          </div>
        </div>
      </main>

      <Modal open={modal === 'help'} onClose={() => setModal(null)} title="Cách chơi Sudoku">
        <ul className="list-disc space-y-1.5 pl-5 font-sans text-[15px] leading-relaxed">
          <li>Điền số từ 1 đến 9 vào mọi ô trống.</li>
          <li>Mỗi hàng, mỗi cột và mỗi khối 3×3 phải có đủ các số 1–9, không trùng lặp.</li>
          <li>Bật <b>Ghi chú</b> để đánh dấu các số có thể điền vào một ô.</li>
          <li>Mỗi câu đố có đúng một lời giải. Câu đố mới mỗi ngày cho cả ba mức độ.</li>
        </ul>
      </Modal>
      <Modal open={modal === 'reset'} onClose={() => setModal(null)} title="Làm lại từ đầu?">
        <p className="font-sans text-[15px] text-muted">Mọi số bạn đã điền và thời gian sẽ bị xoá.</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={() => setModal(null)} className="btn btn-line btn-pill">Huỷ</button>
          <button onClick={reset} className="btn btn-ink btn-pill">Làm lại</button>
        </div>
      </Modal>
      <Modal open={modal === 'win'} onClose={() => setModal(null)} className="max-w-sm text-center">
        <div className="font-mast text-[32px] font-black">Hoàn thành!</div>
        <p className="mt-2 font-sans text-[15px]">Bạn giải Sudoku mức <b>{LEVELS[level].name}</b> trong <b>{fmtTime(time)}</b>.</p>
        {record && <p className="mt-2 font-sans text-[13px] font-semibold text-pos">Kỷ lục mới của bạn!</p>}
        <div className="mt-6 flex flex-col gap-2">
          {level !== 'kho' && <button onClick={() => { setModal(null); onLevel(level === 'de' ? 'vua' : 'kho') }} className="btn btn-pill btn-ink">Thử mức {level === 'de' ? 'Vừa' : 'Khó'}</button>}
          <button onClick={() => { setModal(null); onNew() }} className="btn btn-pill btn-line">Câu đố mới</button>
          <Link to="/tro-choi" className="mt-1 font-sans text-[13px] font-semibold underline">Về trang Trò chơi</Link>
        </div>
      </Modal>
    </div>
  )
}
