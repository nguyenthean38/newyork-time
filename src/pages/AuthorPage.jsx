/* Trang tác giả: ảnh đại diện chữ cái, giới thiệu, liên hệ, bài mới nhất */
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Mail, MapPin, Lock, ShieldCheck } from 'lucide-react'
import { AUTHOR_BY_SLUG } from '@/data/authors'
import { byAuthor } from '@/data'
import { Avatar, useTitle } from '@/components/ui'
import { StoryRow } from '@/components/story/Story'
import { cn } from '@/lib/cn'
import NotFoundPage from './NotFoundPage'

const TABS = [['gioi-thieu', 'Giới thiệu'], ['lien-he', 'Liên hệ'], ['bai-moi', 'Bài mới nhất']]

export default function AuthorPage() {
  const { slug } = useParams()
  const au = AUTHOR_BY_SLUG[slug]
  const [tab, setTab] = useState('gioi-thieu')
  useTitle(au?.name)
  if (!au) return <NotFoundPage />
  const list = byAuthor(slug)

  return (
    <div className="wrap max-w-[1000px] py-10">
      <header className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <Avatar name={au.name} tone={au.tone} size={96} className="text-[40px]" />
        <div>
          <h1 className="font-serif text-[34px] font-bold leading-tight sm:text-[40px]">{au.name}</h1>
          <p className="mt-1 max-w-xl font-serif text-[17px] leading-snug text-ink-2">{au.bio}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-sans text-[13px] text-muted">
            <span>{au.role}{au.columnist ? ' · Ý kiến' : ''}</span>
            <span className="flex items-center gap-1"><MapPin size={13} /> {au.base}</span>
          </div>
        </div>
      </header>

      <div role="tablist" className="mt-8 flex gap-6 border-b border-rule font-sans text-[14px]">
        {TABS.map(([k, l]) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={cn('-mb-px border-b-2 pb-2.5 pt-1', tab === k ? 'border-ink font-semibold' : 'border-transparent text-muted hover:text-ink')}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="grid gap-10 pt-8 lg:grid-cols-[1fr_300px]">
        <div>
          {tab === 'gioi-thieu' && (
            <div className="max-w-[640px] font-serif text-[18px] leading-relaxed [&_h2]:mb-2 [&_h2]:mt-8 [&_h2]:text-[20px] [&_h2]:font-bold [&_li]:mb-1 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:ml-5 [&_ul]:list-disc">
              <h2 className="!mt-0">Tôi theo dõi gì</h2>
              <p>{au.bio}</p>
              <ul>{au.beats.map((b) => <li key={b}>{b}</li>)}</ul>
              <h2>Quá trình làm việc</h2>
              <p>{au.background}</p>
              <h2>Nguyên tắc nghề nghiệp</h2>
              <p>
                Phóng viên Tân Thời không nhận quà, chuyến đi hay tiền thù lao từ những người và tổ chức được nhắc tới trong bài viết.
                {au.columnist ? ' Quan điểm trong các bài bình luận là của riêng tác giả, không đại diện cho toà soạn.' : ''}
              </p>
            </div>
          )}
          {tab === 'lien-he' && (
            <div className="max-w-[560px] space-y-6 font-sans text-[14px]">
              <div>
                <div className="kicker mb-2">Email</div>
                <div className="flex items-center gap-2"><Mail size={15} className="text-muted" /> {slug}@tanthoi.demo <span className="text-[12px] text-faint">(địa chỉ minh hoạ)</span></div>
              </div>
              <div>
                <div className="kicker mb-2">Gửi thông tin bảo mật</div>
                <p className="leading-relaxed text-ink-2">
                  Nếu bạn có thông tin muốn chia sẻ với {au.name} một cách an toàn, hãy dùng kênh gửi tin bảo mật của toà soạn. Chúng tôi bảo vệ danh tính người cung cấp thông tin.
                </p>
                <div className="mt-3 flex items-center gap-2 rounded border border-rule bg-paper-2 px-3 py-2.5 text-[13px]"><Lock size={15} /> Kênh gửi tin bảo mật (chức năng minh hoạ)</div>
              </div>
              <div className="flex items-start gap-2 text-[13px] text-muted"><ShieldCheck size={16} className="mt-0.5 shrink-0" /> Tân Thời là trang tin minh hoạ, {au.name} là nhân vật hư cấu.</div>
            </div>
          )}
          {tab === 'bai-moi' && (
            <div className="-mt-5">
              {list.length ? list.map((a) => <StoryRow key={a.slug} a={a} />) : <p className="py-8 font-sans text-muted">Chưa có bài viết.</p>}
            </div>
          )}
        </div>

        <aside className="lg:border-l lg:border-rule lg:pl-8">
          <div className="kicker mb-3 border-t border-ink pt-2">Mới nhất từ {au.name}</div>
          <ul className="space-y-4">
            {list.slice(0, 5).map((a) => (
              <li key={a.slug} className="border-b border-rule pb-4 last:border-0">
                <Link to={`/bai/${a.slug}`} className="hl block text-[16px] leading-snug hover:text-ink-2">{a.title}</Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}
