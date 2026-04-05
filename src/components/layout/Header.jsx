import React from 'react';
import { CONFIG } from '../../config/landingConfig';
import { Button } from '../UI/Button';
import './Header.css';

export const Header = () => {
  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="header">
      <div className="container header-container">
        <a href="/" className="logo-link">
          <img src={CONFIG.images.logo} alt="Wolffia tươi Diệp Châu" className="logo-img" />
        </a>
        <div className="header-actions">
          <Button onClick={scrollToForm} className="header-cta">
            Giữ chỗ sớm
          </Button>
        </div>
      </div>
    </header>
  );
};
