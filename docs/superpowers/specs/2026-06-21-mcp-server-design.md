# MCP Server Design

## Goal

Thêm một MCP server riêng cho business Wolffia, chạy tách khỏi website chính, để goClaw có thể gọi 5 tool qua HTTP mà không cần chạm trực tiếp vào frontend hay mở database/public sheet ra ngoài.

## Chosen Approach

Dùng một service Node.js/Express riêng trong cùng repo, bind tại `127.0.0.1:3001`, expose endpoint MCP `/mcp`, và tái sử dụng logic/data source hiện có của website.

Lý do chọn hướng này:
- Tách biệt khỏi app web đang chạy ở `:3000`, nên lỗi MCP không kéo sập landing/admin
- Dễ deploy chung trên cùng VPS và dùng lại `.env`, `brain.db`, Google Apps Script, Resend key
- Dễ rollback: chỉ cần dừng service MCP nếu có sự cố

## Tools In Scope

5 tool build đầu tiên:

1. `today_orders_summary`
2. `list_new_waitlist_leads`
3. `update_hero_content`
4. `mark_order_paid`
5. `send_followup_email_to_lead`

## Architecture

### Runtime

- Website chính tiếp tục chạy ở `:3000`
- MCP server mới chạy ở `127.0.0.1:3001`
- goClaw trên cùng VPS sẽ gọi MCP bằng `http://127.0.0.1:3001/mcp`

### Data Sources

- Đọc và ghi đơn hàng/khách hàng/lead thông qua logic `api/admin-db.js`
- Gửi email follow-up bằng logic `api/email-sequence-enroll.js`
- Cập nhật content landing bằng cách sửa file cấu hình content cục bộ trong repo, ưu tiên `src/locales/vi.json` và/hoặc `src/config/landingConfig.js`, sau đó trigger rebuild/restart deploy hook nội bộ

### Internal Boundaries

- Một lớp `business service` dùng chung để lấy dữ liệu orders/leads và update records
- Một lớp `mcp tool adapter` nhận input/output schema theo MCP
- Một lớp `content updater` chỉ chịu trách nhiệm đổi hero text an toàn và trả preview phần đã đổi

## Tool Behavior

### `today_orders_summary`

- Đọc orders từ source admin hiện tại
- Lọc theo ngày
- Tính tổng đơn, đơn paid, đơn pending, tổng doanh thu, top sản phẩm

### `list_new_waitlist_leads`

- Đọc survey leads từ source admin hiện tại
- Lọc theo ngày và số lượng
- Hỗ trợ chỉ lấy lead thật sự muốn nhận quà

### `update_hero_content`

- Chỉ cho phép đổi các field hero được whitelist
- Ghi thay đổi vào file content
- Trả preview giá trị mới
- Chưa auto-deploy public ngay trong phiên bản đầu nếu chưa có quy trình safe reload; bản đầu có thể cập nhật code/file và trả trạng thái cần redeploy, hoặc nếu đơn giản thì gọi script deploy nội bộ

### `mark_order_paid`

- Tìm order theo `order_id`, hoặc fallback bằng `transfer_content` / `customer_name`
- Update trạng thái sang `paid`
- Trả lại order đã cập nhật

### `send_followup_email_to_lead`

- Gọi lại email sequence hoặc order confirmation flow tùy `mode`
- Validate input trước khi gửi
- Trả trạng thái gửi và metadata cơ bản

## Error Handling

- Input sai schema: trả lỗi validation rõ field nào thiếu/sai
- Không tìm thấy order/lead: trả lỗi business-level, không crash tool
- Google Apps Script / Resend lỗi: bubble up message ngắn gọn để goClaw báo lại trong Telegram
- File content không sửa được: trả lỗi và không chạm các phần khác

## Security

- MCP chỉ bind `127.0.0.1`, không public ra internet
- Dùng lại `.env` hiện có, không thêm secret hardcode mới
- Không expose raw admin password qua tool output
- Các tool write phải whitelist field được phép sửa

## Testing Strategy

- Unit/smoke test cho từng business helper chính
- Local verification:
  - MCP health endpoint sống
  - Tool read trả dữ liệu thật
  - Tool write update được order/test field
- VPS verification:
  - service `mcp-server` active
  - `curl http://127.0.0.1:3001/mcp` hoặc health endpoint có phản hồi
  - goClaw thêm MCP server thành công

## Files Expected

- `mcp-server/` hoặc `mcp/` cho runtime MCP riêng
- `lib/businessData.js` hoặc tương đương cho logic đọc/ghi dùng chung
- `lib/contentUpdate.js` cho hero update
- `deploy_notes.md` cập nhật thêm service MCP

## Non-Goals For V1

- Không mở MCP ra public internet
- Không build full CMS cho toàn bộ website
- Không cho Telegram sửa mọi file tùy ý
- Không động đến `brain.db` nếu 5 tool đầu chưa cần
