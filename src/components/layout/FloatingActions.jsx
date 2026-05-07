import React, { useState, useEffect } from 'react';
import { CONFIG } from '../../config/landingConfig';
import { useTranslation } from 'react-i18next';
import './FloatingActions.css';

export const FloatingActions = () => {
  const { t } = useTranslation();
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after hero section (approx 600px)
      if (window.scrollY > 600) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToPayment = () => {
    window.location.href = '/thanhtoan';
  };

  return (
    <>
      <a href={CONFIG.zaloLink} target="_blank" rel="noreferrer" className="floating-zalo" aria-label="Chat Zalo">
        <img src="/zalo-mark.svg" alt="Zalo" className="zalo-icon" />
      </a>

      <div className={`sticky-cta ${showSticky ? 'visible' : ''}`}>
        <div className="sticky-content">
          <div className="sticky-text">
            <strong>{t('floatingActions.orderNow')}</strong>
            <span>{t('floatingActions.slotsRemaining', { slots: CONFIG.slotsRemaining })}</span>
          </div>
          <button onClick={scrollToPayment} className="btn btn-primary sticky-btn">
            {t('floatingActions.orderNow')}
          </button>
        </div>
      </div>
    </>
  );
};
