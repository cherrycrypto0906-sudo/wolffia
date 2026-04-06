// Hướng dẫn cài đặt Google Apps Script:
// 1. Vào trang Google Sheet của bạn (https://docs.google.com/spreadsheets/d/12F6jLbSPf6KJUQPIXxQ6ar77NTtJqDNHulNVVj1F9Yg/edit)
// 2. Chọn Tiện ích mở rộng (Extensions) -> Apps Script (Tập lệnh ứng dụng)
// 3. Copy toàn bộ đoạn code dưới đây và dán thay thế cho nội dung trong file Code.gs hoặc Mã.gs
// 4. Nhấn Lưu (Save - biểu tượng đĩa mềm)
// 5. Chọn Triển khai (Deploy) -> Triển khai mới (New deployment)
// 6. Chọn Loại (Select type): Ứng dụng web (Web app)
//    - Mô tả: "Wolffia Landing Page API"
//    - Thực thi dưới dạng (Execute as): Bạn (Chủ sở hữu bảng tính)
//    - Những người có quyền truy cập (Who has access): Bất kỳ ai (Anyone)
// 7. Nhấn Triển khai (Deploy), sau đó Cấp quyền (Authorize access) khi được yêu cầu. Google có thể cảnh báo ứng dụng chưa được xác minh, bạn nhấp vào Nâng cao (Advanced) -> Đi tới mục dự án... (Go to project...).
// 8. Copy URL Web app và dán vào thay thế cho CONFIG.formDestination trong file src/config/landingConfig.js

const SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/12F6jLbSPf6KJUQPIXxQ6ar77NTtJqDNHulNVVj1F9Yg/edit";
const FOLDER_NAME = "Wolffia_Payment_Screenshots"; // Tên thư mục lưu ảnh xác nhận chuyển khoản trên Google Drive

function doPost(e) {
  try {
    // Parser dữ liệu từ JSON string
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      throw new Error("No data received");
    }
    
    // Khởi tạo URL ảnh trống
    let uploadedFileUrl = "";

    // Xử lý ảnh base64 nếu có
    if (data.screenshotBase64) {
      // Tách bỏ phần "data:image/jpeg;base64," hoặc tương tự nếu có
      let base64Data = data.screenshotBase64;
      if (base64Data.indexOf("base64,") !== -1) {
        base64Data = base64Data.split("base64,")[1];
      }

      // Xác định mimeType, mặc định là image/jpeg
      let mimeType = data.screenshotMimeType || "image/jpeg";
      
      // Khởi tạo Blob
      const blob = Utilities.newBlob(
        Utilities.base64Decode(base64Data),
        mimeType,
        data.screenshotFileName || `payment_${new Date().getTime()}.jpg`
      );

      // Tìm hoặc tạo thư mục
      let folders = DriveApp.getFoldersByName(FOLDER_NAME);
      let folder;
      if (folders.hasNext()) {
        folder = folders.next();
      } else {
        folder = DriveApp.createFolder(FOLDER_NAME);
        // Đặt quyền xem cho tất cả những người có link để dễ dàng xem ảnh trực tiếp từ file sheet
        folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      }

      // Lưu file vào thư mục
      const file = folder.createFile(blob);
      uploadedFileUrl = file.getUrl();
    }

    // Ghi dữ liệu vào Google Sheet
    const sheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL).getActiveSheet();
    
    // Nếu sheet chưa có tiêu đề (header) thì nên thêm header
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời gian", 
        "Trạng thái", 
        "Họ và tên", 
        "Số điện thoại", 
        "Zalo", 
        "Khu vực", 
        "Gói quan tâm", 
        "Số lượng", 
        "Tiền cọc", 
        "Ghi chú", 
        "Ảnh Chuyển Khoản"
      ]);
    }

    // Chuẩn bị dữ liệu từng dòng
    const rowData = [
      data.submittedAt || new Date().toISOString(),                        // A: Thời gian
      data.submissionStatus === 'free_reservation' ? 'Đăng ký giữ chỗ / Thông báo' : 'Đã tải ảnh chờ xác nhận', // B: Trạng thái (Vietnamese)
      data.name || "",                                                     // C: Họ và tên
      "'" + (data.phone || ""),                                            // D: Số điện thoại (thêm nháy để không bị mất số 0)
      "'" + (data.zalo || ""),                                             // E: Zalo
      data.location || "",                                                 // F: Khu vực
      data.packageName || data.packageId || "",                            // G: Gói quan tâm
      data.quantity || 1,                                                  // H: Số lượng
      data.depositAmount || 0,                                             // I: Số tiền cọc
      data.note || "",                                                     // J: Ghi chú
      uploadedFileUrl                                                      // K: Link ảnh xác nhận trực tiếp (Ai xem cũng được)
    ];

    sheet.appendRow(rowData);

    // Trả về JSON xác nhận (sẽ không bị bắt nếu Frontend cấu hình mode: 'no-cors' nhưng server xử lý thành công)
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data and image saved successfully"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Trả về lỗi
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
