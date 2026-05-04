import React from 'react';
import { CONFIG } from '../../config/landingConfig';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './SolutionSection.css';
import nutritionChartImg from '../../assets/wolffia_nutrition_v2.jpg';

export const SolutionSection = () => {
  const { t } = useTranslation();
  const benefitsRaw = t('solutionSection.benefits', { returnObjects: true });
  const benefits = Array.isArray(benefitsRaw) ? benefitsRaw : [];


  return (
    <section className="solution-section section-padding">
      <div className="container solution-container">
        <div className="solution-visual">
          <RevealOnScroll className="solution-image-container">
            <img 
              src={CONFIG.images.productBox} 
              alt="Hộp Wolffia tươi Diệp Châu" 
              className="solution-image" 
            />
            <div className="solution-badge">
              {t('solutionSection.badge')}
            </div>
          </RevealOnScroll>
        </div>
        
        <div className="solution-content">
          <RevealOnScroll>
            <h2>{t('solutionSection.headline')}</h2>
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <h3 className="solution-subheadline">
              {t('solutionSection.subheadline')}
            </h3>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <p className="solution-body">
              {t('solutionSection.body')}
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={300}>
            <ul className="solution-benefits">
              {benefits.map((benefit, index) => (
                <li key={index} className="benefit-chip">
                  <span className="benefit-icon"><FaCheckCircle /></span>
                  {benefit}
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>
      </div>
      
      <div className="container mt-5">
        <RevealOnScroll delay={400} className="text-center">
          <h3 className="mb-4" style={{ color: 'var(--primary-dark)' }}>{t('solutionSection.nutritionTitle')}</h3>
          <div className="nutrition-chart-container">
            <img src={nutritionChartImg} alt="Dinh dưỡng Wolffia" className="nutrition-chart-img" />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
