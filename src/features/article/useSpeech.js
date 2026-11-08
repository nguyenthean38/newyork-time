/* ==========================================================
   Đọc thành tiếng bằng Web Speech API (giọng vi-VN của trình duyệt).
   Không có giọng tiếng Việt → vẫn chạy bằng giọng mặc định.
   Không hỗ trợ → `supported = false`, nút Nghe sẽ ẩn hoặc báo lỗi nhẹ.
   ========================================================== */
import { useCallback, useEffect, useRef, useState } from 'react'

const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined

function pickVoice() {
  const voices = synth?.getVoices() || []
  return voices.find((v) => v.lang?.toLowerCase().startsWith('vi')) || null
}

/** Chia văn bản thành câu ngắn để trình duyệt không cắt giữa chừng. */
function chunk(text) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?…:;])\s+/)
    .reduce((acc, s) => {
      const last = acc.at(-1)
      if (last && last.length + s.length < 180) acc[acc.length - 1] = `${last} ${s}`
      else acc.push(s)
      return acc
    }, [])
    .filter(Boolean)
}

export function useSpeech() {
  const [state, setState] = useState('idle') // idle | playing | paused
  const [progress, setProgress] = useState(0) // 0..1
  const [rate, setRate] = useState(1)
  const parts = useRef([])
  const idx = useRef(0)
  const supported = Boolean(synth)

  const stop = useCallback(() => {
    synth?.cancel()
    idx.current = 0
    setProgress(0)
    setState('idle')
  }, [])

  useEffect(() => () => synth?.cancel(), [])

  const speakFrom = useCallback((i, r) => {
    if (!synth) return
    synth.cancel()
    idx.current = i
    const next = (k) => {
      if (k >= parts.current.length) {
        setState('idle')
        setProgress(1)
        return
      }
      const u = new SpeechSynthesisUtterance(parts.current[k])
      const v = pickVoice()
      if (v) u.voice = v
      u.lang = 'vi-VN'
      u.rate = r
      u.onend = () => {
        if (idx.current !== k) return
        idx.current = k + 1
        setProgress((k + 1) / parts.current.length)
        next(k + 1)
      }
      synth.speak(u)
    }
    next(i)
    setState('playing')
  }, [])

  const play = useCallback((text) => {
    if (!synth) return false
    if (state === 'paused') {
      synth.resume()
      setState('playing')
      return true
    }
    parts.current = chunk(text)
    setProgress(0)
    speakFrom(0, rate)
    return true
  }, [state, rate, speakFrom])

  const pause = useCallback(() => {
    synth?.pause()
    setState('paused')
  }, [])

  const changeRate = useCallback((r) => {
    setRate(r)
    if (state === 'playing') speakFrom(idx.current, r)
  }, [state, speakFrom])

  const skip = useCallback((delta) => {
    if (!parts.current.length) return
    const k = Math.min(parts.current.length - 1, Math.max(0, idx.current + delta))
    setProgress(k / parts.current.length)
    speakFrom(k, rate)
  }, [rate, speakFrom])

  return { supported, state, progress, rate, play, pause, stop, changeRate, skip }
}

/** Ghép tiêu đề + sapo + thân bài thành văn bản để đọc. */
export function articleText(a) {
  const body = a.body.map((b) => (typeof b === 'string' ? b : b.h || b.quote || (b.list ? b.list.join('. ') : ''))).join(' ')
  return `${a.title}. ${a.dek} ${body}`
}
