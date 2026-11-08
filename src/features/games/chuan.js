/* Logic trò Chữ Ẩn: đáp án theo ngày, chấm điểm, mã hoá câu đố tự tạo, chia sẻ */
import { ANSWERS } from './words.js'

/* ---------- Ngày ---------- */
export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export function parseDay(key) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key || '')
  if (!m) return null
  const d = new Date(+m[1], +m[2] - 1, +m[3])
  return Number.isNaN(d.getTime()) ? null : d
}

const EPOCH = new Date(2026, 0, 1)
/** Số thứ tự ngày kể từ 1/1/2026 (dùng làm "Số" câu đố). */
export const dayNumber = (d = new Date()) => Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - EPOCH) / 86400000)

export const viDate = (d) => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`

/* Thứ tự đáp án xáo trộn cố định để ngày liền nhau không theo bảng chữ cái */
function shuffledOrder(n, seed = 20261108) {
  const idx = Array.from({ length: n }, (_, i) => i)
  let s = seed
  const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]]
  }
  return idx
}
const ORDER = shuffledOrder(ANSWERS.length)

export function answerForDay(d) {
  const n = dayNumber(d)
  return ANSWERS[ORDER[((n % ANSWERS.length) + ANSWERS.length) % ANSWERS.length]]
}

/* ---------- Chấm điểm ---------- */
/** @returns {Array<'hit'|'near'|'miss'>} */
export function evaluate(guess, answer) {
  const res = Array(guess.length).fill('miss')
  const left = {}
  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) res[i] = 'hit'
    else left[answer[i]] = (left[answer[i]] || 0) + 1
  }
  for (let i = 0; i < guess.length; i++) {
    if (res[i] === 'hit') continue
    if (left[guess[i]]) {
      res[i] = 'near'
      left[guess[i]]--
    }
  }
  return res
}

/** Trạng thái tốt nhất của từng phím trên bàn phím. */
export function keyStates(guesses, answer) {
  const rank = { miss: 1, near: 2, hit: 3 }
  const map = {}
  for (const g of guesses) {
    evaluate(g, answer).forEach((st, i) => {
      const k = g[i]
      if (!map[k] || rank[st] > rank[map[k]]) map[k] = st
    })
  }
  return map
}

/** Chế độ khó: gợi ý đã lộ phải được dùng lại. Trả về thông báo lỗi hoặc null. */
export function hardModeError(guess, guesses, answer) {
  for (const g of guesses) {
    const ev = evaluate(g, answer)
    for (let i = 0; i < g.length; i++) {
      if (ev[i] === 'hit' && guess[i] !== g[i]) return `Chữ thứ ${i + 1} phải là ${g[i]}`
    }
    for (let i = 0; i < g.length; i++) {
      if (ev[i] === 'near') {
        const need = [...g].filter((c, j) => c === g[i] && ev[j] !== 'miss').length
        const have = [...guess].filter((c) => c === g[i]).length
        if (have < need) return `Từ đoán phải chứa chữ ${g[i]}`
      }
    }
  }
  return null
}

/* ---------- Câu đố tự tạo: mã hoá vào đường dẫn ---------- */
const KEY = 'tanthoi-chu-an'
function xor(bytes) {
  return bytes.map((b, i) => b ^ KEY.charCodeAt(i % KEY.length))
}
export function encodePuzzle({ w, n = '', m = '' }) {
  const bytes = xor([...new TextEncoder().encode(JSON.stringify({ w, n, m }))])
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
export function decodePuzzle(code) {
  try {
    const b64 = code.replace(/-/g, '+').replace(/_/g, '/')
    const bytes = xor([...atob(b64)].map((c) => c.charCodeAt(0)))
    const obj = JSON.parse(new TextDecoder().decode(new Uint8Array(bytes)))
    if (!/^[A-Z]{4,7}$/.test(obj.w)) return null
    return obj
  } catch {
    return null
  }
}

/* ---------- Chia sẻ ---------- */
export function shareText({ title, guesses, answer, won, hard, contrast }) {
  const sq = contrast ? { hit: '🟧', near: '🟦', miss: '⬜' } : { hit: '🟩', near: '🟨', miss: '⬜' }
  const grid = guesses.map((g) => evaluate(g, answer).map((s) => sq[s]).join('')).join('\n')
  return `${title} ${won ? guesses.length : 'X'}/6${hard ? '*' : ''}\n\n${grid}\n\nChơi tại Tân Thời · Trò chơi`
}

export async function copyText(text) {
  try {
    if (navigator.share && matchMedia('(pointer: coarse)').matches) {
      await navigator.share({ text })
      return 'shared'
    }
    await navigator.clipboard.writeText(text)
    return 'copied'
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
      return 'copied'
    } catch {
      return 'failed'
    }
  }
}
