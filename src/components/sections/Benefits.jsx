import React from 'react';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { FaCheck } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './Benefits.css';

export const Benefits = () => {
  const { t } = useTranslation();
  const benefitCardsRaw = t('benefitsSection.cards', { returnObjects: true });
  const benefitCards = Array.isArray(benefitCardsRaw) ? benefitCardsRaw : [];


  return (
    <section className="benefits-section section-padding">
      <div className="container">
        
        <RevealOnScroll className="text-center">
          <h2 className="benefits-headline">
            {t('benefitsSection.headline')}
          </h2>
        </RevealOnScroll>

        <div className="benefits-grid">
          {benefitCards.map((text, index) => (
            <RevealOnScroll key={index} delay={100 + index * 50} className="benefits-card">
              <div className="benefits-card-icon"><FaCheck /></div>
              <span>{text}</span>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
};
