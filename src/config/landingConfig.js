export const CONFIG = {
  // v1.0.1 - Final Visual Fixes
  // === TRẠNG THÁI & THỜI GIAN ===
  countdownMinutes: 45, // Đếm ngược bao nhiêu phút kể từ lúc mở web
  limitedSlots: 30, // Khai báo số suất trống hiện tại cho hôm nay
  slotsRemaining: 12, // Số suất còn lại hiển thị trên UI

  // === LINK LIÊN KẾT ===
  zaloLink: "https://zalo.me/g/dwrlrtrnnnivi1xhmzbu", // Link tham gia cộng đồng Zalo
  depositLink: "https://example.com/thanh-toan", // Link thanh toán cọc nhanh nếu có
  formDestination: "https://script.google.com/macros/s/AKfycbxwvabPdBcbkwYB67ZPjdNkLi3jZgv15cgGSJx6J_x9Av_3UX93MZCLQgodYlic_dik3A/exec", // Google Apps Script → Google Sheets
  sheetUrl: "https://docs.google.com/spreadsheets/d/12F6jLbSPf6KJUQPIXxQ6ar77NTtJqDNHulNVVj1F9Yg/edit?gid=0#gid=0", // Sheet lưu lead + ảnh xác nhận chuyển khoản

  // === THUẬT TOÁN SOCIAL PROOF (Ảo) ===
  socialProof: {
    totalInterested: 127,
    totalInZalo: 43,
    recentActivities: [
      "Chị Linh ở Thủ Đức vừa giữ chỗ Gói 3 Bữa Xanh",
      "Một khách hàng ở Quận 7 vừa vào cộng đồng Zalo",
      "Chị Mai vừa đặt cọc giữ suất giao đợt tới",
      "Khách tại Bình Thạnh vừa chọn Gói Healthy"
    ]
  },

  // === HÌNH ẢNH SẢN PHẨM & LIÊN QUAN ===
  images: {
    logo: "/assets/logo_black.png",
    productBox: "/assets/hero_product.png",
    heroCarousel: [
      "/assets/hero_pizza_wolffia.avif",
      "/assets/hero_toast_wolffia.webp",
      "/assets/hero_pasta_wolffia.jpg",
      "/assets/hero_flatbread_wolffia.jpg"
    ],
    solutionFood: "/assets/hero_pond.png",
    heroFood: "/assets/hero_product_v2.png",
    closeUp: "/assets/hero_product_v2.png",
    salad: "/assets/gallery_salad.png",
    soup: "/assets/gallery_rice_porridge.png",
    noodles: "/assets/gallery_noodles.png",
    smoothie: "/assets/gallery_smoothie.png",
    breakfast: "/assets/gallery_breakfast.png",
    lifestyle: "/assets/lifestyle_table.png",
    qrPayment: "/assets/qr_payment_v3.jpg"
  },




  // === THIẾT LẬP THANH TOÁN (VIETQR) ===
  sepayConfig: {
    bankId: "TCB",           // ID ngân hàng (MB, VCB, ICB, TCB, ...)
    bankName: "Techcombank",     // Tên hiển thị
    accountNumber: "1903 5892 3780 11", // Số tài khoản
    accountName: "NGUYEN THI ANH NGUYET",  // Tên chủ tài khoản
    depositAmount: 29000    // Số tiền đặt cọc
  },



  // === TEXT HIGHLIGHTS ===
  guarantee: "100% tươi mới thu hoạch trong ngày - Hoàn tiền nếu không tươi",
  scarcity: "Chỉ thu hoạch giới hạn 50 suất/ngày để đảm bảo độ tươi ngon nhất",

  // === REVIEWS / ZALO CHAT ===
  chatReviews: [
    {
      name: "Ngọc Anh",
      avatar: "https://i.pravatar.cc/100?img=5",
      time: "Hôm nay 09:12",
      messages: [
        "Em mới nhận sáng nay rắc lên cháo cho bé ăn thử. Lúc đầu sợ bé kén ăn mà cuối cùng cu cậu ăn sạch luôn 🤣"
      ],
      isCustomer: true
    },
    {
      name: "Diệp Châu Wolffia",
      avatar: "/logo.png",
      time: "Hôm nay 09:15",
      messages: [
        "Dạ Diệp Châu cảm ơn chị ạ, vì Wolffia có vị nhạt dễ hòa quyện nên các bé rất dễ ăn đó ạ 🥰"
      ],
      isCustomer: false
    },
    {
      name: "Tuấn Minh",
      avatar: "https://i.pravatar.cc/100?img=11",
      time: "Hôm nay 12:30",
      messages: [
        "Sản phẩm đóng gói cẩn thận. Mình mang theo đi làm rắc vào tô phở buổi sáng, nhanh gọn."
      ],
      isCustomer: true
    },
    {
      name: "Diệp Châu Wolffia",
      avatar: "/logo.png",
      time: "Hôm nay 12:45",
      messages: [
        "Dạ đúng rồi anh, thiết kế hộp nhỏ gọn rất tiện mang theo đến chỗ làm để luôn có rau tươi ạ."
      ],
      isCustomer: false
    }
  ],
  // === GÓI SẢN PHẨM & GIÁ ===
  packages: [
    {
      id: "goi-lam-quen",
      name: "Gói Làm Quen",
      weight: "80g",
      originalPrice: "69.000",
      price: "49.000",
      description: "Dành cho người mới muốn thử 1–2 món đầu tiên",
      badge: "",
      ctaText: "Thử gói này"
    },
    {
      id: "goi-3-bua",
      name: "Gói 3 Bữa Xanh",
      weight: "150g",
      originalPrice: "129.000",
      price: "89.000",
      description: "Vừa đẹp để bắt đầu dùng đều trong vài bữa",
      badge: "Bán chạy nhất",
      ctaText: "Nhận quà tặng"
    },
    {
      id: "goi-healthy",
      name: "Gói Healthy",
      weight: "300g",
      originalPrice: "219.000",
      price: "159.000",
      description: "Cho người muốn ăn xanh thường xuyên hơn trong tuần",
      badge: "",
      ctaText: "Chọn gói Healthy"
    },
    {
      id: "goi-gia-dinh",
      name: "Gói Gia Đình",
      weight: "500g",
      originalPrice: "349.000",
      price: "249.000",
      description: "Phù hợp gia đình nhỏ hoặc người dùng thường xuyên",
      badge: "",
      ctaText: "Nhận quà tặng"
    },
    {
      id: "goi-tuan",
      name: "Gói Giữ Chỗ Theo Tuần",
      weight: "4 x 150g",
      originalPrice: "449.000",
      price: "339.000",
      description: "Ưu tiên giữ suất mỗi tuần cho người muốn duy trì đều",
      badge: "",
      ctaText: "Nhận tư vấn gói tuần"
    }
  ]
};
