# Hướng dẫn Deploy Wolffia Landing Page lên VPS Ubuntu

Dự án này là một ứng dụng kết hợp Frontend (React/Vite) và Backend (Node.js/Express) được phục vụ chung qua `server.js`.

## 1. Môi trường yêu cầu trên VPS
- **Node.js**: Phiên bản 18.x hoặc 20.x trở lên.
- **PM2**: Để chạy ứng dụng nền tảng production (`npm install -g pm2`).
- **Git**: Để clone source code.

## 2. Các biến môi trường (.env) cần thiết
Trước khi chạy, bạn cần tạo file `.env` ở thư mục gốc của dự án trên VPS và điền các giá trị sau (tham khảo `.env.example`):

```env
PORT=3000
NODE_ENV=production

# Token & API Keys
VERCEL_OIDC_TOKEN="<Điền token từ .env.local nếu cần>"
RESEND_API_KEY="<Điền key từ resend_config.txt>"
OPENROUTER_API_KEY="<Nếu có dùng AI text generation>"

# Cơ sở dữ liệu và Admin
DATABASE_URL="<Chuỗi kết nối DB nếu có>"
ADMIN_PASSWORD="<Mật khẩu cho trang quản trị>"
```

*Lưu ý: Các URL của Google Apps Script hiện đang được config cứng trong `src/config/landingConfig.js` vì nó được truy cập từ phía client (trình duyệt). Nếu sau này bạn đổi URL, hãy nhớ build lại ứng dụng.*

## 3. Các lệnh để chạy server

### Cách 1: Chạy trực tiếp (để test)
```bash
# 1. Cài đặt các thư viện (chỉ chạy lần đầu)
npm install

# 2. Build Frontend (React -> HTML/CSS/JS tĩnh)
npm run build

# 3. Chạy Server
node server.js
```

### Cách 2: Chạy bằng PM2 (khuyên dùng cho Production)
```bash
# Đảm bảo đã build xong frontend
npm run build

# Khởi chạy ứng dụng qua file ecosystem.config.cjs
pm2 start ecosystem.config.cjs

# Lưu lại danh sách PM2 để tự khởi động khi VPS khởi động lại
pm2 save
pm2 startup
```

## 4. Cổng đang lắng nghe
- Server Express (tại `server.js`) đang lắng nghe ở **Port: 3000** (theo cấu hình `process.env.PORT || 3000`).
- Bạn có thể cấu hình Nginx (Reverse Proxy) để trỏ tên miền (ví dụ: `wolffia.vn`) vào `http://localhost:3000`.
