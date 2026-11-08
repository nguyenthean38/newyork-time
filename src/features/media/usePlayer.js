/* ==========================================================
   Trình phát giả lập: đồng hồ chạy theo tốc độ, tua ±15 giây, kéo thanh tiến trình.
   Tuỳ chọn "giọng đọc máy": dùng speechSynthesis (vi-VN nếu trình duyệt có)
   để đọc bản ghi từng dòng, đồng bộ vị trí với dòng đang đọc.
   ========================================================== */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export const SPEEDS = [0.75, 1, 1.25, 1.5, 2]

/** Chia thời lượng cho từng dòng bản ghi theo độ dài chữ. */
export function timeline(lines, duration) {
  const total = lines.reduce((s, l) => s + l.text.length, 0) || 1
  let t = 0
  return lines.map((l) => {
    const start = t
    t += (l.text.length / total) * duration
    return { ...l, start, end: t }
  })
}

export function canSpeak() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function usePlayer({ duration, lines = [] }) {
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [voice, setVoice] = useState(false)
  const tl = useMemo(() => timeline(lines, duration), [lines, duration])
  const timeRef = useRef(0)
  timeRef.current = time

  const current = useMemo(() => {
    const i = tl.findIndex((l) => time >= l.start && time < l.end)
    return i === -1 ? (time >= duration ? tl.length - 1 : 0) : i
  }, [tl, time, duration])

  /* Đồng hồ giả lập */
  useEffect(() => {
    if (!playing || voice) return
    let last = performance.now()
    const id = setInterval(() => {
      const now = performance.now()
      const dt = ((now - last) / 1000) * speed
      last = now
      setTime((t) => {
        const n = t + dt
        if (n >= duration) { setPlaying(false); return duration }
        return n
      })
    }, 200)
    return () => clearInterval(id)
  }, [playing, speed, duration, voice])

  /* Giọng đọc máy */
  const speakFrom = useCallback((i) => {
    if (!canSpeak()) return
    const synth = window.speechSynthesis
    synth.cancel()
    const viVoice = synth.getVoices().find((v) => v.lang?.toLowerCase().startsWith('vi'))
    const speakLine = (k) => {
      if (k >= tl.length) { setPlaying(false); return }
      setTime(tl[k].start)
      const u = new SpeechSynthesisUtterance(tl[k].text)
      u.lang = 'vi-VN'
      if (viVoice) u.voice = viVoice
      u.rate = speed
      u.onend = () => { if (!u._stop) speakLine(k + 1) }
      synth.speak(u)
    }
    speakLine(i)
  }, [tl, speed])

  useEffect(() => {
    if (!voice || !canSpeak()) return
    if (playing) speakFrom(current)
    else window.speechSynthesis.cancel()
    // chỉ khởi động lại khi bật/tắt phát hoặc đổi chế độ / tốc độ
  }, [playing, voice, speed]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => { if (canSpeak()) window.speechSynthesis.cancel() }, [])

  const seek = useCallback((t) => {
    const n = Math.max(0, Math.min(duration, t))
    setTime(n)
    if (voice && playing) {
      const i = tl.findIndex((l) => n >= l.start && n < l.end)
      speakFrom(i === -1 ? 0 : i)
    }
  }, [duration, voice, playing, tl, speakFrom])

  const toggle = useCallback(() => {
    setPlaying((p) => {
      if (!p && timeRef.current >= duration) setTime(0)
      return !p
    })
  }, [duration])

  return {
    time, playing, speed, voice, current, timeline: tl,
    toggle, seek, skip: (d) => seek(timeRef.current + d),
    setSpeed, cycleSpeed: () => setSpeed((s) => SPEEDS[(SPEEDS.indexOf(s) + 1) % SPEEDS.length]),
    setVoice: (v) => { if (canSpeak()) window.speechSynthesis.cancel(); setVoice(v) },
    jumpToLine: (i) => seek(tl[i]?.start || 0),
  }
}
