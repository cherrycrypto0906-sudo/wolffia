import React, { useState } from 'react';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './FAQ.css';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Cái này là gì vậy em?",
      a: "Dạ đây là Wolffia Diệp Châu chị nha, một loại đạm xanh được tuyển chọn, nuôi trong nhà màng công nghệ cao với nước lọc tinh khiết và dinh dưỡng hữu cơ. Bên em làm theo hướng sạch, khép kín nên chị có thể dùng rất yên tâm ạ."
    },
    {
      q: "Có cần rửa lại hay nấu chín không?",
      a: "Dạ không cần ạ. Mở hộp là rắc trực tiếp vào cháo, sinh tố hoặc salad ăn ngay. Ăn sống là cách tốt nhất để giữ 100% protein và vitamin B12 quý giá trong Wolffia."
    },
    {
      q: "Vị nó có đắng hay nồng mùi cỏ không?",
      a: "Hoàn toàn không chị nhé. Vị nó thanh nhẹ như nước mát, kết cấu giòn tan li ti như trứng cá. Chị rắc vào món gì nó sẽ mang hương vị của món đó, cực kỳ dễ ăn cho cả bé nhỏ."
    },
    {
      q: "Sản phẩm này ăn có tanh hay hăng mùi không?",
      a: "Không có luôn chị ạ. Vì bên em không vớt từ ao tự nhiên mà nuôi trong hệ thống nhà màng khép kín với nước sạch. Nên ăn rất thanh, không hăng, không tanh, không có mùi bùn đâu chị."
    },
    {
      q: "Trẻ nhỏ bắt đầu ăn dặm dùng được chưa?",
      a: "Rất lý tưởng. Hạt siêu nhỏ, mềm, không gây hóc. Mẹ chỉ cần rắc 1 muỗng cà phê vào bát cháo vừa múc ra chén, khuấy đều là bé đã có thêm chất xơ và đạm thực vật."
    },
    {
      q: "Nên bắt đầu với gói nào?",
      a: "Nếu chị mới thử, cứ bắt đầu bằng hộp dùng thử 100g giá 49.000đ là nhẹ nhất. Nếu muốn tối ưu hơn tiền hàng và tiền ship thì lấy Combo 3 hoặc Combo 5 sẽ lời hơn nhiều."
    },
    {
      q: "Có giao nhanh trong ngày không?",
      a: "Có ạ. Bên em hỗ trợ giao hỏa tốc tại TP.HCM. Hàng được vớt tươi, đóng hộp và giao lạnh ngay trong ngày để giữ độ giòn."
    },
    {
      q: "Bảo quản thế nào cho đúng?",
      a: "Nhận hàng xong chị cho ngay vào ngăn mát tủ lạnh ở 4-8°C. Dùng ngon nhất trong 5-7 ngày. Khi lấy sản phẩm nhớ dùng muỗng sạch, đậy kín nắp và không để ngăn đá."
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
