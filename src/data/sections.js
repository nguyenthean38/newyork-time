/* Chuyên mục của Tân Thời. `subs` là chuyên mục con hiển thị trong menu thả xuống. */
export const SECTIONS = [
  { slug: 'thoi-su', name: 'Thời sự', blurb: 'Tin tức trong nước, đô thị, giao thông, giáo dục và y tế.', subs: ['Hà Nội', 'TP.HCM', 'Giao thông', 'Giáo dục', 'Y tế'] },
  { slug: 'the-gioi', name: 'Thế giới', blurb: 'Diễn biến quốc tế qua góc nhìn của người Việt.', subs: ['Châu Á', 'Châu Âu', 'Châu Mỹ', 'Khí hậu'] },
  { slug: 'kinh-doanh', name: 'Kinh doanh', blurb: 'Thị trường, doanh nghiệp, bất động sản và tài chính cá nhân.', subs: ['Thị trường', 'Doanh nghiệp', 'Bất động sản', 'Tài chính cá nhân'] },
  { slug: 'cong-nghe', name: 'Công nghệ', blurb: 'Trí tuệ nhân tạo, bán dẫn, khởi nghiệp và thiết bị.', subs: ['AI', 'Bán dẫn', 'Khởi nghiệp', 'Thiết bị'] },
  { slug: 'khoa-hoc', name: 'Khoa học', blurb: 'Môi trường, năng lượng, vũ trụ và sức khoẻ.', subs: ['Môi trường', 'Năng lượng', 'Vũ trụ', 'Sức khoẻ'] },
  { slug: 'van-hoa', name: 'Văn hoá', blurb: 'Sách, sân khấu, mỹ thuật, âm nhạc và điện ảnh.', subs: ['Sách', 'Sân khấu', 'Mỹ thuật', 'Âm nhạc', 'Điện ảnh'] },
  { slug: 'doi-song', name: 'Đời sống', blurb: 'Du lịch, sống khoẻ, gia đình và những câu chuyện thường ngày.', subs: ['Du lịch', 'Sống khoẻ', 'Gia đình', 'Nghề truyền thống'] },
  { slug: 'am-thuc', name: 'Ẩm thực', blurb: 'Công thức nấu ăn đã thử nghiệm và những quán ngon đáng ghé.', subs: ['Công thức', 'Quán ngon', 'Đồ uống'] },
  { slug: 'the-thao', name: 'Thể thao', blurb: 'Bóng đá, cầu lông, điền kinh và cộng đồng chạy bộ.', subs: ['Bóng đá', 'Cầu lông', 'Chạy bộ'] },
  { slug: 'y-kien', name: 'Ý kiến', blurb: 'Bình luận, góc nhìn của cây bút khách mời và thư bạn đọc.', subs: ['Bình luận', 'Khách mời', 'Thư bạn đọc'] },
]

export const SECTION_BY_SLUG = Object.fromEntries(SECTIONS.map((s) => [s.slug, s]))

/** Thanh điều hướng chính (dưới măng-sét). */
export const MAIN_NAV = [
  ...SECTIONS.filter((s) => s.slug !== 'khoa-hoc' && s.slug !== 'am-thuc').map((s) => ({ label: s.name, to: `/chuyen-muc/${s.slug}`, slug: s.slug })),
  { label: 'Ẩm thực', to: '/chuyen-muc/am-thuc', slug: 'am-thuc' },
  { label: 'Nghe', to: '/nghe', slug: 'nghe' },
  { label: 'Video', to: '/video', slug: 'video' },
  { label: 'Trò chơi', to: '/tro-choi', slug: 'tro-choi' },
]

/** Phiên bản theo vùng, hiển thị ở dòng đầu trang nhất. */
export const EDITIONS = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Cần Thơ', 'English']
