/* Danh sách đọc: bài viết đã lưu của tài khoản */
import { Link } from 'react-router-dom'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useUser, useCurrentUser, toast } from '@/store'
import { getArticle } from '@/data'
import { SECTION_BY_SLUG } from '@/data/sections'
import { Img, useTitle } from '@/components/ui'
import { articleUrl, bylineText } from '@/components/story/Story'
import { timeAgo } from '@/lib/format'

export default function ReadingListPage() {
  useTitle('Danh sách đọc')
  const user = useCurrentUser()
  const toggleSaved = useUser((s) => s.toggleSaved)
  const saved = (user?.saved || []).map(getArticle).filter(Boolean)

  return (
    <div className="wrap max-w-[900px] py-10">
      <h1 className="font-serif text-[34px] font-bold">Danh sách đọc</h1>
      <p className="mt-1 font-sans text-[14px] text-muted">
        Bài bạn lưu sẽ xuất hiện ở đây, trên mọi thiết bị bạn đăng nhập. <span className="text-faint">(Bản demo: lưu trên trình duyệt này.)</span>
      </p>
      <div className="mt-6 border-t border-ink" />

      {!user ? (
        <div className="py-16 text-center">
          <Bookmark size={36} className="mx-auto text-faint" />
          <h2 className="mt-4 font-serif text-[22px] font-bold">Đăng nhập để xem bài đã lưu</h2>
          <p className="mx-auto mt-2 max-w-sm font-sans text-[14px] text-muted">Tạo tài khoản miễn phí để lưu bài viết và đọc lại bất cứ lúc nào.</p>
          <Link to="/dang-nhap?next=/danh-sach-doc" className="btn btn-ink mt-6">Đăng nhập hoặc tạo tài khoản</Link>
        </div>
      ) : saved.length === 0 ? (
        <div className="py-16 text-center">
          <h2 className="font-serif text-[22px] font-bold">Bạn chưa lưu bài nào.</h2>
          <p className="mt-2 font-sans text-[14px] text-muted">
            Bấm biểu tượng <Bookmark size={14} className="inline -translate-y-px" /> ở đầu mỗi bài viết để thêm vào danh sách đọc.
          </p>
          <Link to="/" className="btn btn-line mt-6">Về trang nhất</Link>
        </div>
      ) : (
        <ul>
          {saved.map((a) => (
            <li key={a.slug} className="grid grid-cols-[auto_1fr_auto] items-start gap-4 border-b border-rule py-5">
              <button
                onClick={() => { toggleSaved(a.slug); toast('Đã bỏ khỏi danh sách đọc.') }}
                aria-label="Bỏ lưu"
                title="Bỏ lưu"
                className="mt-1 rounded p-1 text-ink hover:bg-paper-2"
              >
                <BookmarkCheck size={20} />
              </button>
              <Link to={articleUrl(a)} className="group min-w-0">
                <div className="kicker mb-1 text-muted">{SECTION_BY_SLUG[a.section]?.name} · {timeAgo(a.date)}</div>
                <h3 className="hl story-link text-[19px] leading-snug">{a.title}</h3>
                <p className="dek mt-1 line-clamp-2 text-[15px]">{a.dek}</p>
                <div className="mt-1.5 font-sans text-[11px] uppercase tracking-[0.06em] text-muted">{bylineText(a)} · {a.read} phút đọc</div>
              </Link>
              <Link to={articleUrl(a)} className="w-[80px] sm:w-[130px]"><Img k={a.image} ratio="1/1" alt={a.caption} /></Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
