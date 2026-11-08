/* ==========================================================
   Bộ Tứ: 16 từ → 4 nhóm. level 0 (dễ, vàng) → 3 (khó, tím).
   Mỗi câu đố có "bẫy": một từ có vẻ thuộc hai nhóm, nhưng chỉ một cách xếp đúng.
   ========================================================== */
import { dayNumber } from './chuan.js'

export const LEVEL_COLORS = ['#f3d36b', '#a7cf7b', '#9cc0ec', '#c4a3e3']
export const LEVEL_NAMES = ['Dễ', 'Vừa', 'Khó', 'Rất khó']

export const PUZZLES = [
  {
    groups: [
      { name: 'Trái cây', words: ['XOÀI', 'CAM', 'ỔI', 'MÍT'] },
      { name: 'Màu sắc', words: ['ĐỎ', 'TÍM', 'NÂU', 'XANH'] },
      { name: 'Bánh ___', words: ['XÈO', 'CHƯNG', 'MÌ', 'CUỐN'] },
      { name: 'Cá ___', words: ['VÀNG', 'MẬP', 'VOI', 'HEO'] },
    ],
  },
  {
    groups: [
      { name: 'Thời tiết', words: ['MƯA', 'NẮNG', 'GIÓ', 'BÃO'] },
      { name: 'Dụng cụ nhà bếp', words: ['NỒI', 'CHẢO', 'MUÔI', 'THỚT'] },
      { name: 'Con giáp', words: ['TÝ', 'NGỌ', 'THÂN', 'HỢI'] },
      { name: 'Nước ___', words: ['MẮM', 'MẮT', 'NGỌT', 'CHẤM'] },
    ],
  },
  {
    groups: [
      { name: 'Món ăn sáng', words: ['PHỞ', 'XÔI', 'BÚN', 'CHÁO'] },
      { name: 'Nhạc cụ dân tộc', words: ['ĐÀN BẦU', 'TRỐNG', 'CHIÊNG', 'KÈN'] },
      { name: 'Hoa ___', words: ['HỒNG', 'ĐÀO', 'MAI', 'SEN'] },
      { name: 'Chim ___', words: ['SÁO', 'CÚT', 'SẺ', 'ÉN'] },
    ],
  },
  {
    groups: [
      { name: 'Bộ phận cơ thể', words: ['TAY', 'CHÂN', 'MẮT', 'MŨI'] },
      { name: 'Phương tiện', words: ['TÀU', 'XE', 'THUYỀN', 'ĐÒ'] },
      { name: 'Đơn vị đo', words: ['MÉT', 'LÍT', 'CÂN', 'GIỜ'] },
      { name: 'Bàn ___', words: ['CỜ', 'PHÍM', 'THỜ', 'GHẾ'] },
    ],
  },
  {
    groups: [
      { name: 'Gia vị', words: ['MUỐI', 'TIÊU', 'ỚT', 'TỎI'] },
      { name: 'Người trong gia đình', words: ['ÔNG', 'BÀ', 'CHÚ', 'DÌ'] },
      { name: 'Các mùa', words: ['XUÂN', 'HẠ', 'THU', 'ĐÔNG'] },
      { name: 'Miền ___', words: ['BẮC', 'NAM', 'TRUNG', 'TÂY'] },
    ],
  },
  {
    groups: [
      { name: 'Đồ uống', words: ['TRÀ', 'BIA', 'SỮA', 'RƯỢU'] },
      { name: 'Nghề nghiệp', words: ['BÁC SĨ', 'KỸ SƯ', 'NÔNG DÂN', 'THỢ MỘC'] },
      { name: 'Môn thể thao', words: ['BƠI', 'VÕ', 'CẦU LÔNG', 'BẮN CUNG'] },
      { name: 'Mặt ___', words: ['TRĂNG', 'TRỜI', 'NẠ', 'ĐẤT'] },
    ],
  },
  {
    groups: [
      { name: 'Đồ dùng học tập', words: ['BÚT', 'THƯỚC', 'VỞ', 'TẨY'] },
      { name: 'Loài cây', words: ['TRE', 'BÀNG', 'PHƯỢNG', 'ĐA'] },
      { name: 'Truyện cổ tích', words: ['TẤM CÁM', 'THẠCH SANH', 'SỌ DỪA', 'CÂY KHẾ'] },
      { name: '___ trường', words: ['THỊ', 'QUẢNG', 'CHIẾN', 'MÔI'] },
    ],
  },
  {
    groups: [
      { name: 'Hoa', words: ['SEN', 'MAI', 'ĐÀO', 'CÚC'] },
      { name: 'Vị giác', words: ['CHUA', 'CAY', 'MẶN', 'ĐẮNG'] },
      { name: 'Sông ở Việt Nam', words: ['HỒNG', 'HƯƠNG', 'ĐÀ', 'HẬU'] },
      { name: 'Nhà ___', words: ['HÀNG', 'SÁCH', 'GA', 'THƠ'] },
    ],
  },
  {
    groups: [
      { name: 'Đồ trang sức', words: ['NHẪN', 'VÒNG', 'KHUYÊN', 'DÂY CHUYỀN'] },
      { name: 'Thú trong rừng', words: ['HỔ', 'GẤU', 'KHỈ', 'VOI'] },
      { name: 'Bánh ___', words: ['XE', 'MÌ', 'BAO', 'LÁI'] },
      { name: 'Quân cờ tướng', words: ['PHÁO', 'MÃ', 'TƯỢNG', 'SĨ'] },
    ],
  },
  {
    groups: [
      { name: 'Hành tinh (bỏ chữ "sao")', words: ['KIM', 'HOẢ', 'MỘC', 'THỔ'] },
      { name: 'Kim loại', words: ['SẮT', 'ĐỒNG', 'BẠC', 'CHÌ'] },
      { name: 'Ngón tay', words: ['CÁI', 'TRỎ', 'GIỮA', 'ÚT'] },
      { name: 'Áo ___', words: ['DÀI', 'MƯA', 'KHOÁC', 'GỐI'] },
    ],
  },
]

/* Thứ tự ô: xáo cố định theo số câu đố để mọi người thấy cùng một bàn */
function seededShuffle(arr, seed) {
  const a = [...arr]
  let s = seed * 9301 + 49297
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function puzzleForDay(d) {
  const n = dayNumber(d)
  const idx = ((n % PUZZLES.length) + PUZZLES.length) % PUZZLES.length
  const p = PUZZLES[idx]
  const groups = p.groups.map((g, level) => ({ ...g, level }))
  const tiles = seededShuffle(groups.flatMap((g) => g.words), n + 7)
  return { id: idx, number: n + 1, groups, tiles }
}

export const shuffle = (arr) => seededShuffle(arr, Math.floor(Math.random() * 100000))
