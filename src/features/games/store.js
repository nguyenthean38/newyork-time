/* ==========================================================
   Kho trạng thái khu Trò chơi (lưu localStorage 'tt-games'):
   bàn chơi đang dở, thống kê chuỗi ngày thắng, cài đặt.
   ========================================================== */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { dayNumber, parseDay } from './chuan.js'

const emptyStats = () => ({ played: 0, wins: 0, streak: 0, maxStreak: 0, dist: [0, 0, 0, 0, 0, 0], lastDay: null })

/** Cập nhật thống kê khi kết thúc một câu đố theo ngày. */
function bump(stats, dayKeyStr, won, tries) {
  const s = { ...stats, dist: [...(stats.dist || [0, 0, 0, 0, 0, 0])] }
  const d = parseDay(dayKeyStr)
  const n = d ? dayNumber(d) : null
  s.played += 1
  if (won) {
    s.wins += 1
    s.streak = s.lastDay != null && n != null && n - s.lastDay === 1 ? s.streak + 1 : 1
    s.maxStreak = Math.max(s.maxStreak, s.streak)
    s.lastDay = n
    if (tries) s.dist[tries - 1] = (s.dist[tries - 1] || 0) + 1
  } else {
    s.streak = 0
    s.lastDay = n
  }
  return s
}

export const useGames = create(
  persist(
    (set, get) => ({
      settings: { hard: false, contrast: false, onscreenOnly: false, seenHelp: false },
      chuAn: { boards: {}, stats: emptyStats() },
      boTu: { boards: {}, stats: { ...emptyStats(), perfect: 0 } },
      sudoku: { boards: {}, best: {}, solved: 0 },

      setSetting: (k, v) => set((s) => ({ settings: { ...s.settings, [k]: v } })),

      /* Chữ Ẩn */
      saveChuAn: (key, board) => set((s) => ({ chuAn: { ...s.chuAn, boards: { ...s.chuAn.boards, [key]: board } } })),
      finishChuAn: (dayKeyStr, won, tries) => set((s) => ({ chuAn: { ...s.chuAn, stats: bump(s.chuAn.stats, dayKeyStr, won, tries) } })),

      /* Bộ Tứ */
      saveBoTu: (key, board) => set((s) => ({ boTu: { ...s.boTu, boards: { ...s.boTu.boards, [key]: board } } })),
      finishBoTu: (dayKeyStr, won, mistakes) => set((s) => {
        const stats = bump(s.boTu.stats, dayKeyStr, won, 0)
        stats.perfect = (s.boTu.stats.perfect || 0) + (won && mistakes === 0 ? 1 : 0)
        return { boTu: { ...s.boTu, stats } }
      }),

      /* Sudoku */
      saveSudoku: (key, board) => set((s) => ({ sudoku: { ...s.sudoku, boards: { ...s.sudoku.boards, [key]: board } } })),
      finishSudoku: (level, seconds) => {
        const { best, solved } = get().sudoku
        const prev = best[level]
        set((s) => ({ sudoku: { ...s.sudoku, solved: solved + 1, best: { ...best, [level]: prev ? Math.min(prev, seconds) : seconds } } }))
        return !prev || seconds < prev
      },
    }),
    {
      name: 'tt-games',
      version: 1,
      // Giữ tối đa 40 bàn gần nhất mỗi trò để localStorage không phình
      partialize: (s) => {
        const trim = (o) => Object.fromEntries(Object.entries(o).slice(-40))
        return {
          settings: s.settings,
          chuAn: { ...s.chuAn, boards: trim(s.chuAn.boards) },
          boTu: { ...s.boTu, boards: trim(s.boTu.boards) },
          sudoku: { ...s.sudoku, boards: trim(s.sudoku.boards) },
        }
      },
    },
  ),
)

/** Chuỗi ngày thắng còn hiệu lực (mất nếu bỏ lỡ hôm qua). */
export function liveStreak(stats) {
  if (!stats?.streak || stats.lastDay == null) return 0
  const today = dayNumber(new Date())
  return today - stats.lastDay <= 1 ? stats.streak : 0
}

export const fmtTime = (sec) => {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
