import React, { useState, useEffect } from 'react';
import { CONFIG } from '../../config/landingConfig';
import { Button } from '../UI/Button';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import './Hero.css';

export const Hero = () => {
  const [timeLeft, setTimeLeft] = useState(CONFIG.countdownMinutes * 60);
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const slideTimer = setInterval(() => {
      if (CONFIG.images.heroCarousel && CONFIG.images.heroCarousel.length > 0) {
        setCurrentHeroIdx(prev => (prev + 1) % CONFIG.images.heroCarousel.length);
      }
    }, 3500);

    return () => {
      clearInterval(timer);
      clearInterval(slideTimer);
    };
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section">
      <div className="container hero-container">
        
        <div className="hero-content">
          <RevealOnScroll delay={100}>
            <span className="hero-eyebrow">
              Cho những ngày muốn ăn tử tế hơn, nhưng không còn thời gian để cầu kỳ
            </span>
          </RevealOnScroll>
          
          <RevealOnScroll delay={200}>
            <h1 className="hero-headline">
              Muốn ăn tốt hơn, nhưng ngày nào cũng <span>quá bận</span>
            </h1>
          </RevealOnScroll>

          <RevealOnScroll delay={300}>
            <p className="hero-subheadline">
              Diệp Châu mang đến Wolffia tươi – một nguyên liệu xanh mới, nhỏ gọn, dễ dùng, dễ thêm vào các món quen thuộc để bữa ăn mỗi ngày tươi hơn, gọn hơn và đỡ áp lực hơn.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={400}>
            <p className="hero-supporting">
              Không cần thay đổi cả chế độ ăn. Chỉ cần một thứ đủ tiện để bạn thật sự muốn dùng lại trong những ngày bận rộn.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={500} className="hero-actions">
            <Button onClick={scrollToForm} className="hero-cta-main">
              Giữ chỗ trước hôm nay
            </Button>
            <a href={CONFIG.zaloLink} target="_blank" rel="noreferrer" className="btn btn-outline hero-cta-sub">
              Vào cộng đồng Zalo
            </a>
          </RevealOnScroll>

          <RevealOnScroll delay={600}>
            <div className="urgency-strip">
              <div className="urgency-pulse"></div>
              <div className="urgency-text">
                <span className="urgency-badge">Hàng tươi – mở suất giới hạn mỗi ngày</span>
                <strong>Hôm nay chỉ mở {CONFIG.limitedSlots} suất giữ chỗ</strong>
                <span className="urgency-remaining">Còn đúng {CONFIG.slotsRemaining} suất</span>
                <span className="urgency-timer">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        <div className="hero-visual">
          <RevealOnScroll delay={300} className="hero-image-wrapper">
             <img 
               key={currentHeroIdx}
               src={CONFIG.images.heroCarousel ? CONFIG.images.heroCarousel[currentHeroIdx] : CONFIG.images.heroFood} 
               alt="Món ăn xanh dinh dưỡng cùng Wolffia" 
               className="hero-image slide-animation" 
             />
             <div className="hero-floating-badge animate-pulse">
                🌱 Thay đổi cách ăn của bạn
             </div>
          </RevealOnScroll>
        </div>

      </div>
    </section>
  );
};
