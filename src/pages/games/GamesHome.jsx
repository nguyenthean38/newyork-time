/* Trang chủ Trò chơi */
import { Link } from 'react-router-dom'
import { Flame, Trophy, Timer, PenLine, ArrowRight } from 'lucide-react'
import { useTitle } from '@/components/ui'
import { useGames, liveStreak, fmtTime } from '@/features/games/store.js'
import { dayKey, dayNumber } from '@/features/games/chuan.js'
import { puzzleForDay } from '@/features/games/botu.js'
import { LEVELS } from '@/features/games/sudoku.js'
import { GameHeader, GameIcon } from './GameKit'

function Card({ to, icon, color, title, desc, meta, status, secondary }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-rule bg-paper shadow-[0_1px_0_var(--c-rule)]">
      <Link to={to} className="flex flex-col items-center px-6 pb-6 pt-8 text-center text-[#121212]" style={{ background: color }}>
        <GameIcon kind={icon} size={58} />
        <h2 className="mt-3 font-mast text-[28px] font-black leading-none">{title}</h2>
        <p className="mt-2 max-w-[240px] font-serif text-[16px] leading-snug">{desc}</p>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between font-sans text-[12px] text-muted">
          <span>{meta}</span>
          {status && <span className="rounded-full bg-paper-3 px-2 py-0.5 font-semibold text-ink">{status}</span>}
        </div>
        <div className="mt-auto flex gap-2">
          <Link to={to} className="btn btn-pill btn-ink flex-1">Chơi</Link>
          {secondary}
        </div>
      </div>
    </article>
  )
}

export default function GamesHome() {
  useTitle('Trò chơi')
  const today = new Date()
  const k = dayKey(today)
  const chuAn = useGames((s) => s.chuAn)
  const boTu = useGames((s) => s.boTu)
  const sudoku = useGames((s) => s.sudoku)
  const ca = chuAn.boards[`d-${k}`]
  const bt = boTu.boards[`b-${k}`]
  const botuNo = puzzleForDay(today).number
  const label = (b, total) => (b?.status === 'won' ? 'Đã giải' : b?.status === 'lost' ? 'Đã chơi' : b && (b.guesses?.length || b.history?.length) ? `Đang chơi${total ? ` · ${b.guesses?.length || 0}/${total}` : ''}` : null)
  const dateStr = today.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="min-h-dvh bg-paper-2">
      <GameHeader />
      <section className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-5xl px-4 py-10 text-center sm:py-14">
          <div className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">{dateStr}</div>
          <h1 className="mt-3 font-mast text-[40px] font-black leading-[1.05] sm:text-[56px]">Trò chơi chữ tiếng Việt</h1>
          <p className="mx-auto mt-3 max-w-xl font-serif text-[19px] leading-snug text-ink-2">Mỗi ngày một câu đố mới — cho mười phút cà phê sáng hay chuyến tàu về nhà.</p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            to="/tro-choi/chu-an"
            icon="chuan"
            color="#cfe8c4"
            title="Chữ Ẩn"
            desc="Đoán từ 5 chữ cái (gõ không dấu) trong 6 lượt."
            meta={`Số ${dayNumber(today) + 1}`}
            status={label(ca, 6)}
            secondary={<Link to={`/tro-choi/chu-an?ngau-nhien=${dayNumber(today) * 7}`} className="btn btn-pill btn-line">Luyện tập</Link>}
          />
          <Card
            to="/tro-choi/bo-tu"
            icon="botu"
            color="#dccdf0"
            title="Bộ Tứ"
            desc="Xếp 16 từ thành 4 nhóm có điểm chung."
            meta={`Số ${botuNo}`}
            status={label(bt)}
          />
          <Card
            to="/tro-choi/sudoku"
            icon="sudoku"
            color="#fbd7b3"
            title="Sudoku"
            desc="Ba mức Dễ, Vừa, Khó — câu đố mới mỗi ngày."
            meta={`${sudoku.solved || 0} câu đố đã giải`}
          />
        </div>

        {/* Thống kê */}
        <section className="mt-10 rounded-lg border border-rule bg-paper p-6">
          <h2 className="font-sans text-[13px] font-bold uppercase tracking-[0.1em]">Thống kê của bạn</h2>
          <div className="mt-5 grid grid-cols-2 gap-5 font-sans sm:grid-cols-4">
            <Stat icon={<Flame size={18} className="text-son" />} value={liveStreak(chuAn.stats)} label="Chuỗi Chữ Ẩn" sub={`Dài nhất: ${chuAn.stats.maxStreak}`} />
            <Stat icon={<Trophy size={18} className="text-near" />} value={chuAn.stats.played ? `${Math.round((chuAn.stats.wins / chuAn.stats.played) * 100)}%` : '—'} label="Tỷ lệ thắng Chữ Ẩn" sub={`${chuAn.stats.played} ván`} />
            <Stat icon={<Flame size={18} className="text-[#8a6fd1]" />} value={liveStreak(boTu.stats)} label="Chuỗi Bộ Tứ" sub={`${boTu.stats.perfect || 0} lần không sai`} />
            <Stat
              icon={<Timer size={18} className="text-link" />}
              value={sudoku.best?.de ? fmtTime(sudoku.best.de) : '—'}
              label="Kỷ lục Sudoku Dễ"
              sub={Object.entries(LEVELS).filter(([l]) => l !== 'de' && sudoku.best?.[l]).map(([l, v]) => `${v.name} ${fmtTime(sudoku.best[l])}`).join(' · ') || 'Chưa có kỷ lục khác'}
            />
          </div>
          <p className="mt-5 font-sans text-[12px] text-muted">Thống kê được lưu trên trình duyệt này.</p>
        </section>

        {/* Tự tạo */}
        <Link to="/tro-choi/tao-chu-an" className="group mt-6 flex flex-col items-start gap-5 rounded-lg border border-rule bg-[#fbefc4] p-6 text-[#121212] sm:flex-row sm:items-center">
          <GameIcon kind="create" size={56} />
          <div className="flex-1">
            <h2 className="font-mast text-[26px] font-black leading-tight">Tạo câu đố của bạn</h2>
            <p className="mt-1 font-serif text-[16px]">Chọn một từ 4–7 chữ cái, gửi đường dẫn và xem bạn bè mất bao nhiêu lượt.</p>
          </div>
          <span className="btn btn-pill bg-[#121212] text-white"><PenLine size={15} /> Tạo ngay <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></span>
        </Link>

        <p className="mt-10 text-center font-sans text-[12px] text-muted">
          Trò chơi do Tân Thời biên soạn cho bản demo. <Link to="/" className="underline">Về trang nhất</Link>
        </p>
      </main>
    </div>
  )
}

function Stat({ icon, value, label, sub }) {
  return (
    <div>
      <div className="flex items-center gap-2">{icon}<span className="text-[28px] font-semibold leading-none tabular-nums">{value}</span></div>
      <div className="mt-1.5 text-[13px] font-semibold">{label}</div>
      <div className="text-[12px] text-muted">{sub}</div>
    </div>
  )
}
