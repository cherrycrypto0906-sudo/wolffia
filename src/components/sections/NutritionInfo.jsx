import React from 'react';
import { useTranslation } from 'react-i18next';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { FaSeedling, FaShieldAlt, FaHeartbeat } from 'react-icons/fa';
import './NutritionInfo.css';

export const NutritionInfo = () => {
  const { t } = useTranslation();

  const cardsData = t('nutritionInfo.cards', { returnObjects: true });
  const cardsArray = Array.isArray(cardsData) ? cardsData : [];

  const infoCards = cardsArray.map((text, index) => {
    let icon = null;
    if (index === 0) icon = <FaSeedling size={24} />;
    else if (index === 1) icon = <FaShieldAlt size={24} />;
    else if (index === 2) icon = <FaHeartbeat size={24} />;
    return { icon, text };
  });

  return (
    <section className="nutrition-section section-padding">
      <div className="container">
        
        <div className="nutrition-header text-center">
          <RevealOnScroll>
            <h2>{t('nutritionInfo.headline')}</h2>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <p className="nutrition-subheadline">
              {t('nutritionInfo.subheadline')}
            </p>
          </RevealOnScroll>
        </div>

        <div className="nutrition-body">
          <RevealOnScroll delay={200} className="nutrition-text-block">
            <p>
              {t('nutritionInfo.body')}
            </p>
            <div className="nutrition-disclaimer" dangerouslySetInnerHTML={{ __html: t('nutritionInfo.disclaimer') }}>
            </div>
          </RevealOnScroll>
        </div>

        <div className="nutrition-grid">
          {infoCards.map((card, index) => (
            <RevealOnScroll key={index} delay={300 + index * 50} className={`nutrition-card ${card.icon ? 'has-icon' : ''}`}>
              {card.icon && <div className="card-icon">{card.icon}</div>}
              <span>{card.text}</span>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
};
