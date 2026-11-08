/* ==========================================================
   Sudoku: sinh lời giải ngẫu nhiên (có hạt giống), rồi khoét ô
   sao cho câu đố luôn có đúng một lời giải.
   ========================================================== */

export const LEVELS = {
  de: { name: 'Dễ', clues: 40 },
  vua: { name: 'Vừa', clues: 32 },
  kho: { name: 'Khó', clues: 26 },
}

function rng(seed) {
  let h = seed >>> 0 || 1
  return () => {
    h ^= h << 13; h >>>= 0
    h ^= h >>> 17
    h ^= h << 5; h >>>= 0
    return h / 4294967296
  }
}

export function hashStr(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

const ROW = (i) => Math.floor(i / 9)
const COL = (i) => i % 9
const BOX = (i) => Math.floor(ROW(i) / 3) * 3 + Math.floor(COL(i) / 3)

/** Các ô cùng hàng / cột / khối với ô i (không gồm i). */
export const PEERS = Array.from({ length: 81 }, (_, i) => {
  const set = new Set()
  for (let j = 0; j < 81; j++) {
    if (j !== i && (ROW(j) === ROW(i) || COL(j) === COL(i) || BOX(j) === BOX(i))) set.add(j)
  }
  return [...set]
})
export { ROW, COL, BOX }

function candidates(grid, i) {
  const used = new Set(PEERS[i].map((j) => grid[j]))
  const out = []
  for (let v = 1; v <= 9; v++) if (!used.has(v)) out.push(v)
  return out
}

function fill(grid, rand) {
  const i = grid.indexOf(0)
  if (i === -1) return true
  const cand = candidates(grid, i).sort(() => rand() - 0.5)
  for (const v of cand) {
    grid[i] = v
    if (fill(grid, rand)) return true
  }
  grid[i] = 0
  return false
}

/** Đếm số lời giải, dừng khi đạt `limit`. Chọn ô ít ứng viên nhất để nhanh. */
function countSolutions(grid, limit = 2) {
  let best = -1
  let bestCand = null
  for (let i = 0; i < 81; i++) {
    if (grid[i]) continue
    const c = candidates(grid, i)
    if (c.length === 0) return 0
    if (!bestCand || c.length < bestCand.length) {
      best = i
      bestCand = c
      if (c.length === 1) break
    }
  }
  if (best === -1) return 1
  let total = 0
  for (const v of bestCand) {
    grid[best] = v
    total += countSolutions(grid, limit - total)
    if (total >= limit) break
  }
  grid[best] = 0
  return total
}

/** @returns {{ puzzle:number[], solution:number[] }} mảng 81 số, 0 = ô trống */
export function generate(level = 'vua', seed = Date.now()) {
  const rand = rng(seed)
  const solution = Array(81).fill(0)
  fill(solution, rand)
  const puzzle = [...solution]
  const order = Array.from({ length: 81 }, (_, i) => i).sort(() => rand() - 0.5)
  let clues = 81
  const target = LEVELS[level]?.clues ?? 32
  for (const i of order) {
    if (clues <= target) break
    const keep = puzzle[i]
    puzzle[i] = 0
    if (countSolutions([...puzzle]) !== 1) puzzle[i] = keep
    else clues--
  }
  return { puzzle, solution }
}
