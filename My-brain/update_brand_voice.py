import sqlite3

def add_brand_voice_details():
    db_name = "brain.db"
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    details = [
        ("Tone & Phong cách", "Gần gũi, thẳng thắn, hài hước, thân thiện, không dùng từ hoa mỹ, câu ngắn gọn."),
        ("Từ vựng hay dùng", "'thật ra', 'đơn giản thôi', 'thử xem', 'không cần phức tạp', xưng tên 'Diệp Châu', 'mình', 'cả nhà', 'hông có', 'đúng hem?', dùng icon theo cảm xúc."),
        ("Từ vựng cấm dùng", "Không dùng: 'synergy', 'leverage', 'tối ưu hóa trải nghiệm', và các từ quá corporate/sang chảnh giả tạo."),
        ("Đối tượng mục tiêu", "Người đi làm 20-40 tuổi muốn khởi nghiệp online; người quan tâm sức khỏe; tầng lớp có thu nhập cao."),
        ("Ví dụ bài mẫu tiêu chuẩn", "Tết này uống cafe ngon, nhất định thử cafe đặc sản nha ❤️❤️\nQuay cuồng cùng vị nhà, Diệp Châu chưa kịp báo cả nhà Tết nay nhà Diệp Châu có cà phê đặc sản rồi đó. Cafe được chính tay bố quế mẹ liên làm, cả nhà chong đèn ngồi lựa từng hạt chín hạt xanh. Những mẻ này gần như chín tuyệt đối nên sẽ ấn tượng lắm đó cả nhà nha ☺️ xịn ạ\nCà phê thơm lắm, chưa kịp khui mà hương đã ngây ngất rồi. Cà phê được lên men nên sẽ có khá nhiều hương trái cây đó cả nhà, thú vị lắm, thơm lừng hít lấy hít để thôi, hậu ngọt kéo dài, chua nhẹ, mượt lắm.\nDiệp Châu đang sẵn để giao ngay trước Tết. Diệp Châu mời cả nhà nha")
    ]

    cursor.executemany("INSERT INTO brand_voice (title, content) VALUES (?, ?)", details)
    
    conn.commit()
    conn.close()
    print("Đã cập nhật chi tiết Brand Voice vào bảng 'brand_voice' thành công!")

if __name__ == "__main__":
    add_brand_voice_details()
