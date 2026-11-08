/* Định dạng ngày giờ, số theo kiểu Việt Nam */
export const NOW = new Date()

const WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']

/** "Chủ Nhật, 8 tháng 11, 2026" */
export function longDate(d = NOW) {
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} tháng ${d.getMonth() + 1}, ${d.getFullYear()}`
}

/** "8 thg 11, 2026" */
export function shortDate(d) {
  return `${d.getDate()} thg ${d.getMonth() + 1}, ${d.getFullYear()}`
}

/** "08/11/2026" */
export function numDate(d) {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

export function clock(d) {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** Thời điểm đăng tính từ "số giờ trước" để nội dung luôn mới. */
export function hoursAgoDate(h) {
  return new Date(NOW.getTime() - h * 3600 * 1000)
}

/** "5 phút trước", "3 giờ trước", "Hôm qua", "4 ngày trước", "8 thg 11, 2026" */
export function timeAgo(dateOrHours) {
  const d = typeof dateOrHours === 'number' ? hoursAgoDate(dateOrHours) : new Date(dateOrHours)
  const s = (Date.now() - d.getTime()) / 1000
  if (s < 60) return 'Vừa xong'
  if (s < 3600) return `${Math.floor(s / 60)} phút trước`
  if (s < 86400) return `${Math.floor(s / 3600)} giờ trước`
  if (s < 172800) return 'Hôm qua'
  if (s < 7 * 86400) return `${Math.floor(s / 86400)} ngày trước`
  return shortDate(d)
}

export function vnNumber(n, digits = 0) {
  return n.toLocaleString('vi-VN', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

export function vnd(n) {
  return `${vnNumber(n)} ₫`
}

/** Bỏ dấu tiếng Việt, dùng cho tìm kiếm và trò chơi chữ. */
export function unaccent(s = '') {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
}

export function slugify(s = '') {
  return unaccent(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
