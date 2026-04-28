import React from 'react';
import { CONFIG } from '../../config/landingConfig';
import { Button } from '../UI/Button';
import './Header.css';

export const Header = () => {
  const scrollToPayment = () => {
    window.location.href = '/thanhtoan';
  };

  return (
    <header className="header">
      <div className="container header-container">
        <a href="/" className="logo-link">
          <img src={CONFIG.images.logo} alt="Wolffia tươi Diệp Châu" className="logo-img" />
        </a>
        <div className="header-actions">
          <Button onClick={scrollToPayment} className="header-cta">
            Đặt hàng ngay
          </Button>
        </div>
      </div>
    </header>
  );
};
