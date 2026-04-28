# Checklist Triển Khai (Deploy) Lên VPS Linux

Dưới đây là kết quả kiểm tra toàn bộ thư mục dự án để chuẩn bị deploy:

## 1. Ngôn ngữ / Framework đang dùng
- **Frontend**: Dự án sử dụng **React** chạy trên nền tảng **Vite** (`package.json` cho thấy các thư viện react, react-dom, vite).
- **Backend/Serverless APIs**: Thư mục `api/` chứa các endpoint xử lý logic (ví dụ `chat.js`, `sepay-webhook.js`). Cấu trúc API này có vẻ được thiết kế ban đầu để chạy trên Vercel (Vercel Serverless Functions). 
- *Lưu ý khi lên VPS Linux:* Vì VPS Linux không tự động chạy các tệp `api/` như Vercel, bạn sẽ cần một Node.js server (ví dụ dùng `express`) để phục vụ frontend và chạy các file api này.

## 2. Các file cần tạo thêm để deploy
- [x] **`.env`**: Cần tạo file biến môi trường chứa các secret key.
- [x] **`server.js`** (hoặc tương tự): Một tệp Express.js để chạy API và phục vụ file tĩnh của React (`dist/`) do môi trường hiện tại không phải Vercel.
- [x] **`ecosystem.config.cjs`**: (Tùy chọn) Để quản lý ứng dụng bằng PM2 sao cho app luôn bật.

## 3. Thông tin bí mật (API Keys lộ trong code)?
- **An toàn!**: Không phát hiện API key hay thông tin nhạy cảm bị hardcode trực tiếp trong mã nguồn. Các khóa như `OPENROUTER_API_KEY` trong `api/chat.js` đều được gọi qua biến môi trường `process.env`.
- Link Google Sheet (`landingConfig.js` và `google_apps_script.js`) được công khai với quyền thích hợp, nên an toàn khi lưu text cứng ở frontend.

## 4. Danh sách các thứ cần chuẩn bị trước khi deploy
- [ ] **Node.js & npm**: Đã cài đặt trên VPS (Khuyến nghị bản LTS 18.x hoặc 20.x).
- [ ] **Mã nguồn trên VPS**: Clone repository hoặc upload source code từ máy tính lên VPS.
- [ ] **Biến môi trường**: Tạo tệp `.env` trên VPS và thiết lập đầy đủ khóa API (OpenRouter, SePay, v.v.).
- [ ] **PM2**: Cài đặt PM2 để chạy server ngầm (`npm install -g pm2`).
- [ ] **Nginx (Tùy chọn)**: Để trỏ domain (wolffia.io.vn) về port của server Node.js và cài đặt SSL/HTTPS.

---
*Bản đồ đã sẵn sàng, chúc dự án deploy thành công ngày mai!*
