/* ==========================================================
   Từ cho trò Chữ Ẩn.
   ANSWERS: đáp án 5 chữ cái không dấu, kèm dạng có dấu và nghĩa ngắn.
   isValidGuess: chấp nhận đáp án + mọi tổ hợp âm tiết tiếng Việt hợp lệ
   (tối đa hai âm tiết) — loại các chuỗi vô nghĩa như "AEIOU".
   ========================================================== */

// [không dấu, có dấu, nghĩa]
const RAW = [
  ['NGUOI', 'NGƯỜI', 'con người'], ['THANH', 'THÀNH', 'thành phố, thành công'], ['TRANG', 'TRĂNG', 'mặt trăng'],
  ['DUONG', 'ĐƯỜNG', 'con đường'], ['QUANG', 'QUANG', 'quang đãng, sáng sủa'], ['KHANH', 'KHÁNH', 'mừng (khánh thành)'],
  ['NGHIA', 'NGHĨA', 'ý nghĩa'], ['TRUNG', 'TRUNG', 'ở giữa, trung thành'], ['XUONG', 'XƯƠNG', 'bộ xương'],
  ['NHUNG', 'NHUNG', 'vải nhung mềm'], ['CHUNG', 'CHUNG', 'cùng nhau, của mọi người'], ['KHONG', 'KHÔNG', 'số không'],
  ['NGANG', 'NGANG', 'chiều ngang'], ['THUAN', 'THUẬN', 'thuận lợi'], ['TRONG', 'TRỐNG', 'cái trống'],
  ['SUONG', 'SƯƠNG', 'sương mù'], ['HUONG', 'HƯƠNG', 'mùi hương'], ['LUONG', 'LƯƠNG', 'tiền lương'],
  ['TRUOC', 'TRƯỚC', 'phía trước'], ['THUOC', 'THUỐC', 'thuốc men'], ['CHUOI', 'CHUỐI', 'quả chuối'],
  ['MUONG', 'MƯƠNG', 'con mương dẫn nước'], ['NGUON', 'NGUỒN', 'nguồn nước, nguồn gốc'], ['CHIEU', 'CHIỀU', 'buổi chiều'],
  ['NHIEU', 'NHIỀU', 'số lượng lớn'], ['THIEU', 'THIẾU', 'không đủ'], ['KHIEU', 'KHIẾU', 'năng khiếu'],
  ['TRIEU', 'TRIỆU', 'một triệu'], ['NGHEO', 'NGHÈO', 'không giàu có'], ['CHANH', 'CHANH', 'quả chanh'],
  ['NHANH', 'NHANH', 'mau lẹ'], ['TRANH', 'TRANH', 'bức tranh'], ['THANG', 'THÁNG', 'tháng trong năm'],
  ['CHANG', 'CHÀNG', 'chàng trai'], ['KHACH', 'KHÁCH', 'khách hàng'], ['THACH', 'THẠCH', 'thạch rau câu'],
  ['GHENH', 'GHỀNH', 'gập ghềnh'], ['NGHEN', 'NGHẸN', 'nghẹn ngào'], ['QUYEN', 'QUYỂN', 'quyển sách'],
  ['KHUYA', 'KHUYA', 'đêm khuya'], ['CHIEN', 'CHIẾN', 'chiến đấu'], ['THIEN', 'THIÊN', 'trời (thiên nhiên)'],
  ['KHIEN', 'KHIÊN', 'tấm khiên'], ['TRIEN', 'TRIỂN', 'triển lãm'], ['CHUAN', 'CHUẨN', 'tiêu chuẩn'],
  ['KHUON', 'KHUÔN', 'khuôn mẫu'], ['CHUON', 'CHUỒN', 'chuồn chuồn'], ['THUON', 'THUÔN', 'thon dài'],
  ['NGUNG', 'NGỪNG', 'dừng lại'], ['PHUNG', 'PHỤNG', 'phụng sự'], ['THUNG', 'THÙNG', 'cái thùng'],
  ['KHUNG', 'KHUNG', 'khung ảnh'], ['CHONG', 'CHỒNG', 'người chồng'], ['PHONG', 'PHÒNG', 'căn phòng'],
  ['THONG', 'THÔNG', 'cây thông'], ['NHONG', 'NHỘNG', 'con nhộng'], ['PHANH', 'PHANH', 'cái phanh xe'],
  ['KHANG', 'KHÁNG', 'kháng cự'], ['GIANG', 'GIANG', 'sông (giang sơn)'], ['GIANH', 'GIÀNH', 'giành lấy'],
  ['GIONG', 'GIỌNG', 'giọng nói'], ['NGHIN', 'NGHÌN', 'một nghìn'], ['CHIEC', 'CHIẾC', 'chiếc lá'],
  ['TIENG', 'TIẾNG', 'tiếng nói'], ['MIENG', 'MIẾNG', 'miếng bánh'], 
  ['KHUAT', 'KHUẤT', 'khuất bóng'], ['TRUOT', 'TRƯỢT', 'trượt chân'], ['CHUOT', 'CHUỘT', 'con chuột'],
  ['NGUOC', 'NGƯỢC', 'ngược lại'], ['CUONG', 'CƯƠNG', 'dây cương'], ['GUONG', 'GƯƠNG', 'tấm gương'],
  ['VUONG', 'VƯƠNG', 'vua (vương quốc)'], ['TUONG', 'TƯỜNG', 'bức tường'], ['NUONG', 'NƯỚNG', 'thịt nướng'],
  ['BUONG', 'BUỒNG', 'buồng chuối, buồng ngủ'], ['RUONG', 'RUỘNG', 'đồng ruộng'], ['NHUOM', 'NHUỘM', 'nhuộm màu'],
  ['CHUOM', 'CHUÔM', 'ao chuôm'], ['THOAT', 'THOÁT', 'thoát ra'], ['KHOAI', 'KHOAI', 'củ khoai'],
  ['NGOAI', 'NGOÀI', 'bên ngoài'], ['THOAI', 'THOẠI', 'điện thoại'], ['KHOAN', 'KHOAN', 'mũi khoan'],
  ['NGOAN', 'NGOAN', 'ngoan ngoãn'], ['HOANG', 'HOÀNG', 'hoàng hôn'], ['NGANH', 'NGÀNH', 'ngành nghề'],
  ['QUYET', 'QUYẾT', 'quyết định'], ['TUYET', 'TUYẾT', 'tuyết rơi'], ['KHUAY', 'KHUẤY', 'khuấy đều'],
  ['HUYNH', 'HUYNH', 'huynh đệ'], ['QUYNH', 'QUỲNH', 'hoa quỳnh'], ['TRINH', 'TRÌNH', 'trình bày'],
  ['KHINH', 'KHINH', 'coi thường'], ['CHINH', 'CHÍNH', 'chính xác'], ['THINH', 'THÍNH', 'thính giác'],
  ['NGONG', 'NGỖNG', 'con ngỗng'], ['NHUOC', 'NHƯỢC', 'nhược điểm'], ['CHUOC', 'CHUỘC', 'chuộc lỗi'],
  ['DUYEN', 'DUYÊN', 'duyên dáng'], ['XUYEN', 'XUYÊN', 'xuyên qua'], ['TUYEN', 'TUYẾN', 'tuyến đường'],
  ['HUYEN', 'HUYỆN', 'quận huyện'], ['LUYEN', 'LUYỆN', 'luyện tập'], ['NGHET', 'NGHẸT', 'nghẹt mũi'],
  ['THIEP', 'THIỆP', 'tấm thiệp'], ['THIET', 'THIẾT', 'thiết kế'], ['CHIEM', 'CHIÊM', 'chiêm ngưỡng'],
  ['KHIEM', 'KHIÊM', 'khiêm tốn'], ['TRIET', 'TRIẾT', 'triết học'], ['NHIET', 'NHIỆT', 'nhiệt độ'],
  ['BIENG', 'BIẾNG', 'lười biếng'],
  ['XIENG', 'XIỀNG', 'xiềng xích'], ['KHUYU', 'KHUỶU', 'khuỷu tay'], ['NGUAY', 'NGUẬY', 'ngọ nguậy'],
  ['DOANH', 'DOANH', 'doanh nghiệp'], ['TOANH', 'TOANH', 'mới toanh'], ['LOANG', 'LOANG', 'loang lổ'],
  ['HOANH', 'HOÀNH', 'hoành tráng'], ['XOANG', 'XOANG', 'hát xoan, viêm xoang'], ['NGOAC', 'NGOẶC', 'dấu ngoặc'],
  ['KHOAC', 'KHOÁC', 'áo khoác'],
  ['NHANG', 'NHANG', 'nén nhang'], ['THANG', 'THANG', 'cái thang'],
  ['TRUAN', 'TRUÂN', 'gian truân'],
  ['BUONG', 'BUÔNG', 'buông tay'],
]

const seen = new Set()
export const ANSWERS = RAW.filter(([w, a]) => {
  if (!a || w.length !== 5 || seen.has(w)) return false
  seen.add(w)
  return true
}).map(([w, a, m]) => ({ w, a, m }))

export const ANSWER_BY_WORD = Object.fromEntries(ANSWERS.map((x) => [x.w, x]))

/* ---------- Âm tiết hợp lệ (không dấu) ---------- */
const ONSETS = ['', 'B', 'C', 'CH', 'D', 'G', 'GH', 'GI', 'H', 'K', 'KH', 'L', 'M', 'N', 'NG', 'NGH', 'NH', 'P', 'PH', 'QU', 'R', 'S', 'T', 'TH', 'TR', 'V', 'X']
const RHYMES = (
  'A AC ACH AI AM AN ANG ANH AO AP AT AU AY ' +
  'E EC ECH EM EN ENG ENH EO EP ET EU ' +
  'I IA ICH IEC IEM IEN IENG IEP IET IEU IM IN INH IP IT IU ' +
  'O OA OAC OACH OAI OAM OAN OANG OANH OAO OAP OAT OAY OC OE OEN OET OEO OI OM ON ONG OONG OOC OP OT ' +
  'U UA UAN UANG UAT UAY UAU UC UE UECH UENH UI UM UN UNG UOC UOI UOM UON UONG UOP UOT UOU UP UT UU UY UYA UYEN UYET UYNH UYT UYU ' +
  'Y YEN YET YEU'
).split(' ')
const QU_RHYMES = ['A', 'AC', 'ACH', 'AI', 'AN', 'ANG', 'ANH', 'AO', 'AT', 'AU', 'AY', 'E', 'EN', 'ENH', 'EO', 'ET', 'Y', 'YEN', 'YET', 'YNH', 'YT', 'OC', 'ON']

const SYL = new Set()
for (const o of ONSETS) {
  if (o === 'QU') {
    QU_RHYMES.forEach((r) => SYL.add(o + r))
    continue
  }
  for (const r of RHYMES) {
    const front = r[0] === 'I' || r[0] === 'E'
    if ((o === 'K' || o === 'GH' || o === 'NGH') && !front) continue
    if ((o === 'C' || o === 'G' || o === 'NG') && (front || r[0] === 'Y')) continue
    if (r[0] === 'Y' && o !== '') continue
    if (o === 'GI' && r[0] === 'I') continue
    SYL.add(o + r)
  }
}

function isSyllables(word, maxParts = 2) {
  if (SYL.has(word)) return true
  if (maxParts <= 1) return false
  for (let i = 1; i < word.length; i++) {
    if (SYL.has(word.slice(0, i)) && isSyllables(word.slice(i), maxParts - 1)) return true
  }
  return false
}

const memo = new Map()
export function isValidGuess(word) {
  if (ANSWER_BY_WORD[word]) return true
  if (memo.has(word)) return memo.get(word)
  const ok = /^[A-Z]+$/.test(word) && isSyllables(word)
  memo.set(word, ok)
  return ok
}
