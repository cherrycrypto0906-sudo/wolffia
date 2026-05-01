import React, { useState, useEffect } from 'react';
import { CONFIG } from '../../config/landingConfig';
import { Button } from '../UI/Button';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { useTranslation } from 'react-i18next';
import './Hero.css';

export const Hero = () => {
  const { t } = useTranslation();
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

  const scrollToPayment = () => {
    window.location.href = '/thanhtoan';
  };

  const scrollToSurvey = () => {
    document.getElementById('gift-survey')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section">
      <div className="container hero-container">
        
        <div className="hero-content">
          <RevealOnScroll delay={100}>
            <span className="hero-eyebrow">
              {t('hero.eyebrow')}
            </span>
          </RevealOnScroll>
          
          <RevealOnScroll delay={200}>
            <h1 className="hero-headline">
              {t('hero.headlinePrefix')} <span>{t('hero.headlineHighlight')}</span>
            </h1>
          </RevealOnScroll>

          <RevealOnScroll delay={300}>
            <p className="hero-subheadline">
              {t('hero.subheadline')}
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={400}>
            <p className="hero-supporting">
              {t('hero.supporting')}
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={500} className="hero-actions">
            <Button onClick={scrollToPayment} className="hero-cta-main">
              {t('hero.ctaMain')}
            </Button>
            <button type="button" onClick={scrollToSurvey} className="btn btn-outline hero-cta-sub">
              {t('hero.ctaSub')}
            </button>
          </RevealOnScroll>

          <RevealOnScroll delay={600}>
            <div className="urgency-strip">
              <div className="urgency-pulse"></div>
              <div className="urgency-text">
                <span className="urgency-badge">{t('hero.urgencyBadge')}</span>
                <strong>{t('hero.urgencySlots', { slots: CONFIG.limitedSlots })}</strong>
                <span className="urgency-remaining">{t('hero.urgencyRemaining', { remaining: CONFIG.slotsRemaining })}</span>
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
               alt="Wolffia" 
               className="hero-image slide-animation" 
             />
             <div className="hero-floating-badge animate-pulse">
                {t('hero.floatingBadge')}
             </div>
          </RevealOnScroll>
        </div>

      </div>
    </section>
  );
};
