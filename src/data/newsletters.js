/* Bản tin email của Tân Thời. `art` là cặp màu để vẽ ô biểu tượng (không dùng ảnh). */
export const NEWSLETTER_TOPICS = ['Nổi bật', 'Tin tức & phân tích', 'Ẩm thực', 'Văn hoá & đời sống', 'Trò chơi', 'Ý kiến', 'Chỉ dành cho người đăng ký']

export const NEWSLETTERS = [
  { id: 'sang-nay', name: 'Sáng Nay', topic: 'Tin tức & phân tích', freq: 'Hằng ngày', featured: true, art: ['#121212', '#f2c94c'], glyph: '☀', desc: 'Những tin cần biết để bắt đầu ngày mới, gửi lúc 6 giờ sáng. Do Hà Linh biên tập.' },
  { id: 'toi-nay', name: 'Tối Nay', topic: 'Tin tức & phân tích', freq: 'Hằng ngày', featured: true, art: ['#1d3557', '#a8dadc'], glyph: '☾', desc: 'Tóm tắt một ngày và những gì sẽ xảy ra ngày mai, gửi lúc 19 giờ.' },
  { id: 'tin-nong', name: 'Tin Nóng', topic: 'Tin tức & phân tích', freq: 'Khi có tin lớn', art: ['#c8331f', '#ffffff'], glyph: '!', desc: 'Thông báo ngay khi có tin quan trọng. Không quá ba lần mỗi tuần.' },
  { id: 'so-tay-thi-truong', name: 'Sổ Tay Thị Trường', topic: 'Tin tức & phân tích', freq: 'Thứ Hai hằng tuần', art: ['#0f5132', '#d1e7dd'], glyph: '↗', desc: 'Một tuần kinh tế qua năm con số, do Trần Minh Khang viết.' },
  { id: 'may-va-nguoi', name: 'Máy & Người', topic: 'Tin tức & phân tích', freq: 'Thứ Năm hằng tuần', art: ['#3a0ca3', '#cdb4db'], glyph: '◎', desc: 'Công nghệ, AI và cách chúng thay đổi công việc của bạn.' },
  { id: 'bep-toi-nay', name: 'Bếp Tối Nay', topic: 'Ẩm thực', freq: 'Thứ Hai – Thứ Sáu', featured: true, art: ['#e76f51', '#fde2d0'], glyph: '◐', desc: 'Một món ngon cho bữa tối, đã được bếp thử nấu ba lần.', subscriberOnly: true },
  { id: 'an-gi-cuoi-tuan', name: 'Ăn Gì Cuối Tuần', topic: 'Ẩm thực', freq: 'Thứ Sáu hằng tuần', art: ['#f4a261', '#264653'], glyph: '✦', desc: 'Những quán ngon đáng đi xa, do Đỗ Hải Yến chọn.' },
  { id: 'gia-sach', name: 'Giá Sách', topic: 'Văn hoá & đời sống', freq: 'Chủ Nhật hằng tuần', art: ['#6d597a', '#ffcdb2'], glyph: '❚', desc: 'Sách mới, sách hay và một đoạn trích đáng đọc mỗi tuần.' },
  { id: 'cuoi-tuan-di-dau', name: 'Cuối Tuần Đi Đâu', topic: 'Văn hoá & đời sống', freq: 'Thứ Năm hằng tuần', art: ['#2a9d8f', '#e9f5db'], glyph: '➶', desc: 'Triển lãm, buổi diễn, chuyến đi ngắn cho hai ngày nghỉ.' },
  { id: 'song-cham', name: 'Sống Chậm', topic: 'Văn hoá & đời sống', freq: 'Hai lần mỗi tuần', art: ['#588157', '#dad7cd'], glyph: '❀', desc: 'Sức khoẻ, giấc ngủ và những thói quen nhỏ cho cuộc sống dễ thở hơn.' },
  { id: 'tro-choi-moi', name: 'Ô Chữ Hôm Nay', topic: 'Trò chơi', freq: 'Hằng ngày', featured: true, art: ['#f2c94c', '#121212'], glyph: '▦', desc: 'Lời nhắc chơi Chữ Ẩn, Bộ Tứ và mẹo từ ban biên tập trò chơi.' },
  { id: 'goc-nhin', name: 'Góc Nhìn', topic: 'Ý kiến', freq: 'Thứ Ba & Thứ Sáu', art: ['#9d0208', '#ffe5d9'], glyph: '❝', desc: 'Những bài bình luận được bàn luận nhiều nhất trong tuần.' },
  { id: 'thu-ban-doc', name: 'Thư Bạn Đọc', topic: 'Ý kiến', freq: 'Chủ Nhật hằng tuần', art: ['#495057', '#e9ecef'], glyph: '✉', desc: 'Những lá thư hay nhất bạn đọc gửi về toà soạn.', subscriberOnly: true },
]

export const NEWSLETTER_BY_ID = Object.fromEntries(NEWSLETTERS.map((n) => [n.id, n]))

/** Chủ đề quan tâm ở bước 1 của luồng chào mừng. */
export const INTERESTS = [
  { id: 'tin-tuc', name: 'Tin tức', desc: 'Thời sự, thế giới, kinh doanh và phân tích chuyên sâu.', locked: true },
  { id: 'tro-choi', name: 'Trò chơi', desc: 'Chữ Ẩn, Bộ Tứ, Sudoku và câu đố mỗi ngày.' },
  { id: 'am-thuc', name: 'Ẩm thực', desc: 'Công thức đã thử nghiệm, gợi ý bữa tối.' },
  { id: 'nghe', name: 'Nghe', desc: 'Podcast, bài báo có giọng đọc và chuyện kể.' },
  { id: 'van-hoa', name: 'Văn hoá', desc: 'Sách, sân khấu, mỹ thuật và âm nhạc.' },
  { id: 'the-thao', name: 'Thể thao', desc: 'Bóng đá, cầu lông và cộng đồng chạy bộ.' },
]
