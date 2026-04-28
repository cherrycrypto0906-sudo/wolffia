import React from 'react';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { Button } from '../UI/Button';
import { FaGift } from 'react-icons/fa';
import './Bonus.css';

export const Bonus = () => {
  const scrollToSurvey = () => {
    document.getElementById('gift-survey')?.scrollIntoView({ behavior: 'smooth' });
  };

  const benefitsList = [
    "Nhận cookbook món nhanh với Wolffia",
    "Có thêm ý tưởng bữa sáng, sinh tố, salad",
    "Dễ hình dung cách dùng trước khi mua",
    "Phù hợp cho người mới chưa biết bắt đầu sao",
    "Điền nhanh trong 1 phút là xong"
  ];

  return (
    <section className="bonus-section section-padding">
      <div className="container">
        <RevealOnScroll className="bonus-container">
          <div className="bonus-content">
            <div className="bonus-icon"><FaGift /></div>
            <h2>Muốn xem thêm ý tưởng món ăn trước thì nhận quà miễn phí</h2>
            <ul className="bonus-list">
              {benefitsList.map((item, index) => (
                <li key={index}>
                  <span className="bonus-check">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Button onClick={scrollToSurvey} className="bonus-cta">
              Đi đến khảo sát nhận quà
            </Button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
