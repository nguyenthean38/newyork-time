/* Danh sách địa điểm để gợi ý trong "Địa điểm đã lưu" */
export const CITIES = [
  ['Hà Nội', 'Thủ đô'], ['TP. Hồ Chí Minh', 'Thành phố trực thuộc trung ương'], ['Hải Phòng', 'Thành phố trực thuộc trung ương'],
  ['Đà Nẵng', 'Thành phố trực thuộc trung ương'], ['Cần Thơ', 'Thành phố trực thuộc trung ương'], ['Huế', 'Thành phố trực thuộc trung ương'],
  ['Hạ Long', 'Quảng Ninh'], ['Móng Cái', 'Quảng Ninh'], ['Bắc Ninh', 'Bắc Ninh'], ['Thái Nguyên', 'Thái Nguyên'], ['Lào Cai', 'Lào Cai'],
  ['Sa Pa', 'Lào Cai'], ['Điện Biên Phủ', 'Điện Biên'], ['Sơn La', 'Sơn La'], ['Lạng Sơn', 'Lạng Sơn'], ['Cao Bằng', 'Cao Bằng'],
  ['Hà Giang', 'Tuyên Quang'], ['Ninh Bình', 'Ninh Bình'], ['Nam Định', 'Ninh Bình'], ['Thanh Hoá', 'Thanh Hoá'], ['Vinh', 'Nghệ An'],
  ['Hà Tĩnh', 'Hà Tĩnh'], ['Đồng Hới', 'Quảng Trị'], ['Đông Hà', 'Quảng Trị'], ['Hội An', 'Đà Nẵng'], ['Tam Kỳ', 'Đà Nẵng'],
  ['Quảng Ngãi', 'Quảng Ngãi'], ['Quy Nhơn', 'Gia Lai'], ['Pleiku', 'Gia Lai'], ['Kon Tum', 'Quảng Ngãi'], ['Buôn Ma Thuột', 'Đắk Lắk'],
  ['Tuy Hoà', 'Đắk Lắk'], ['Nha Trang', 'Khánh Hoà'], ['Cam Ranh', 'Khánh Hoà'], ['Phan Rang', 'Khánh Hoà'], ['Đà Lạt', 'Lâm Đồng'],
  ['Bảo Lộc', 'Lâm Đồng'], ['Phan Thiết', 'Lâm Đồng'], ['Biên Hoà', 'Đồng Nai'], ['Thủ Dầu Một', 'TP. Hồ Chí Minh'], ['Vũng Tàu', 'TP. Hồ Chí Minh'],
  ['Tây Ninh', 'Tây Ninh'], ['Mỹ Tho', 'Đồng Tháp'], ['Cao Lãnh', 'Đồng Tháp'], ['Long Xuyên', 'An Giang'], ['Châu Đốc', 'An Giang'],
  ['Rạch Giá', 'An Giang'], ['Phú Quốc', 'An Giang'], ['Vĩnh Long', 'Vĩnh Long'], ['Bến Tre', 'Vĩnh Long'], ['Trà Vinh', 'Vĩnh Long'],
  ['Sóc Trăng', 'Cần Thơ'], ['Bạc Liêu', 'Cà Mau'], ['Cà Mau', 'Cà Mau'], ['Côn Đảo', 'TP. Hồ Chí Minh'],
  ['Singapore', 'Singapore'], ['Bangkok', 'Thái Lan'], ['Tokyo', 'Nhật Bản'], ['Seoul', 'Hàn Quốc'], ['Sydney', 'Úc'],
  ['Melbourne', 'Úc'], ['Paris', 'Pháp'], ['Berlin', 'Đức'], ['London', 'Anh'], ['San Jose', 'Hoa Kỳ'], ['Toronto', 'Canada'],
].map(([name, region]) => ({ name, region, label: `${name}, ${region}` }))
