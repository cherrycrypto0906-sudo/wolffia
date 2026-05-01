import React, { useState } from 'react';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './FAQ.css';

export const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(0);

  // We can derive faqs from the translation keys or use config. 
  // Wait, I will use `t('config.faq', { returnObjects: true })`
  const faqs = t('config.faq', { returnObjects: true }) || [];

  return (
    <section className="faq-section section-padding">
      <div className="container faq-container">
        <RevealOnScroll className="text-center">
          <h2 className="faq-headline">{t('faqSection.headline')}</h2>
        </RevealOnScroll>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <RevealOnScroll key={index} delay={100} className="faq-item">
              <button 
                className={`faq-question ${openIndex === index ? 'active' : ''}`}
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <span>{faq.q}</span>
                <span className="faq-icon">
                  {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </button>
              <div className={`faq-answer ${openIndex === index ? 'show' : ''}`}>
                <div className="faq-answer-inner">
                  {faq.a}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};
