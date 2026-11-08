/* ==========================================================
   Podcast, tập phát và video của Tân Thời — tất cả hư cấu.
   Video được dựng thành "truyện dọc" từ ảnh có sẵn (không có tệp video thật).
   ========================================================== */

export const SHOWS = [
  { id: 'sang-nay', name: 'Sáng Nay', host: 'Hà Linh', image: 'ho-guom', color: '#c8331f', freq: 'Thứ Hai – Thứ Sáu, 15 phút', desc: 'Bản tin buổi sáng: một câu chuyện lớn, kể kỹ, trong mười lăm phút.' },
  { id: 'doc-cham', name: 'Đọc Chậm', host: 'Nguyễn Thu Trang', image: 'thu-vien', color: '#6d597a', freq: 'Thứ Năm hằng tuần', desc: 'Trò chuyện với nhà văn, dịch giả và những người đọc say mê.' },
  { id: 'pho-thi', name: 'Phố Thị', host: 'Hà Linh & Đặng Nhật Minh', image: 'via-he', color: '#2a9d8f', freq: 'Thứ Ba hằng tuần', desc: 'Đô thị, giao thông và những con người làm nên thành phố.' },
  { id: 'bep-toi-nay', name: 'Bếp Tối Nay', host: 'Đỗ Hải Yến', image: 'banh-xeo', color: '#e76f51', freq: 'Thứ Sáu hằng tuần', desc: 'Nấu ăn, chuyện bếp và những bữa cơm gia đình.' },
  { id: 'may-va-nguoi', name: 'Máy & Người', host: 'Lê Bảo Ngọc', image: 'chip', color: '#3a0ca3', freq: 'Hai tuần một lần', desc: 'Công nghệ và trí tuệ nhân tạo, giải thích cho người không làm kỹ thuật.' },
]

export const SHOW_BY_ID = Object.fromEntries(SHOWS.map((s) => [s.id, s]))

const T = (who, text) => ({ who, text })

export const EPISODES = [
  {
    id: 'metro-va-thoi-quen', show: 'sang-nay', hoursAgo: 3, duration: 902,
    title: 'Tàu điện có làm người ta bỏ xe máy?',
    desc: 'Một năm sau ngày tuyến metro đầu tiên vận hành, chúng tôi hỏi hành khách, nhà quy hoạch và cả những người vẫn chưa bao giờ đi tàu.',
    related: 'mot-ngay-tren-tuyen-metro',
    transcript: [
      T('Hà Linh', 'Xin chào, tôi là Hà Linh và đây là Sáng Nay. Hôm nay chúng ta nói về một câu hỏi tưởng đơn giản: tàu điện có làm người ta bỏ xe máy không?'),
      T('Hà Linh', 'Năm giờ kém mười lăm sáng, tôi đứng ở cửa ga cùng bà Hoà, một hành khách 67 tuổi. Bà đi chợ đầu mối mỗi ngày.'),
      T('Bà Hoà', 'Lúc đầu tôi sợ cái thang cuốn lắm. Giờ thì tôi biết đứng bên phải, để người vội đi bên trái.'),
      T('Hà Linh', 'Chi tiết nhỏ ấy là thứ các nhà quy hoạch gọi là văn hoá ga tàu. Tôi hỏi tiến sĩ Lương Hữu Phước về điều này.'),
      T('TS. Lương Hữu Phước', 'Chúng ta đã xây xong phần khó nhất về kỹ thuật. Phần khó nhất về con người thì mới bắt đầu.'),
      T('Hà Linh', 'Theo số liệu của ban quản lý, sáu mươi hai phần trăm hành khách vẫn đi xe máy đến ga. Đó là bài toán chặng cuối.'),
      T('TS. Lương Hữu Phước', 'Hãy nhìn mỗi nhà ga như một vòng tròn bán kính tám trăm mét. Vỉa hè, cây xanh, đèn đường quan trọng không kém đường ray.'),
      T('Hà Linh', 'Vậy câu trả lời là gì? Có lẽ là: tàu điện không tự làm người ta bỏ xe máy. Thành phố quanh nhà ga mới làm được điều đó.'),
      T('Hà Linh', 'Sáng Nay do Tân Thời thực hiện. Cảm ơn bạn đã lắng nghe. Hẹn gặp lại vào sáng mai.'),
    ],
  },
  {
    id: 'mua-nuoc-noi', show: 'doc-cham', hoursAgo: 30, duration: 1840,
    title: 'Lâm Khánh Vy và bảy năm viết "Mùa nước nổi"',
    desc: 'Tác giả tiểu thuyết đầu tay được nhắc đến nhiều nhất năm nói về phương ngữ, về bà ngoại và về việc viết khi đang đi dạy.',
    related: 'review-mua-nuoc-noi',
    transcript: [
      T('Thu Trang', 'Chào mừng bạn đến với Đọc Chậm. Khách mời hôm nay là nhà văn Lâm Khánh Vy.'),
      T('Khánh Vy', 'Cảm ơn chị. Tôi hơi run, vì thường tôi là người hỏi học trò chứ không phải bị hỏi.'),
      T('Thu Trang', 'Bảy năm cho một cuốn tiểu thuyết. Điều gì giữ chị viết tiếp?'),
      T('Khánh Vy', 'Giọng của bà ngoại tôi. Bà mất rồi, và tôi sợ mình quên cách bà nói.'),
      T('Thu Trang', 'Chị không chú thích phương ngữ. Đó là một lựa chọn có chủ ý?'),
      T('Khánh Vy', 'Dạ. Tôi muốn người đọc nghe giọng trước khi hiểu nghĩa. Như người ta nghe nhạc vậy.'),
      T('Thu Trang', 'Đoạn kết bị một số nhà phê bình, trong đó có tôi, cho là hơi vội.'),
      T('Khánh Vy', 'Tôi đồng ý. Nhưng nước rút cũng nhanh lắm chị ạ. Tôi muốn đoạn cuối giống như vậy.'),
      T('Thu Trang', 'Cảm ơn chị. Đọc Chậm xin hẹn gặp lại bạn vào thứ Năm tuần sau.'),
    ],
  },
  {
    id: 'via-he-cua-ai', show: 'pho-thi', hoursAgo: 52, duration: 1520,
    title: 'Vỉa hè là của ai?',
    desc: 'Người đi bộ, người bán hàng, xe máy dựng tạm — một mét vuông vỉa hè gánh rất nhiều nhu cầu.',
    related: 'thanh-pho-khong-chi-de-di-qua',
    transcript: [
      T('Hà Linh', 'Đây là Phố Thị. Hôm nay tôi ngồi cùng cây bút bình luận Đặng Nhật Minh để nói về vỉa hè.'),
      T('Nhật Minh', 'Vỉa hè là không gian công cộng gần gũi nhất. Bạn bước ra khỏi nhà là gặp nó.'),
      T('Hà Linh', 'Nhưng nó cũng là sinh kế của rất nhiều người bán hàng.'),
      T('Nhật Minh', 'Đúng vậy. Vì thế câu hỏi không phải là dẹp hay không dẹp, mà là chia sẻ thế nào cho công bằng.'),
      T('Hà Linh', 'Anh có đề xuất gì cụ thể?'),
      T('Nhật Minh', 'Kẻ vạch rõ ràng: một làn tối thiểu một mét hai cho người đi bộ, phần còn lại có thể cho thuê theo giờ.'),
      T('Hà Linh', 'Phố Thị xin dừng lại ở đây. Hẹn gặp bạn tuần sau.'),
    ],
  },
  {
    id: 'pho-ba-tieng', show: 'bep-toi-nay', hoursAgo: 70, duration: 1210,
    title: 'Nấu phở trong ba tiếng có phải là "ăn gian"?',
    desc: 'Mười hai lần thử, hai bước then chốt và một cuộc tranh luận nảy lửa trong bếp thử Tân Thời.',
    related: 'cong-thuc-pho-bo-tai-nha',
    transcript: [
      T('Hải Yến', 'Xin chào, tôi là Hải Yến, và tuần này bếp thử của chúng tôi gần như cãi nhau vì một nồi phở.'),
      T('Hải Yến', 'Câu hỏi là: phở có nhất thiết phải ninh từ đêm không?'),
      T('Bếp phó Minh', 'Tôi từng nghĩ là có. Nhưng sau lần thử thứ tám thì tôi bắt đầu lung lay.'),
      T('Hải Yến', 'Bí quyết nằm ở hai bước: chần xương thật kỹ và nướng hành gừng đến cháy xém.'),
      T('Bếp phó Minh', 'Và vớt bọt. Vớt bọt liên tục, như người ta trông con nhỏ vậy.'),
      T('Hải Yến', 'Công thức đầy đủ có trên Tân Thời. Chúc bạn một bữa tối ngon miệng.'),
    ],
  },
  {
    id: 'ai-noi-giong-hue', show: 'may-va-nguoi', hoursAgo: 96, duration: 1680,
    title: 'Vì sao trợ lý ảo không hiểu giọng Huế?',
    desc: 'Dữ liệu, thiên kiến và một dự án thu âm mười nghìn giờ tiếng nói từ khắp các vùng miền.',
    related: 'tro-ly-ai-noi-giong-dia-phuong',
    transcript: [
      T('Bảo Ngọc', 'Chào bạn, đây là Máy & Người. Tôi muốn bắt đầu bằng một câu hỏi: "Mô răng rứa?"'),
      T('Bảo Ngọc', 'Nếu bạn hỏi câu đó với một trợ lý ảo, rất có thể nó sẽ trả lời sai.'),
      T('TS. Hồ Gia Bảo', 'Mô hình học từ dữ liệu. Nếu dữ liệu phần lớn là một giọng, máy sẽ giỏi giọng đó.'),
      T('Bảo Ngọc', 'Và điều đó dẫn đến hệ quả gì?'),
      T('TS. Hồ Gia Bảo', 'Người ta sẽ đổi giọng để máy hiểu. Đó là một kiểu mất mát văn hoá rất âm thầm.'),
      T('Bảo Ngọc', 'Dự án Trăm Giọng vẫn đang tìm tình nguyện viên. Cảm ơn bạn đã lắng nghe Máy & Người.'),
    ],
  },
  {
    id: 'mua-lu-mien-trung', show: 'sang-nay', hoursAgo: 26, duration: 845,
    title: 'Mưa lũ miền Trung: chúng ta đã chuẩn bị tốt hơn chưa?',
    desc: 'Phóng viên Võ Thành Nam kể từ hiện trường về những điểm sơ tán, những con số mực nước và những người không chịu rời nhà.',
    related: 'mua-lon-mien-trung-cap-nhat',
    transcript: [
      T('Hà Linh', 'Đây là Sáng Nay. Đồng nghiệp Võ Thành Nam của tôi đang ở miền Trung.'),
      T('Thành Nam', 'Mưa vẫn rất to. Mực nước sông đã vượt báo động hai từ chiều qua.'),
      T('Hà Linh', 'So với những năm trước, công tác chuẩn bị có khác gì không?'),
      T('Thành Nam', 'Cảnh báo đến sớm hơn, qua tin nhắn điện thoại. Các trường học đã được chuẩn bị làm điểm sơ tán.'),
      T('Thành Nam', 'Nhưng vẫn có những người già không muốn rời nhà. Họ sợ mất trâu bò, mất đồ đạc.'),
      T('Hà Linh', 'Cảm ơn anh. Giữ an toàn nhé. Bạn có thể theo dõi cập nhật trực tiếp trên Tân Thời.'),
    ],
  },
]

export const EPISODE_BY_ID = Object.fromEntries(EPISODES.map((e) => [e.id, e]))
export const episodesOf = (showId) => EPISODES.filter((e) => e.show === showId)

/** "15:02" */
export const fmtDuration = (s) => {
  s = Math.max(0, Math.round(s))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = String(s % 60).padStart(2, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`
}

/* ---------- Video dạng truyện dọc ---------- */
export const VIDEO_GROUPS = ['Hôm nay', 'Phóng sự', 'Ẩm thực', 'Văn hoá']

export const VIDEOS = [
  {
    id: 'co-dong-vien', group: 'Hôm nay', place: 'Đà Nẵng', title: 'Đêm chung kết: cả thành phố nín thở', duration: 74, hoursAgo: 12, by: 'Phạm Quốc Việt',
    slides: [
      { img: 'co-dong-vien', text: 'Ba mươi nghìn khán giả lấp kín khán đài từ hai tiếng trước giờ bóng lăn.' },
      { img: 'san-bong', text: 'Sau 120 phút, tỉ số vẫn là 1-1. Trận đấu bước vào loạt sút luân lưu.' },
      { img: 'co-dong-vien', text: 'Thủ môn 20 tuổi cản phá hai quả phạt đền.', name: 'Nguyễn Hữu Tài', role: 'Thủ môn (nhân vật hư cấu)' },
      { img: 'da-nang', text: 'Đêm ấy, hai bờ sông Hàn sáng đèn đến gần sáng.' },
    ],
  },
  {
    id: 'metro-sang-som', group: 'Hôm nay', place: 'TP.HCM', title: 'Chuyến tàu 5 giờ sáng', duration: 58, hoursAgo: 3, by: 'Bùi Gia Huy',
    slides: [
      { img: 'metro-hcm', text: 'Năm giờ sáng, đoàn tàu đầu tiên rời ga khi thành phố còn ngái ngủ.' },
      { img: 'ga-metro', text: 'Những hành khách đầu tiên: người đi chợ, công nhân ca sớm, sinh viên.' },
      { img: 'xe-may', text: 'Bên dưới đường ray, dòng xe máy bắt đầu đông dần.' },
      { img: 'saigon', text: 'Một thành phố đang học cách đi chậm lại để đến nhanh hơn.' },
    ],
  },
  {
    id: 'mua-lu', group: 'Hôm nay', place: 'Huế', title: 'Nước lên ở cố đô', duration: 66, hoursAgo: 1, by: 'Võ Thành Nam',
    slides: [
      { img: 'hue', text: 'Mưa lớn kéo dài khiến mực nước sông vượt báo động hai.' },
      { img: 'mekong', text: 'Người dân dùng thuyền để di chuyển trong các khu trũng.' },
      { img: 'phong-hoc', text: 'Hơn bốn mươi trường học được chuyển thành điểm sơ tán tạm thời.' },
    ],
  },
  {
    id: 'cho-noi', group: 'Phóng sự', place: 'Cần Thơ', title: 'Chợ nổi lúc bình minh', duration: 92, hoursAgo: 28, by: 'Bùi Gia Huy',
    slides: [
      { img: 'cho-noi', text: 'Bốn giờ sáng, ghe thuyền đã tụ về khúc sông quen.' },
      { img: 'mekong', text: 'Mỗi chiếc ghe treo một cây bẹo — món hàng bán gì, treo nấy.' },
      { img: 'cho-noi', text: 'Chợ nổi vẫn sống, dù thưa hơn trước.', name: 'Cô Út Hiền', role: 'Bán trái cây trên sông 30 năm' },
    ],
  },
  {
    id: 'phong-sach', group: 'Phóng sự', place: 'Bắc Ninh', title: 'Bên trong phòng sạch làm chip', duration: 105, hoursAgo: 4, by: 'Lê Bảo Ngọc',
    slides: [
      { img: 'chip', text: 'Trước khi vào phòng sạch, mọi người phải mặc đồ bảo hộ kín từ đầu đến chân.' },
      { img: 'wafer', text: 'Mỗi tấm wafer chứa hàng trăm con chip nhỏ hơn móng tay.' },
      { img: 'robot', text: 'Robot làm phần việc lặp lại; kỹ sư giám sát từng thông số.' },
    ],
  },
  {
    id: 'pho-sang', group: 'Ẩm thực', place: 'Hà Nội', title: 'Một nồi phở, ba tiếng', duration: 81, hoursAgo: 15, by: 'Đỗ Hải Yến',
    slides: [
      { img: 'pho', text: 'Bí quyết đầu tiên: chần xương thật kỹ để nước dùng trong.' },
      { img: 'bun', text: 'Bí quyết thứ hai: nướng hành gừng đến cháy xém.' },
      { img: 'pho', text: 'Còn lại là kiên nhẫn — và vớt bọt liên tục.' },
    ],
  },
  {
    id: 'banh-mi-pate', group: 'Ẩm thực', place: 'TP.HCM', title: 'Pa-tê tự làm mỗi ngày', duration: 63, hoursAgo: 14, by: 'Trần Minh Khang',
    slides: [
      { img: 'banh-mi', text: 'Từ chiếc xe đẩy năm 2009 đến 100 cửa hàng ở sáu quốc gia.' },
      { img: 'ben-thanh', text: 'Mọi thứ bắt đầu ở cổng chợ Bến Thành.' },
      { img: 'banh-mi', text: '"Pa-tê phải tự làm mỗi ngày," bà Ba vẫn dặn.' },
    ],
  },
  {
    id: 'mua-roi', group: 'Văn hoá', place: 'Hà Nội', title: 'Chú Tễu đi tàu điện', duration: 77, hoursAgo: 6, by: 'Nguyễn Thu Trang',
    slides: [
      { img: 'mua-roi', text: 'Mất 90 phút để dựng xong thuỷ đình lưu động trên thùng xe tải.' },
      { img: 'nhac-cu', text: 'Dàn nhạc dân tộc đi theo mỗi buổi diễn.' },
      { img: 'mua-roi', text: 'Tích trò mới: một chú Tễu lần đầu đi tàu điện.' },
    ],
  },
  {
    id: 'son-mai', group: 'Văn hoá', place: 'Hà Nội', title: 'Sơn mài nói chuyện hôm nay', duration: 69, hoursAgo: 28, by: 'Nguyễn Thu Trang',
    slides: [
      { img: 'bao-tang', text: 'Hàng người xếp từ cổng bảo tàng ra tận vỉa hè.' },
      { img: 'xe-may-dem', text: 'Bức "Ngã tư lúc 6 giờ chiều" — dòng xe vẽ bằng vỏ trứng và son then.' },
      { img: 'gom', text: 'Chất liệu truyền thống, câu chuyện của hôm nay.' },
    ],
  },
]
