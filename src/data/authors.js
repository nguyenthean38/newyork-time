/* Phóng viên và cây bút của Tân Thời — tất cả là nhân vật hư cấu. */
export const AUTHORS = [
  {
    slug: 'ha-linh', name: 'Hà Linh', role: 'Phóng viên đô thị', base: 'Hà Nội', tone: '#e8c9a8',
    bio: 'Hà Linh viết về đô thị, giao thông công cộng và những thay đổi nhỏ trong đời sống người Hà Nội. Chị gia nhập Tân Thời từ ngày đầu thành lập.',
    beats: ['Giao thông công cộng', 'Quy hoạch đô thị', 'Nhà ở'],
    background: 'Trước khi về Tân Thời, Hà Linh có tám năm làm phóng viên hiện trường cho các tờ báo địa phương, theo dõi các dự án đường sắt đô thị từ khi còn trên giấy. Chị tốt nghiệp ngành Quy hoạch đô thị và vẫn giữ thói quen đi bộ khảo sát một khu phố trước khi viết về nó.',
  },
  {
    slug: 'tran-minh-khang', name: 'Trần Minh Khang', role: 'Biên tập viên kinh tế', base: 'TP.HCM', tone: '#b9d3e8',
    bio: 'Minh Khang theo dõi doanh nghiệp, xuất nhập khẩu và thị trường hàng hoá. Anh thích những con số có câu chuyện đằng sau.',
    beats: ['Xuất khẩu', 'Doanh nghiệp nhỏ', 'Cảng biển và logistics'],
    background: 'Minh Khang từng làm chuyên viên phân tích tại một công ty chứng khoán trước khi chuyển sang báo chí. Anh phụ trách chuyên mục Kinh doanh và bản tin "Sổ Tay Thị Trường" gửi qua email mỗi sáng thứ Hai.',
  },
  {
    slug: 'le-bao-ngoc', name: 'Lê Bảo Ngọc', role: 'Phóng viên công nghệ', base: 'TP.HCM', tone: '#c9e3c4',
    bio: 'Bảo Ngọc viết về trí tuệ nhân tạo, bán dẫn và giới khởi nghiệp. Chị từng là kỹ sư phần mềm trước khi cầm bút.',
    beats: ['Trí tuệ nhân tạo', 'Bán dẫn', 'Khởi nghiệp'],
    background: 'Bảo Ngọc có năm năm làm kỹ sư phần mềm và vẫn tự viết công cụ nhỏ để kiểm chứng tuyên bố của các công ty công nghệ. Chị tin rằng mọi bài viết về AI nên đọc được bởi chính bố mẹ mình.',
  },
  {
    slug: 'pham-quoc-viet', name: 'Phạm Quốc Việt', role: 'Phóng viên thể thao', base: 'Đà Nẵng', tone: '#f0d48a',
    bio: 'Quốc Việt đã đưa tin từ hơn 200 sân bóng lớn nhỏ. Anh chạy bộ mỗi sáng và viết về cộng đồng chạy bộ.',
    beats: ['Bóng đá', 'Cầu lông', 'Chạy bộ'],
    background: 'Quốc Việt bắt đầu sự nghiệp ở một đài phát thanh địa phương, bình luận các trận bóng phong trào. Anh hoàn thành bảy cuộc chạy marathon và giữ kỷ lục cá nhân 3 giờ 21 phút.',
  },
  {
    slug: 'nguyen-thu-trang', name: 'Nguyễn Thu Trang', role: 'Phê bình văn hoá', base: 'Hà Nội', tone: '#e3c4dc',
    bio: 'Thu Trang viết phê bình sách, sân khấu và mỹ thuật. Chị đọc khoảng 120 cuốn sách mỗi năm.',
    beats: ['Sách', 'Sân khấu', 'Mỹ thuật'],
    background: 'Thu Trang có bằng thạc sĩ Văn học so sánh. Chị phụ trách bản tin "Giá Sách" và chương trình podcast "Đọc Chậm" của Tân Thời.',
  },
  {
    slug: 'do-hai-yen', name: 'Đỗ Hải Yến', role: 'Biên tập viên ẩm thực', base: 'TP.HCM', tone: '#f2b9a4',
    bio: 'Hải Yến thử mỗi công thức ít nhất ba lần trước khi đăng. Bếp thử nghiệm của Tân Thời là nơi chị dành nhiều thời gian nhất.',
    beats: ['Công thức', 'Quán ngon', 'Văn hoá ẩm thực'],
    background: 'Hải Yến từng đứng bếp ở một nhà hàng tại Hội An và học nghề làm bánh ở Đà Lạt. Chị viết bản tin "Bếp Tối Nay" gợi ý thực đơn năm ngày trong tuần.',
  },
  {
    slug: 'vo-thanh-nam', name: 'Võ Thành Nam', role: 'Phóng viên khoa học và môi trường', base: 'Cần Thơ', tone: '#a9d9d0',
    bio: 'Thành Nam viết về biến đổi khí hậu ở Đồng bằng sông Cửu Long, năng lượng tái tạo và thiên văn nghiệp dư.',
    beats: ['Biến đổi khí hậu', 'Năng lượng', 'Vũ trụ'],
    background: 'Thành Nam lớn lên bên sông Hậu và học ngành Thuỷ văn. Anh dành cuối tuần chụp ảnh bầu trời đêm ở những nơi ít ánh đèn nhất miền Tây.',
  },
  {
    slug: 'mai-anh-thu', name: 'Mai Anh Thư', role: 'Phóng viên quốc tế', base: 'Singapore', tone: '#c4c9e8',
    bio: 'Anh Thư đưa tin về khu vực Đông Nam Á và các hội nghị quốc tế về khí hậu, thương mại.',
    beats: ['Đông Nam Á', 'Khí hậu toàn cầu', 'Thương mại'],
    background: 'Anh Thư nói được tiếng Anh, tiếng Pháp và tiếng Indonesia. Chị từng đưa tin từ 14 quốc gia.',
  },
  {
    slug: 'bui-gia-huy', name: 'Bùi Gia Huy', role: 'Nhiếp ảnh và video', base: 'Hà Nội', tone: '#d8d8d8',
    bio: 'Gia Huy phụ trách hình ảnh và phim tài liệu ngắn của Tân Thời.',
    beats: ['Phóng sự ảnh', 'Phim tài liệu ngắn'],
    background: 'Gia Huy học quay phim và đã thực hiện hơn 60 phim tài liệu ngắn về nghề truyền thống và đời sống đô thị.',
  },
  {
    slug: 'dang-nhat-minh', name: 'Đặng Nhật Minh', role: 'Cây bút bình luận', base: 'Hà Nội', tone: '#e8e0b9', columnist: true,
    bio: 'Nhật Minh viết chuyên mục bình luận hai lần mỗi tuần về đô thị, giáo dục và đời sống công cộng.',
    beats: ['Đô thị', 'Giáo dục', 'Đời sống công cộng'],
    background: 'Nhật Minh là nhà nghiên cứu xã hội học và giảng viên đại học. Quan điểm trong bài bình luận là của tác giả.',
  },
  {
    slug: 'ly-hoai-an', name: 'Lý Hoài An', role: 'Cây bút khách mời', base: 'Đà Lạt', tone: '#cfe3b9', columnist: true,
    bio: 'Hoài An là nhà điểu học nghiệp dư và nhà văn viết cho thiếu nhi.',
    beats: ['Thiên nhiên', 'Trẻ em', 'Giáo dục'],
    background: 'Hoài An đã xuất bản sáu cuốn sách thiếu nhi về các loài chim Việt Nam.',
  },
  {
    slug: 'trinh-quang-duy', name: 'Trịnh Quang Duy', role: 'Cây bút bình luận công nghệ', base: 'TP.HCM', tone: '#b9e3e0', columnist: true,
    bio: 'Quang Duy viết về công nghệ và thị trường lao động.',
    beats: ['Công nghệ', 'Việc làm'],
    background: 'Quang Duy là nhà sáng lập một công ty phần mềm và cố vấn cho nhiều nhóm khởi nghiệp.',
  },
]

export const AUTHOR_BY_SLUG = Object.fromEntries(AUTHORS.map((a) => [a.slug, a]))
