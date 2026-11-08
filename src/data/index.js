/* ==========================================================
   Kho bài viết: gộp mọi file trong data/articles và cung cấp hàm tra cứu.
   Muốn thêm bài: tạo object mới trong một file ở data/articles
   (hoặc file mới rồi import ở đây).
   ========================================================== */
import thoiSu from './articles/thoiSu'
import kinhTe from './articles/kinhTe'
import vanHoa from './articles/vanHoa'
import them from './articles/them'
import { IMAGES } from './images'
import { AUTHOR_BY_SLUG } from './authors'
import { SECTION_BY_SLUG } from './sections'
import { hoursAgoDate, unaccent } from '@/lib/format'

export const ARTICLES = [...thoiSu, ...kinhTe, ...vanHoa, ...them]
  .map((a) => ({ ...a, date: hoursAgoDate(a.hoursAgo) }))
  .sort((a, b) => a.hoursAgo - b.hoursAgo)

const BY_SLUG = Object.fromEntries(ARTICLES.map((a) => [a.slug, a]))

export const getArticle = (slug) => BY_SLUG[slug]
export const getImage = (key) => IMAGES[key]
export const authorsOf = (a) => (a?.authors || []).map((s) => AUTHOR_BY_SLUG[s]).filter(Boolean)
export const sectionOf = (a) => SECTION_BY_SLUG[a?.section]
export const bySection = (slug) => ARTICLES.filter((a) => a.section === slug)
export const byAuthor = (slug) => ARTICLES.filter((a) => a.authors.includes(slug))
export const byStoryline = (key) => ARTICLES.filter((a) => a.storyline === key)

/** Lấy danh sách bài theo slug, bỏ qua slug không tồn tại. */
export const pick = (...slugs) => slugs.map(getArticle).filter(Boolean)

/** Bài liên quan: cùng chuyên mục trước, sau đó bài mới nhất. */
export function related(a, n = 6) {
  const same = ARTICLES.filter((x) => x.slug !== a.slug && x.section === a.section)
  const rest = ARTICLES.filter((x) => x.slug !== a.slug && x.section !== a.section)
  return [...same, ...rest].slice(0, n)
}

/** Đọc nhiều: thứ tự cố định theo số bình luận (giả lập mức độ quan tâm). */
export const TRENDING = [...ARTICLES].sort((a, b) => b.comments - a.comments).slice(0, 10)

/** Dòng chuyện: nhóm bài cùng chủ đề, hiện thành thanh điều hướng phụ trong bài viết. */
export const STORYLINES = {
  metro: {
    name: 'Đường sắt đô thị',
    links: [
      { label: 'Một ngày trên tuyến metro', slug: 'mot-ngay-tren-tuyen-metro' },
      { label: 'Giá thuê quanh nhà ga', slug: 'gia-thue-nha-quanh-ga-metro' },
      { label: 'Xe buýt trung chuyển', slug: 'xe-buyt-dien-thay-doi-thoi-quen' },
      { label: 'Bình luận: Thành phố để dừng lại', slug: 'thanh-pho-khong-chi-de-di-qua' },
    ],
  },
  'mua-lu': {
    name: 'Mưa lũ miền Trung',
    links: [
      { label: 'Cập nhật trực tiếp', slug: 'mua-lon-mien-trung-cap-nhat' },
      { label: 'Hội nghị khí hậu', slug: 'hoi-nghi-khi-hau-quy-thich-ung' },
      { label: 'Thành phố bọt biển', slug: 'thanh-pho-bot-bien-chau-a' },
    ],
  },
}

/** Tìm kiếm đơn giản không dấu trên tiêu đề, sapo, thân bài. */
export function searchArticles(q) {
  const t = unaccent(q.trim().toLowerCase())
  if (!t) return []
  const words = t.split(/\s+/)
  return ARTICLES.map((a) => {
    const hay = unaccent([a.title, a.dek, a.kicker, a.sub, ...a.body.filter((b) => typeof b === 'string')].join(' ').toLowerCase())
    const title = unaccent(a.title.toLowerCase())
    let score = 0
    for (const w of words) {
      if (title.includes(w)) score += 3
      if (hay.includes(w)) score += 1
      else return null
    }
    return { a, score }
  }).filter(Boolean).sort((x, y) => y.score - x.score).map((x) => x.a)
}

/** Ước lượng thời lượng nghe (giây) theo số chữ. */
export function listenSeconds(a) {
  const words = a.body.map((b) => (typeof b === 'string' ? b : b.quote || '')).join(' ').split(/\s+/).length + a.title.split(/\s+/).length
  return Math.max(60, Math.round(words / 2.6))
}
