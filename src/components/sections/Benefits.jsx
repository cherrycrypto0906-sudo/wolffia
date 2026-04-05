import React from 'react';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { FaCheck } from 'react-icons/fa';
import './Benefits.css';

export const Benefits = () => {
  const benefitCards = [
    "Dễ dùng, không rườm rà",
    "Giúp bữa ăn đỡ nhàm chán",
    "Nhìn tươi, đẹp, có cảm hứng hơn",
    "Hợp với mẹ bỉm và người bận rộn",
    "Không cần nấu quá cầu kỳ",
    "Mở đơn giới hạn để ưu tiên độ tươi"
  ];

  return (
    <section className="benefits-section section-padding">
      <div className="container">
        
        <RevealOnScroll className="text-center">
          <h2 className="benefits-headline">
            Vì sao Wolffia hợp với những người muốn ăn tốt hơn nhưng không có nhiều thời gian?
          </h2>
        </RevealOnScroll>

        <div className="benefits-grid">
          {benefitCards.map((text, index) => (
            <RevealOnScroll key={index} delay={100 + index * 50} className="benefits-card">
              <div className="benefits-card-icon"><FaCheck /></div>
              <span>{text}</span>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
};
