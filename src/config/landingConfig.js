export const CONFIG = {
  // v1.0.1 - Final Visual Fixes
  // === TRẠNG THÁI & THỜI GIAN ===
  countdownMinutes: 45, // Đếm ngược bao nhiêu phút kể từ lúc mở web
  limitedSlots: 30, // Khai báo số suất trống hiện tại cho hôm nay
  slotsRemaining: 12, // Số suất còn lại hiển thị trên UI

  // === LINK LIÊN KẾT ===
  zaloLink: "https://zalo.me/g/dwrlrtrnnnivi1xhmzbu", // Link tham gia cộng đồng Zalo
  formDestination: "https://script.google.com/macros/s/AKfycbxWU1tFOdn2MYz9rVhdexhymCYnGmCUXQNRl7bTIHi4CKpsKzVSkuElGij1yXBJMKYE/exec", // Google Apps Script → Google Sheets
  sheetUrl: "https://docs.google.com/spreadsheets/d/12F6jLbSPf6KJUQPIXxQ6ar77NTtJqDNHulNVVj1F9Yg/edit?gid=0#gid=0", // Sheet lưu lead + ảnh xác nhận chuyển khoản

  // === THUẬT TOÁN SOCIAL PROOF (Ảo) ===
  socialProof: {
    totalInterested: 127,
    totalInZalo: 43,
      recentActivities: [
      "Chị Linh ở Thủ Đức vừa chốt hộp dùng thử 100g",
      "Một khách hàng ở Quận 7 vừa để lại thông tin nhận quà",
      "Chị Mai vừa đặt Combo 3 hộp giao lạnh trong ngày",
      "Khách tại Bình Thạnh vừa chọn Combo 5 hộp"
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
     qrPayment: "/assets/qr_payment_techcombank.jpg"
  },




  // === THIẾT LẬP THANH TOÁN (VIETQR) ===
  sepayConfig: {
    bankId: "ICB",
    bankName: "VietinBank",
    accountNumber: "105883279786",
    accountName: "NGUYEN NGOC BAO CHAU",
    transferPrefix: "SEVQR"
  },



  // === TEXT HIGHLIGHTS ===
  guarantee: "100% tươi mới thu hoạch trong ngày - Hoàn tiền nếu không tươi",
  scarcity: "Chỉ thu hoạch giới hạn 50 suất/ngày để đảm bảo độ tươi ngon nhất",

  // === REVIEWS / ZALO CHAT ===
  chatReviews: [
    {
      name: "Lan Anh",
      avatar: "https://i.pravatar.cc/100?img=5",
      time: "Hôm nay 09:12",
      messages: [
        "Cứ tưởng con sẽ nhè ra vì màu xanh, ai dè hạt nhỏ tí bé tưởng kẹo nên xúc ăn ngon lành. Trộm vía dạo này con đi vệ sinh đều hơn, mẹ đỡ phải ép ăn rau mỗi bữa."
      ],
      isCustomer: true
    },
    {
      name: "Diệp Châu Wolffia",
      avatar: "/logo.png",
      time: "Hôm nay 09:15",
      messages: [
        "Dạ em cảm ơn chị ạ, hạt Wolffia nhỏ và giòn nhẹ nên nhiều bé đón nhận dễ hơn rau lá. Nhà mình cứ rắc vào món quen là bé ăn tự nhiên lắm ạ."
      ],
      isCustomer: false
    },
    {
      name: "Anh Hoàng",
      avatar: "https://i.pravatar.cc/100?img=11",
      time: "Hôm nay 12:30",
      messages: [
        "Tìm nguồn đạm thực vật thay ức gà cho đỡ ngán thì gặp cái này. Đổ 1 hộp vào máy xay chung với whey, uống nhanh gọn mà không bị đầy bụng như ăn đậu."
      ],
      isCustomer: true
    },
    {
      name: "Diệp Châu Wolffia",
      avatar: "/logo.png",
      time: "Hôm nay 12:45",
      messages: [
        "Dạ đúng rồi anh, nhiều khách tập luyện cũng thích vì thêm được đạm xanh mà vẫn nhẹ bụng, không cần chuẩn bị cầu kỳ như bữa phụ thông thường ạ."
      ],
      isCustomer: false
    }
  ],
  // === GÓI SẢN PHẨM & GIÁ ===
  packages: [
    {
      id: "gia-dung-thu",
      name: "Gói dùng thử",
      weight: "100g / 1 hộp",
      originalPrice: "85.000",
      price: "49.000",
      description: "Ưu đãi ra mắt mẻ mới cho người muốn thử độ tươi và độ dễ ăn trước",
      badge: "Dễ thử nhất",
      ctaText: "Đặt hàng ngay",
      transferCode: "DUNGTHU"
    },
    {
      id: "combo-3-hop",
      name: "Combo 3 hộp",
      weight: "3 x 100g",
      originalPrice: "147.000",
      price: "135.000",
      description: "Phù hợp cho gia đình 3-4 người ăn trong 2-3 ngày",
      badge: "Bán chạy nhất",
      ctaText: "Đặt hàng ngay",
      transferCode: "COMBO3"
    },
    {
      id: "combo-5-hop",
      name: "Combo 5 hộp",
      weight: "5 x 100g",
      originalPrice: "245.000",
      price: "210.000",
      description: "Đủ dùng cho 1 tuần eat-clean, tặng kèm cẩm nang Recipe",
      badge: "Tặng recipe",
      ctaText: "Đặt hàng ngay",
      transferCode: "COMBO5"
    }
  ]
};
