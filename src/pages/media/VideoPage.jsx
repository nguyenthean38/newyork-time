/* Video: trang nền tối, các hàng video theo nhóm, mở trình xem truyện dọc */
import { useState } from 'react'
import { Play } from 'lucide-react'
import { VIDEOS, VIDEO_GROUPS, fmtDuration } from '@/data/media'
import { Img, useTitle } from '@/components/ui'
import { StoryPlayer } from '@/features/media/StoryPlayer'
import { timeAgo } from '@/lib/format'

function VideoCard({ v, onOpen, big }) {
  return (
    <button onClick={onOpen} className="group block w-[240px] shrink-0 text-left sm:w-auto">
      <div className="relative overflow-hidden rounded-sm">
        <Img k={v.slides[0].img} ratio={big ? '9/14' : '4/5'} alt={v.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <span className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-transform group-hover:scale-110">
          <Play size={20} fill="currentColor" className="translate-x-0.5" />
        </span>
        <span className="absolute bottom-2 right-2 rounded-sm bg-black/60 px-1.5 py-0.5 font-sans text-[11px] font-semibold text-white">{fmtDuration(v.duration)}</span>
        <span className="absolute left-2 top-2 font-serif text-[13px] font-bold text-white drop-shadow">{v.place}</span>
      </div>
      <h3 className="mt-2 font-serif text-[16px] font-bold leading-snug text-white group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{v.title}</h3>
      <div className="mt-1 font-sans text-[12px] text-white/55">{v.by} · {timeAgo(v.hoursAgo)}</div>
    </button>
  )
}

export default function VideoPage() {
  useTitle('Video')
  const [open, setOpen] = useState(null) // chỉ số trong VIDEOS
  const lead = VIDEOS[0]

  return (
    <div className="dark -mb-16 bg-[#0d0d0d] pb-16 text-white">
      <div className="wrap py-8">
        <h1 className="font-serif text-[34px] font-bold">Video</h1>
        <p className="font-sans text-[14px] text-white/60">Phóng sự, tài liệu ngắn và câu chuyện bằng hình ảnh từ phóng viên Tân Thời.</p>

        {/* Nổi bật */}
        <button onClick={() => setOpen(0)} className="group mt-6 grid w-full items-center gap-6 text-left md:grid-cols-[minmax(0,320px)_1fr]">
          <div className="relative mx-auto w-full max-w-[320px] overflow-hidden rounded-sm">
            <Img k={lead.slides[0].img} ratio="9/14" alt={lead.title} priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 backdrop-blur-sm transition-transform group-hover:scale-110"><Play size={26} fill="currentColor" className="translate-x-0.5" /></span>
            <p className="absolute inset-x-4 bottom-4 font-serif text-[17px] font-semibold leading-snug text-black">
              <span className="box-decoration-clone bg-white px-1.5 [-webkit-box-decoration-break:clone]">{lead.slides[0].text}</span>
            </p>
          </div>
          <div>
            <div className="kicker text-son">Đang được xem nhiều</div>
            <h2 className="mt-2 font-serif text-[30px] font-bold leading-tight sm:text-[38px]">{lead.title}</h2>
            <p className="mt-3 max-w-lg font-serif text-[18px] leading-snug text-white/75">{lead.slides.map((s) => s.text).slice(1, 3).join(' ')}</p>
            <div className="mt-3 font-sans text-[13px] text-white/55">{lead.by} · {fmtDuration(lead.duration)}</div>
          </div>
        </button>

        {VIDEO_GROUPS.map((g) => {
          const list = VIDEOS.map((v, i) => ({ v, i })).filter(({ v }) => v.group === g)
          return (
            <section key={g} className="mt-12">
              <h2 className="mb-4 border-t border-white/25 pt-2 font-sans text-[15px] font-bold">{g}</h2>
              <div className="no-scrollbar -mx-4 flex gap-5 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-4">
                {list.map(({ v, i }) => <VideoCard key={v.id} v={v} onOpen={() => setOpen(i)} />)}
              </div>
            </section>
          )
        })}

        <p className="mt-12 font-sans text-[12px] text-white/40">Video minh hoạ được dựng từ ảnh tĩnh (Wikimedia Commons), không có âm thanh. Nhân vật và sự kiện là hư cấu.</p>
      </div>

      {open !== null && <StoryPlayer videos={VIDEOS} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </div>
  )
}
