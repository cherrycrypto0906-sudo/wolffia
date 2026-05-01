import React from 'react';
import { CONFIG } from '../../config/landingConfig';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { FaClock, FaLeaf, FaDumbbell } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './PainSection.css';

export const PainSection = () => {
  const { t } = useTranslation();
  const painCards = [
    {
      icon: <FaClock size={28} />,
      title: t('painSection.cards.0.title'),
      text: t('painSection.cards.0.text')
    },
    {
      icon: <FaLeaf size={28} />,
      title: t('painSection.cards.1.title'),
      text: t('painSection.cards.1.text')
    },
    {
      icon: <FaDumbbell size={28} />,
      title: t('painSection.cards.2.title'),
      text: t('painSection.cards.2.text')
    }
  ];

  return (
    <section className="pain-section section-padding">
      <div className="container">
        
        <div className="pain-header text-center">
          <RevealOnScroll>
            <h2 dangerouslySetInnerHTML={{ __html: t('painSection.headline') }} />
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <p className="pain-subheadline">
              {t('painSection.subheadline')}
            </p>
          </RevealOnScroll>
        </div>

        <div className="pain-split">
          <RevealOnScroll className="pain-text-column">
            <p dangerouslySetInnerHTML={{ __html: t('painSection.splitText1') }} />
            <p dangerouslySetInnerHTML={{ __html: t('painSection.splitText2') }} />
            <div className="pain-highlight" dangerouslySetInnerHTML={{ __html: t('painSection.highlight') }} />
          </RevealOnScroll>
          
          <RevealOnScroll className="pain-image-column" delay={200}>
            <img 
              src={CONFIG.images.lifestyle} 
              alt="Lối sống bận rộn" 
              style={{ width: '100%', height: '100%', borderRadius: 'var(--rounded-lg)', boxShadow: 'var(--shadow-md)', objectFit: 'cover', aspectRatio: '4/3' }} 
            />
          </RevealOnScroll>
        </div>

        <div className="pain-cards">
          {painCards.map((card, index) => (
            <RevealOnScroll key={index} delay={300 + index * 100} className="pain-card">
              <div className="pain-card-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
};
