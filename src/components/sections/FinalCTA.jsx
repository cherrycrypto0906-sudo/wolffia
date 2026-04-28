import React, { useState, useEffect } from 'react';
import { CONFIG } from '../../config/landingConfig';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { Button } from '../UI/Button';
import './FinalCTA.css';

export const FinalCTA = () => {
  const [timeLeft, setTimeLeft] = useState(CONFIG.countdownMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const scrollToPayment = () => {
    window.location.href = '/thanhtoan';
  };

  const scrollToSurvey = () => {
    document.getElementById('gift-survey')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="final-cta-section section-padding">
      <div className="container">
        
        <RevealOnScroll className="final-cta-content">
          <div className="final-cta-text">
            <h2>Không cần ăn hoàn hảo. <br className="desktop-only"/>Chỉ cần bắt đầu bằng một cách dễ hơn.</h2>
            <p>
              Nếu bạn đang muốn ăn tốt hơn nhưng không có nhiều thời gian, hãy giữ chỗ Wolffia tươi từ Diệp Châu ngay hôm nay.
            </p>
          </div>

          <div className="urgency-strip dark-mode">
            <div className="urgency-text">
              <strong>Còn đúng {CONFIG.slotsRemaining} suất giữ chỗ</strong>
            </div>
            <span className="urgency-timer">{formatTime(timeLeft)}</span>
          </div>

          <div className="final-actions">
            <Button onClick={scrollToPayment} className="btn-final-primary">
              Đặt hàng ngay
            </Button>
            <button type="button" onClick={scrollToSurvey} className="btn btn-outline btn-final-sub">
              Nhận quà miễn phí
            </button>
          </div>
        </RevealOnScroll>

        <div className="footer-bottom">
          <div className="footer-logo">
            <img src={CONFIG.images.logo} alt="Wolffia tươi Diệp Châu" />
          </div>
          <p>© {new Date().getFullYear()} Diệp Châu. Cây Nhỏ Nhất - Siêu Dưỡng Chất.</p>
        </div>

      </div>
    </footer>
  );
};
