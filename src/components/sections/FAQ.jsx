import React, { useState } from 'react';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './FAQ.css';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Wolffia là gì?",
      a: "Wolffia là một loại thực vật nước siêu nhỏ, hay còn gọi là bèo tấm. Nó có hàm lượng đạm thực vật, chất xơ và nhiều vi chất tốt cho sức khoẻ, thường được dùng để thêm vào các bữa ăn hàng ngày."
    },
    {
      q: "Wolffia có dễ ăn không?",
      a: "Rất dễ ăn. Wolffia tươi gần như không có mùi vị mạnh, chỉ có độ giòn nhẹ và thanh mát. Bạn có thể thêm vào bất kỳ món ăn nào mà không làm đổi vị gốc của món đó."
    },
    {
      q: "Người mới nên chọn gói nào?",
      a: "Nếu bạn mới thử lần đầu, hãy chọn Gói Làm Quen (80g) hoặc Gói 3 Bữa Xanh (150g). Đây là lượng vừa đủ để bạn thử thêm vào vài món quen thuộc."
    },
    {
      q: "Tại sao cần đặt trước?",
      a: "Wolffia tươi cần được thu hoạch và bảo quản đúng cách để giữ được độ giòn và dưỡng chất tốt nhất. Việc đặt trước giúp Diệp Châu chuẩn bị lượng hàng tươi mới nhất cho bạn thay vì tồn kho."
    },
    {
      q: "Có thể vào Zalo trước rồi mua sau không?",
      a: "Hoàn toàn được. Cộng đồng Zalo là nơi ưu tiên cập nhật lịch hàng mới, chia sẻ cách dùng. Bạn cứ vào tham khảo, khi nào thấy tiện thì đặt mua sau cũng không sao."
    },
    {
      q: "Sau khi điền form thì khi nào được liên hệ?",
      a: "Trong vòng 4–12 tiếng giờ hành chính, Diệp Châu sẽ liên hệ (qua Zalo hoặc cuộc gọi) để xác nhận số lượng, thời gian giao phù hợp nhất với bạn."
    }
  ];

  return (
    <section className="faq-section section-padding">
      <div className="container faq-container">
        <RevealOnScroll className="text-center">
          <h2 className="faq-headline">Có thể bạn cũng đang thắc mắc</h2>
        </RevealOnScroll>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <RevealOnScroll key={index} delay={100} className="faq-item">
              <button 
                className={`faq-question ${openIndex === index ? 'active' : ''}`}
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <span>{faq.q}</span>
                <span className="faq-icon">
                  {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </button>
              <div className={`faq-answer ${openIndex === index ? 'show' : ''}`}>
                <div className="faq-answer-inner">
                  {faq.a}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};
