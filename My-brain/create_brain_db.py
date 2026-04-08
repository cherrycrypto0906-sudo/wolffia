import sqlite3
import os

def setup_database():
    db_name = "brain.db"
    
    # Connect to (or create) the database
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # Define tables and their structures
    tables = {
        "knowledge": "id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "business": "id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "brand_voice": "id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    }

    # Create tables
    for table_name, schema in tables.items():
        cursor.execute(f"DROP TABLE IF EXISTS {table_name}")
        cursor.execute(f"CREATE TABLE {table_name} ({schema})")
        print(f"Bảng '{table_name}' đã được tạo.")

    # Sample data
    data = {
        "knowledge": [
            ("Nguyên lý Pareto", "80% kết quả đến từ 20% nỗ lực."),
            ("Kỹ thuật Pomodoro", "Làm việc 25 phút, nghỉ 5 phút để tối ưu sự tập trung.")
        ],
        "business": [
            ("Sản phẩm: Wolffia Tươi", "Siêu thực phẩm xanh, giàu đạm và vitamin."),
            ("Khách hàng mục tiêu", "Người quan tâm đến sức khỏe và lối sống bền vững.")
        ],
        "brand_voice": [
            ("Tone giọng: Chân thành", "Luôn trung thực, minh bạch và gần gũi với khách hàng."),
            ("Style: Hiện đại", "Sử dụng ngôn ngữ trẻ trung nhưng vẫn chuyên nghiệp.")
        ]
    }

    # Insert sample data
    for table_name, rows in data.items():
        for title, content in rows:
            cursor.execute(f"INSERT INTO {table_name} (title, content) VALUES (?, ?)", (title, content))
        print(f"Đã thêm 2 dòng mẫu vào bảng '{table_name}'.")

    # Commit and close
    conn.commit()
    conn.close()
    print(f"\nDatabase '{db_name}' đã được thiết lập thành công tại {os.path.abspath(db_name)}.")

if __name__ == "__main__":
    setup_database()
