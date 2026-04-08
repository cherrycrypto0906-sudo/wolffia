import React from 'react';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { Button } from '../UI/Button';
import { FaGift } from 'react-icons/fa';
import './Bonus.css';

export const Bonus = () => {
  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const benefitsList = [
    "Ưu tiên xác nhận khi mở đơn",
    "Nhận hướng dẫn dùng Wolffia dễ nhất",
    "Có gợi ý món nhanh, đơn giản",
    "Được mời vào cộng đồng Zalo",
    "Ưu tiên hơn khi hàng ít"
  ];

  return (
    <section className="bonus-section section-padding">
      <div className="container">
        <RevealOnScroll className="bonus-container">
          <div className="bonus-content">
            <div className="bonus-icon"><FaGift /></div>
            <h2>Giữ chỗ sớm để đỡ phải canh từng đợt mở suất</h2>
            <ul className="bonus-list">
              {benefitsList.map((item, index) => (
                <li key={index}>
                  <span className="bonus-check">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Button onClick={scrollToForm} className="bonus-cta">
              Nhận quà tặng
            </Button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
