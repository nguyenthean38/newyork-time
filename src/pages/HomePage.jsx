/* Trang nhất — bố cục báo in: cột chính + cột phải, các khối chuyên mục bên dưới */
import { Link } from 'react-router-dom'
import { Headphones, Pause, Play, ArrowRight, Grid3x3, Puzzle, Hash, Mail } from 'lucide-react'
import { Story, Kicker, articleUrl, bylineText } from '@/components/story/Story'
import { Img, SectionHead, Avatar, useTitle } from '@/components/ui'
import { pick, bySection, TRENDING, STORYLINES, authorsOf, getArticle } from '@/data'
import { SECTIONS } from '@/data/sections'
import { useSpeech } from '@/features/article/useSpeech'
import { timeAgo } from '@/lib/format'
import { cn } from '@/lib/cn'

/* Bản tin "Sáng Nay trong 5 phút" — đọc thành tiếng được */
const BRIEFING = [
  { slug: 'mua-lon-mien-trung-cap-nhat', text: 'Mưa lớn tiếp diễn ở Trung Bộ, mực nước sông Hương vượt báo động 2; một số chuyến tàu Bắc – Nam tạm dừng.' },
  { slug: 'mot-ngay-tren-tuyen-metro', text: 'Một ngày theo chân hành khách tuyến metro: thành phố đang học "văn hoá ga tàu".' },
  { slug: 'nha-may-dong-goi-chip', text: 'Bên trong phòng sạch nơi 2.000 kỹ sư trẻ học cách đóng gói con chip.' },
  { slug: 'xuat-khau-ca-phe-lap-ky-luc', text: 'Xuất khẩu cà phê lập kỷ lục, nhưng nông dân Tây Nguyên vẫn giữ vườn sầu riêng.' },
  { slug: 'song-han-fc-len-ngoi', text: 'Sông Hàn FC vô địch cúp quốc gia sau loạt luân lưu, thủ môn 20 tuổi cản phá hai quả.' },
]

function Briefing() {
  const sp = useSpeech()
  const text = 'Sáng Nay trong năm phút. ' + BRIEFING.map((b) => b.text).join(' ')
  return (
    <section className="border border-ink bg-paper-2 p-5" aria-label="Bản tin Sáng Nay">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="kicker text-son">Sáng Nay · 5 phút</div>
          <h2 className="mt-1 font-serif text-[22px] font-bold leading-tight">Những điều cần biết hôm nay</h2>
        </div>
        {sp.supported && (
          <button
            onClick={() => (sp.state === 'playing' ? sp.pause() : sp.play(text))}
            className="flex shrink-0 items-center gap-2 rounded-full border border-ink px-3 py-1.5 font-sans text-[12px] font-semibold hover:bg-paper"
            aria-label={sp.state === 'playing' ? 'Tạm dừng' : 'Nghe bản tin'}
          >
            {sp.state === 'playing' ? <Pause size={14} /> : <Headphones size={14} />}
            {sp.state === 'playing' ? 'Tạm dừng' : 'Nghe'}
          </button>
        )}
      </div>
      {sp.state !== 'idle' && (
        <div className="mt-3 h-1 overflow-hidden rounded bg-rule"><div className="h-full bg-son transition-[width] duration-500" style={{ width: `${sp.progress * 100}%` }} /></div>
      )}
      <ol className="mt-4 space-y-3">
        {BRIEFING.map((b, i) => (
          <li key={b.slug} className="flex gap-3">
            <span className="font-serif text-[20px] font-bold leading-none text-son">{i + 1}</span>
            <Link to={`/bai/${b.slug}`} className="font-serif text-[15px] leading-snug hover:underline">{b.text}</Link>
          </li>
        ))}
      </ol>
      <Link to="/ban-tin" className="mt-4 inline-flex items-center gap-1.5 font-sans text-[12px] font-semibold underline underline-offset-2">
        <Mail size={13} /> Nhận bản tin này qua email mỗi sáng
      </Link>
    </section>
  )
}

/* Bài trực tiếp: hiện hai cập nhật mới nhất */
function LiveBlock({ a }) {
  return (
    <article className="group">
      <Link to={articleUrl(a)} className="block">
        <Kicker a={a} />
        <h3 className="hl story-link text-[20px] leading-[1.22]">{a.title}</h3>
      </Link>
      <ul className="mt-2 space-y-1.5 border-l-2 border-son pl-3">
        {a.updates.slice(0, 2).map((u) => (
          <li key={u.title} className="font-serif text-[14px] leading-snug text-ink-2">
            <span className="mr-1.5 font-sans text-[11px] font-semibold text-son">{u.mins} phút trước</span>
            {u.title}
          </li>
        ))}
      </ul>
      <Link to={articleUrl(a)} className="mt-2 inline-block font-sans text-[13px] font-semibold hover:underline">Xem thêm cập nhật ›</Link>
    </article>
  )
}

/* Dải liên kết theo dòng chuyện */
function StorylineStrip({ id }) {
  const s = STORYLINES[id]
  return (
    <div className="no-scrollbar flex items-center gap-5 overflow-x-auto border-t border-ink py-3 font-sans text-[14px]">
      <span className="shrink-0 font-bold">{s.name}</span>
      {s.links.map((l) => (
        <Link key={l.slug} to={`/bai/${l.slug}`} className="shrink-0 text-ink-2 hover:text-ink hover:underline">{l.label}</Link>
      ))}
    </div>
  )
}

/* Khối chuyên mục: 1 bài có ảnh + 3 tiêu đề */
function SectionBlock({ slug }) {
  const sec = SECTIONS.find((s) => s.slug === slug)
  const list = bySection(slug)
  if (!list.length) return null
  const [lead, ...rest] = list
  return (
    <div>
      <SectionHead to={`/chuyen-muc/${slug}`}>{sec.name} ›</SectionHead>
      <Story a={lead} size="sm" img="top" />
      <ul className="mt-4 divide-y divide-rule border-t border-rule">
        {rest.slice(0, 3).map((a) => (
          <li key={a.slug} className="py-3"><Link to={articleUrl(a)} className="hl block text-[15px] leading-snug hover:text-ink-2">{a.title}</Link></li>
        ))}
      </ul>
    </div>
  )
}

/* Ý kiến: cây bút + tiêu đề */
function OpinionRail() {
  const ops = bySection('y-kien')
  return (
    <div>
      <SectionHead to="/chuyen-muc/y-kien">Ý kiến</SectionHead>
      <ul className="divide-y divide-rule">
        {ops.map((a) => {
          const au = authorsOf(a)[0]
          return (
            <li key={a.slug} className="py-3 first:pt-0">
              <Link to={articleUrl(a)} className="group flex gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-sans text-[12px] font-bold uppercase tracking-[0.04em] text-son">{au?.name}</div>
                  <div className="hl-light story-link mt-0.5 text-[17px] leading-snug">{a.title}</div>
                </div>
                <Avatar name={au?.name} tone={au?.tone} size={44} />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* Quảng bá trò chơi */
function GamesStrip() {
  const games = [
    { to: '/tro-choi/chu-an', name: 'Chữ Ẩn', desc: 'Đoán từ 5 chữ cái trong 6 lượt.', bg: 'bg-[#e8e3d3] dark:bg-[#3a3626]', icon: Grid3x3 },
    { to: '/tro-choi/bo-tu', name: 'Bộ Tứ', desc: 'Xếp 16 từ thành 4 nhóm.', bg: 'bg-[#d9d2f0] dark:bg-[#2f2a44]', icon: Puzzle },
    { to: '/tro-choi/sudoku', name: 'Sudoku', desc: 'Ba mức độ, mới mỗi ngày.', bg: 'bg-[#f3d9a4] dark:bg-[#41361f]', icon: Hash },
  ]
  return (
    <section className="mt-12">
      <SectionHead to="/tro-choi" more="Tất cả trò chơi">Trò chơi hôm nay</SectionHead>
      <div className="grid gap-4 sm:grid-cols-3">
        {games.map((g) => (
          <Link key={g.to} to={g.to} className={cn('group flex items-center gap-4 rounded-md p-4 transition-transform hover:-translate-y-0.5', g.bg)}>
            <span className="flex size-12 items-center justify-center rounded-md bg-paper text-ink shadow-sm"><g.icon size={24} /></span>
            <div className="min-w-0">
              <div className="font-serif text-[19px] font-bold">{g.name}</div>
              <div className="font-sans text-[13px] text-ink-2">{g.desc}</div>
            </div>
            <ArrowRight size={18} className="ml-auto shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </section>
  )
}

/* Dải Nghe & Xem nền tối, tràn hết chiều ngang */
function MediaBand() {
  const items = [
    { to: '/nghe', k: 'micro', kicker: 'Podcast · Sáng Nay', title: 'Bản tin 15 phút: metro, mưa lũ và giá cà phê' },
    { to: '/video', k: 'mua-roi', kicker: 'Video · 4:12', title: 'Thuỷ đình lưu động: một ngày cùng nghệ nhân rối nước' },
    { to: '/video', k: 'ha-long', kicker: 'Video · 2:48', title: 'Vịnh Hạ Long nhìn từ một chiếc thuyền nan' },
    { to: '/nghe', k: 'thu-vien', kicker: 'Podcast · Đọc Chậm', title: '"Mùa nước nổi" và giọng văn của sông' },
  ]
  return (
    <section className="mt-14 bg-[#121212] py-10 text-[#ececec]" aria-label="Nghe và xem">
      <div className="wrap">
        <div className="mb-5 flex items-baseline justify-between border-t border-[#ececec] pt-2">
          <h2 className="font-sans text-[15px] font-bold">Nghe & Xem</h2>
          <div className="flex gap-4 font-sans text-[13px] text-[#a3a3a3]"><Link to="/nghe" className="hover:text-white">Podcast ›</Link><Link to="/video" className="hover:text-white">Video ›</Link></div>
        </div>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {items.map((it) => (
            <Link key={it.title} to={it.to} className="group">
              <div className="relative">
                <Img k={it.k} ratio="4/5" />
                <span className="absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-full bg-white/90 text-black transition-transform group-hover:scale-110"><Play size={17} fill="currentColor" /></span>
              </div>
              <div className="mt-2 font-sans text-[11px] uppercase tracking-[0.08em] text-[#a3a3a3]">{it.kicker}</div>
              <div className="mt-1 font-serif text-[16px] font-bold leading-snug group-hover:underline">{it.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* Đọc nhiều nhất */
function MostRead() {
  return (
    <div>
      <SectionHead>Đọc nhiều nhất</SectionHead>
      <ol className="space-y-4">
        {TRENDING.slice(0, 6).map((a, i) => (
          <li key={a.slug} className="flex gap-3">
            <span className="w-6 shrink-0 font-serif text-[26px] font-bold leading-none text-faint">{i + 1}</span>
            <Link to={articleUrl(a)} className="min-w-0">
              <div className="hl text-[15px] leading-snug hover:text-ink-2">{a.title}</div>
              <div className="mt-1 font-sans text-[11px] text-muted">{a.comments} bình luận · {timeAgo(a.date)}</div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function HomePage() {
  useTitle()
  const lead = getArticle('mot-ngay-tren-tuyen-metro')
  const live = getArticle('mua-lon-mien-trung-cap-nhat')
  const [s1, s2, s3] = pick('gia-thue-nha-quanh-ga-metro', 'xe-buyt-dien-thay-doi-thoi-quen', 'truong-hoc-bo-diem-so-lop-mot')
  const second = getArticle('nha-may-dong-goi-chip')
  const rail = getArticle('mua-roi-nuoc-ra-pho')
  const [r1, r2] = pick('review-mua-nuoc-noi', 'cong-thuc-pho-bo-tai-nha')
  const [k1, k2, k3] = pick('xuat-khau-ca-phe-lap-ky-luc', 'tro-ly-ai-noi-giong-dia-phuong', 'hoi-nghi-khi-hau-quy-thich-ung')
  const latest = [...bySection('thoi-su'), ...bySection('the-gioi'), ...bySection('kinh-doanh')]
    .sort((a, b) => a.hoursAgo - b.hoursAgo)
    .slice(0, 6)

  return (
    <>
      <div className="wrap pt-5">
        <div className="grid gap-x-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* ---------- Cột chính ---------- */}
          <div className="min-w-0">
            <div className="grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,9fr)]">
              <div className="order-2 space-y-5 md:order-1">
                <Story a={lead} size="lg" dek priority />
                <div className="border-t border-rule pt-4"><LiveBlock a={live} /></div>
              </div>
              <div className="order-1 md:order-2">
                <Link to={articleUrl(lead)}><Img k={lead.image} ratio="3/2" credit priority alt={lead.caption} /></Link>
              </div>
            </div>

            <div className="mt-6 grid gap-5 border-t border-rule pt-4 sm:grid-cols-3 sm:divide-x sm:divide-rule">
              {[s1, s2, s3].map((a, i) => <Story key={a.slug} a={a} size="sm" className={cn(i > 0 && 'sm:pl-5')} />)}
            </div>

            <div className="mt-6"><StorylineStrip id="metro" /></div>

            <div className="grid gap-6 border-t border-rule pt-5 md:grid-cols-[minmax(0,5fr)_minmax(0,9fr)]">
              <div className="order-2 space-y-5 md:order-1">
                <Story a={second} size="md" dek byline />
                <div className="border-t border-rule pt-4"><Story a={k1} size="sm" dek /></div>
              </div>
              <Link to={articleUrl(second)} className="order-1 md:order-2"><Img k={second.image} ratio="16/10" credit alt={second.caption} /></Link>
            </div>

            <div className="mt-6 grid gap-5 border-t border-rule pt-4 sm:grid-cols-2 sm:divide-x sm:divide-rule">
              <Story a={k2} size="sm" img="right" ratio="1/1" />
              <Story a={k3} size="sm" img="right" ratio="1/1" className="sm:pl-5" />
            </div>
          </div>

          {/* ---------- Cột phải ---------- */}
          <aside className="mt-10 min-w-0 lg:mt-0 lg:border-l lg:border-rule lg:pl-8">
            <Story a={rail} size="lg" img="top" dek credit />
            <div className="mt-6 grid grid-cols-2 gap-5 border-t border-rule pt-5">
              <Story a={r1} size="xs" img="top" ratio="1/1" />
              <Story a={r2} size="xs" img="top" ratio="1/1" />
            </div>
            <div className="mt-8"><Briefing /></div>
            <div className="mt-8"><OpinionRail /></div>
          </aside>
        </div>

        <GamesStrip />

        <div className="mt-12"><StorylineStrip id="mua-lu" /></div>
        <div className="grid gap-10 border-t border-rule pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {['kinh-doanh', 'cong-nghe', 'khoa-hoc', 'the-gioi'].map((s) => <SectionBlock key={s} slug={s} />)}
        </div>
      </div>

      <MediaBand />

      <div className="wrap">
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {['van-hoa', 'doi-song', 'am-thuc', 'the-thao'].map((s) => <SectionBlock key={s} slug={s} />)}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <SectionHead to="/tim-kiem">Mới nhất</SectionHead>
            <ul className="divide-y divide-rule">
              {latest.map((a) => (
                <li key={a.slug} className="py-4 first:pt-0">
                  <Link to={articleUrl(a)} className="group grid grid-cols-[84px_1fr] gap-4">
                    <span className="pt-0.5 font-sans text-[12px] text-muted">{timeAgo(a.date)}</span>
                    <span>
                      <span className="hl story-link block text-[17px] leading-snug">{a.title}</span>
                      <span className="mt-1 block font-sans text-[12px] text-muted">{bylineText(a)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <MostRead />
        </div>
      </div>
    </>
  )
}
