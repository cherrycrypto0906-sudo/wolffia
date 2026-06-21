# MCP Functions Draft

Dưới đây là 7 MCP function hữu ích cho website Wolffia hiện tại, xếp theo độ ưu tiên giảm dần dựa trên những gì codebase đang có sẵn: form khảo sát nhận cookbook, order QR, admin panel, email flow, chatbot và dữ liệu chung qua `admin-db`.

## 1. `today_orders_summary`
- Input params:
  - `date: string` — ngày cần xem theo định dạng `YYYY-MM-DD`, mặc định là hôm nay
- Output dự kiến:
  - `date: string`
  - `total_orders: number`
  - `paid_orders: number`
  - `pending_orders: number`
  - `total_revenue: number`
  - `top_products: Array<{ product_name: string, quantity: number, revenue: number }>`
- Tình huống dùng hàng ngày:
  - "Hôm nay có bao nhiêu đơn, bao nhiêu đơn đã trả tiền và tổng doanh thu là bao nhiêu?"
- Độ ưu tiên:
  - `5`

## 2. `list_new_waitlist_leads`
- Input params:
  - `date: string` — ngày cần lọc theo định dạng `YYYY-MM-DD`, mặc định là hôm nay
  - `limit: number` — số lead muốn lấy, mặc định `20`
  - `gift_interest_only: boolean` — chỉ lấy lead thật sự muốn nhận cookbook/quà, mặc định `true`
- Output dự kiến:
  - `date: string`
  - `total_leads: number`
  - `leads: Array<{ name: string, email: string, phone?: string, persona?: string, challenges?: string[], desiredBenefit?: string, giftInterest?: string, submittedAt?: string }>`
- Tình huống dùng hàng ngày:
  - "Ai mới điền form hôm nay để tôi follow up ngay trên Zalo hoặc gọi điện?"
- Độ ưu tiên:
  - `5`

## 3. `update_hero_content`
- Input params:
  - `headline: string` — tiêu đề chính mới
  - `subheadline?: string` — mô tả phụ mới
  - `primary_cta?: string` — text nút CTA chính
  - `secondary_cta?: string` — text nút CTA phụ
- Output dự kiến:
  - `updated: boolean`
  - `changed_fields: string[]`
  - `preview: { headline: string, subheadline?: string, primary_cta?: string, secondary_cta?: string }`
- Tình huống dùng hàng ngày:
  - "Đổi headline landing theo chương trình hôm nay như flash sale, mở đơn mới hay quà tặng mới."
- Độ ưu tiên:
  - `5`

## 4. `mark_order_paid`
- Input params:
  - `order_id?: string` — id đơn hàng nếu đã biết
  - `transfer_content?: string` — nội dung chuyển khoản để dò đúng đơn
  - `customer_name?: string` — tên khách để hỗ trợ tìm kiếm
- Output dự kiến:
  - `updated: boolean`
  - `order: { id: string, customer_name: string, product_name: string, amount: number, status: string }`
  - `message: string`
- Tình huống dùng hàng ngày:
  - "Khách báo đã chuyển khoản nhưng hệ thống chưa auto nhận, tôi muốn đánh dấu đã thanh toán ngay bằng Telegram."
- Độ ưu tiên:
  - `4`

## 5. `send_followup_email_to_lead`
- Input params:
  - `email: string`
  - `name?: string`
  - `mode: string` — ví dụ `cookbook_sequence` hoặc `order_confirmation`
- Output dự kiến:
  - `sent: boolean`
  - `mode: string`
  - `email: string`
  - `provider_response?: object`
- Tình huống dùng hàng ngày:
  - "Lead vừa nóng, tôi muốn đẩy lại chuỗi email cookbook hoặc gửi một email chăm sóc ngay mà không cần vào admin."
- Độ ưu tiên:
  - `3`

## 6. `get_pending_payment_orders`
- Input params:
  - `limit: number` — số đơn cần lấy ra, mặc định `20`
  - `min_amount?: number` — chỉ lấy các đơn từ mức tiền này trở lên
- Output dự kiến:
  - `total_pending: number`
  - `orders: Array<{ id: string, customer_name: string, phone?: string, product_name: string, amount: number, transfer_content?: string, purchased_at?: string }>`
- Tình huống dùng hàng ngày:
  - "Cho tôi xem các đơn đang chờ thanh toán để biết đơn nào cần nhắc khách chuyển khoản."
- Độ ưu tiên:
  - `3`

## 7. `get_customer_questions_summary`
- Input params:
  - `date: string` — ngày cần xem theo định dạng `YYYY-MM-DD`, mặc định là hôm nay
  - `limit: number` — số câu hỏi/feedback cần gom, mặc định `20`
- Output dự kiến:
  - `date: string`
  - `total_items: number`
  - `top_challenges: Array<{ label: string, count: number }>`
  - `persona_breakdown: Array<{ label: string, count: number }>`
  - `notes: string[]`
- Tình huống dùng hàng ngày:
  - "Hôm nay khách đang vướng điều gì nhiều nhất để tôi viết bài, sửa content hoặc trả lời chatbot cho trúng."
- Độ ưu tiên:
  - `3`

## Gợi ý chọn 5 cái build đầu tiên
1. `today_orders_summary`
2. `list_new_waitlist_leads`
3. `update_hero_content`
4. `mark_order_paid`
5. `send_followup_email_to_lead`

Lý do:
- 5 function này bám đúng những việc vận hành sát thực tế nhất: xem doanh thu, xem lead mới, chỉnh thông điệp landing, xác nhận thanh toán và chăm lead qua email.
- Chúng tận dụng trực tiếp dữ liệu và endpoint đã có sẵn trong codebase hiện tại nên build nhanh và ít phải mở thêm scope.
- Đây là bộ đủ mạnh để bạn vừa theo dõi bán hàng, vừa xử lý follow-up, vừa thay đổi landing ngay từ Telegram.
