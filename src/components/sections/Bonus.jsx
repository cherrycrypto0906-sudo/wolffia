import React from 'react';
import { useTranslation } from 'react-i18next';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { Button } from '../UI/Button';
import { FaGift } from 'react-icons/fa';
import './Bonus.css';

export const Bonus = () => {
  const { t } = useTranslation();

  const scrollToSurvey = () => {
    document.getElementById('gift-survey')?.scrollIntoView({ behavior: 'smooth' });
  };

  const benefitsData = t('bonus.benefits', { returnObjects: true });
  const benefitsList = Array.isArray(benefitsData) ? benefitsData : [];

  return (
    <section className="bonus-section section-padding">
      <div className="container">
        <RevealOnScroll className="bonus-container">
          <div className="bonus-content">
            <div className="bonus-icon"><FaGift /></div>
            <h2>{t('bonus.headline')}</h2>
            <ul className="bonus-list">
              {benefitsList.map((item, index) => (
                <li key={index}>
                  <span className="bonus-check">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Button onClick={scrollToSurvey} className="bonus-cta">
              {t('bonus.cta')}
            </Button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
