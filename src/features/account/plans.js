/* Thông tin trình bày cho các gói đọc (giá lấy từ PLANS trong store) */
export const PLAN_FEATURES = {
  news: ['Đọc không giới hạn mọi bài viết', 'Bản tin email dành riêng người đăng ký', 'Nghe bài báo bằng giọng đọc', 'Kho lưu trữ từ ngày thành lập'],
  all: ['Mọi quyền lợi của gói Tin tức', 'Trò chơi: Chữ Ẩn, Bộ Tứ, Sudoku và kho đề cũ', 'Ẩm thực: hơn 2.000 công thức đã thử nghiệm', 'Podcast và video không quảng cáo'],
  family: ['Mọi quyền lợi của gói Trọn bộ', '4 tài khoản riêng, mỗi người một đăng nhập', 'Danh sách đọc và thống kê trò chơi riêng', 'Quản lý thành viên ngay trong tài khoản'],
}

export const COMPARE = [
  ['Bài viết, phân tích, phóng sự', ['news', 'all', 'family']],
  ['Nghe bài báo bằng giọng đọc', ['news', 'all', 'family']],
  ['Trò chơi chữ và Sudoku', ['all', 'family']],
  ['Công thức Ẩm thực', ['all', 'family']],
  ['Podcast và video không quảng cáo', ['all', 'family']],
  ['4 người dùng riêng', ['family']],
]

export const PLAN_FAQ = [
  ['Tôi có bị trừ tiền trong thời gian dùng thử không?', 'Không. Bạn dùng miễn phí 7 ngày. Nếu huỷ trước khi hết hạn, bạn sẽ không bị tính phí. Trong bản demo này không có giao dịch thật nào xảy ra.'],
  ['Giá ưu đãi kéo dài bao lâu?', 'Giá ưu đãi tính theo tuần, áp dụng trong 12 tháng đầu và được thanh toán mỗi 4 tuần. Sau đó gói tự động gia hạn với giá thường tính theo tháng.'],
  ['Tôi có thể huỷ bất cứ lúc nào không?', 'Có. Vào Tài khoản → Gói của bạn → Huỷ gói. Bạn vẫn dùng được đến hết kỳ đã thanh toán.'],
  ['Gói Gia đình hoạt động thế nào?', 'Người mua gói mời tối đa 3 người qua email. Mỗi người có tài khoản, lịch sử đọc và thống kê trò chơi riêng.'],
  ['Tôi có thể đổi gói không?', 'Có, bạn đổi gói trong mục Tài khoản. Phần chênh lệch được tính theo ngày còn lại của kỳ.'],
]
