/* ==========================================================
   Bình luận mẫu: sinh ổn định theo slug bài viết (cùng bài → cùng bình luận).
   Tên, địa danh, nội dung đều hư cấu.
   ========================================================== */
import { AUTHOR_BY_SLUG } from './authors'

const NAMES = ['Minh Anh', 'Quốc Huy', 'Thu Hà', 'Bảo Long', 'Ngọc Trâm', 'Đức Thịnh', 'Khánh Linh', 'Hoàng Nam', 'Phương Thảo', 'Gia Bảo', 'Thanh Tùng', 'Mai Phương', 'Tuấn Kiệt', 'Hải Đăng', 'Lan Chi', 'Việt Hoàng', 'Thuỳ Dung', 'Trọng Nhân', 'Ánh Dương', 'Công Vinh']
const PLACES = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Cần Thơ', 'Huế', 'Hải Phòng', 'Nha Trang', 'Buôn Ma Thuột', 'Vũng Tàu', 'Quy Nhơn', 'Thái Nguyên', 'Melbourne', 'Tokyo', 'Berlin']
const TONES = ['#f4c7c3', '#f7dca4', '#cfe8c4', '#bfe0e8', '#c9cdf2', '#e6c6ec', '#f2d0b8']

const GENERIC = [
  'Bài viết rất công tâm. Tôi mong toà soạn tiếp tục theo dõi chủ đề này thêm vài tháng nữa để xem thay đổi thật sự đến đâu.',
  'Đọc xong tôi nhớ lại chuyện của chính gia đình mình. Cảm ơn phóng viên đã kể bằng giọng văn nhẹ nhàng mà không thiếu số liệu.',
  'Tôi không hoàn toàn đồng ý. Bài viết bỏ qua góc nhìn của người làm chính sách — họ cũng có những ràng buộc riêng.',
  'Chi tiết nhỏ ở đoạn cuối làm tôi xúc động. Báo chí cần nhiều bài như thế này hơn.',
  'Có ai biết số liệu trong bài lấy từ nguồn nào không? Tôi muốn đọc thêm.',
  'Đây là lý do tôi trả tiền đọc báo. Không giật tít, không cảm tính, chỉ là một câu chuyện được kể tử tế.',
  'Tôi sống ở đúng khu vực được nhắc tới trong bài, và mọi thứ được mô tả rất chính xác.',
  'Hay nhưng hơi dài. Giá có một phần tóm tắt ở đầu bài cho người bận rộn như tôi.',
  'Cảm ơn bài viết. Tôi đã gửi cho bố mẹ đọc — họ là những người cần thông tin này nhất.',
  'Mười năm nữa nhìn lại, chúng ta sẽ thấy thời điểm này là một bước ngoặt. Hi vọng là theo hướng tốt.',
  'Một góc nhìn khác: thay đổi nào cũng có người được người mất. Bài viết đã nói được cả hai phía.',
  'Tôi thích cách bài viết để nhân vật tự nói. Không cần bình luận nhiều mà vẫn rõ ý.',
]

const REPLIES = [
  'Đồng ý với bạn. Tôi cũng từng gặp đúng tình huống này.',
  'Nguồn số liệu có ghi ở cuối đoạn thứ hai đấy bạn ạ.',
  'Góc nhìn thú vị, cảm ơn bạn đã chia sẻ.',
  'Tôi nghĩ bạn hơi bi quan, nhưng cũng có lý.',
]

/** Bộ sinh số ngẫu nhiên có hạt giống — kết quả giống nhau mỗi lần tải. */
export function seeded(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * @returns {Array<{id, name, place, tone, text, hoursAgo, likes, pick:boolean, staff:boolean, role?, replies:Array}>}
 */
export function commentsFor(article, count = 14) {
  const r = seeded(article.slug)
  const pickOne = (arr) => arr[Math.floor(r() * arr.length)]
  const list = []
  for (let i = 0; i < count; i++) {
    const name = pickOne(NAMES)
    const replies = r() < 0.35
      ? Array.from({ length: 1 + Math.floor(r() * 2) }, (_, j) => ({
          id: `${article.slug}-c${i}-r${j}`,
          name: pickOne(NAMES), place: pickOne(PLACES), tone: pickOne(TONES),
          text: pickOne(REPLIES), hoursAgo: Math.max(0.2, article.hoursAgo * r()), likes: Math.floor(r() * 30),
        }))
      : []
    list.push({
      id: `${article.slug}-c${i}`,
      name, place: pickOne(PLACES), tone: pickOne(TONES),
      text: pickOne(GENERIC),
      hoursAgo: Math.max(0.1, article.hoursAgo * (0.1 + r() * 0.9)),
      likes: Math.floor(r() * r() * 900),
      pick: i < 4,
      staff: false,
      replies,
    })
  }
  // Phóng viên trả lời bạn đọc
  const author = AUTHOR_BY_SLUG[article.authors?.[0]]
  if (author) {
    list.splice(2, 0, {
      id: `${article.slug}-staff`,
      name: author.name, place: author.base, tone: author.tone, staff: true, role: author.role,
      text: 'Cảm ơn các bạn đã đọc và góp ý. Chúng tôi sẽ tiếp tục cập nhật chủ đề này trong các bài tiếp theo — nếu bạn có câu chuyện liên quan, hãy để lại bình luận bên dưới.',
      hoursAgo: Math.max(0.1, article.hoursAgo * 0.5), likes: 120 + Math.floor(r() * 200), pick: false, replies: [],
    })
  }
  return list
}
