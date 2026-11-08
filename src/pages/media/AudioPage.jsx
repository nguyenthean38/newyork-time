/* Nghe: chương trình nổi bật, các chương trình, tập mới, bài báo có giọng đọc */
import { Link } from 'react-router-dom'
import { Play, Headphones, ChevronRight } from 'lucide-react'
import { SHOWS, EPISODES, SHOW_BY_ID, episodesOf, fmtDuration } from '@/data/media'
import { ARTICLES, listenSeconds } from '@/data'
import { Img, useTitle } from '@/components/ui'
import { bylineText } from '@/components/story/Story'
import { timeAgo } from '@/lib/format'

function EpisodeCard({ e }) {
  const show = SHOW_BY_ID[e.show]
  return (
    <Link to={`/nghe/${e.id}`} className="group block w-[220px] shrink-0 sm:w-auto">
      <div className="relative">
        <Img k={show.image} ratio="1/1" alt={show.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="absolute left-3 top-3 rounded-sm px-1.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-white" style={{ background: show.color }}>{show.name}</span>
        <span className="absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:scale-110"><Play size={17} fill="currentColor" className="translate-x-px" /></span>
        <span className="absolute bottom-4 right-3 font-sans text-[12px] font-semibold text-white">{fmtDuration(e.duration)}</span>
      </div>
      <div className="meta mt-2">{timeAgo(e.hoursAgo)}</div>
      <h3 className="hl story-link mt-1 text-[16px] leading-snug">{e.title}</h3>
    </Link>
  )
}

export default function AudioPage() {
  useTitle('Nghe')
  const hero = EPISODES[0]
  const heroShow = SHOW_BY_ID[hero.show]
  const listen = ARTICLES.filter((a) => !a.live).slice(0, 6)

  return (
    <div className="wrap py-8">
      <h1 className="font-serif text-[34px] font-bold">Nghe</h1>
      <p className="font-sans text-[14px] text-muted">Podcast, bản tin âm thanh và bài báo có giọng đọc.</p>

      {/* Nổi bật */}
      <Link to={`/nghe/${hero.id}`} className="group mt-6 grid overflow-hidden rounded bg-ink text-paper md:grid-cols-[1.3fr_1fr]">
        <div className="relative min-h-[240px]">
          <Img k="micro" ratio="16/10" className="h-full [&>div]:h-full" imgClass="opacity-90" alt="Micro thu âm" priority />
        </div>
        <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
          <span className="kicker text-paper/70">{heroShow.name} · Tập mới</span>
          <h2 className="font-serif text-[26px] font-bold leading-tight sm:text-[30px]">{hero.title}</h2>
          <p className="font-serif text-[16px] leading-snug text-paper/80">{hero.desc}</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-son text-white transition-transform group-hover:scale-105"><Play size={20} fill="currentColor" className="translate-x-px" /></span>
            <span className="font-sans text-[13px] text-paper/80">Nghe · {fmtDuration(hero.duration)}</span>
          </div>
        </div>
      </Link>

      {/* Tập mới */}
      <section className="mt-12">
        <div className="mb-4 flex items-baseline justify-between border-t border-ink pt-2">
          <h2 className="font-sans text-[15px] font-bold">Tập mới nhất</h2>
        </div>
        <div className="no-scrollbar -mx-4 flex gap-5 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5">
          {EPISODES.slice(0, 5).map((e) => <EpisodeCard key={e.id} e={e} />)}
        </div>
      </section>

      {/* Chương trình */}
      <section className="mt-12">
        <div className="mb-4 border-t border-ink pt-2"><h2 className="font-sans text-[15px] font-bold">Các chương trình</h2></div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SHOWS.map((s) => {
            const eps = episodesOf(s.id)
            return (
              <article key={s.id} className="flex gap-4 border-b border-rule pb-6">
                <div className="relative w-[110px] shrink-0">
                  <Img k={s.image} ratio="1/1" alt={s.name} />
                  <span className="absolute inset-x-0 bottom-0 px-2 py-1 text-center font-mast text-[14px] font-black leading-tight text-white" style={{ background: s.color }}>{s.name}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-[19px] font-bold">{s.name}</h3>
                  <div className="font-sans text-[12px] text-muted">{s.host} · {s.freq}</div>
                  <p className="mt-1.5 font-sans text-[13px] leading-snug text-ink-2">{s.desc}</p>
                  {eps[0] && (
                    <Link to={`/nghe/${eps[0].id}`} className="mt-2 inline-flex items-center gap-1 font-sans text-[12px] font-semibold underline underline-offset-2">
                      <Play size={11} fill="currentColor" /> {eps[0].title}
                    </Link>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Nghe bài báo */}
      <section className="mt-12">
        <div className="mb-2 flex items-baseline justify-between border-t border-ink pt-2">
          <h2 className="flex items-center gap-2 font-sans text-[15px] font-bold"><Headphones size={16} /> Nghe bài báo</h2>
          <span className="font-sans text-[12px] text-muted">Giọng đọc máy tiếng Việt</span>
        </div>
        <ul className="grid gap-x-8 md:grid-cols-2">
          {listen.map((a) => (
            <li key={a.slug} className="border-b border-rule">
              <Link to={`/bai/${a.slug}`} className="group flex items-center gap-4 py-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-ink transition-colors group-hover:bg-ink group-hover:text-paper"><Play size={15} fill="currentColor" className="translate-x-px" /></span>
                <span className="min-w-0 flex-1">
                  <span className="hl story-link line-clamp-2 text-[16px] leading-snug">{a.title}</span>
                  <span className="mt-0.5 block font-sans text-[12px] text-muted">{bylineText(a)} · {fmtDuration(listenSeconds(a))}</span>
                </span>
                <ChevronRight size={16} className="shrink-0 text-faint" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
