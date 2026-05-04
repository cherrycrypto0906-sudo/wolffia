import React from 'react';
import { useTranslation } from 'react-i18next';
import { CONFIG } from '../../config/landingConfig';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { Button } from '../UI/Button';
import { FaComments } from 'react-icons/fa';

export const ZaloCommunity = () => {
  const { t } = useTranslation();
  return (
    <section className="zalo-section section-padding" style={{ backgroundColor: 'white' }}>
      <div className="container" style={{ maxWidth: '700px', textAlign: 'center' }}>
        <RevealOnScroll>
          <div style={{ color: '#0068FF', fontSize: '3rem', marginBottom: '20px' }}>
            <FaComments />
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '16px' }}>
            {t('zaloCommunity.headline')}
          </h2>
        </RevealOnScroll>
        
        <RevealOnScroll delay={100}>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '32px' }}>
            {t('zaloCommunity.subheadline')}
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={200}>
          <Button 
            onClick={() => window.open(CONFIG.zaloLink, '_blank')}
            variant="outline"
            style={{ 
              borderColor: '#0068FF', 
              color: '#0068FF', 
              fontSize: '1.1rem',
              padding: '14px 32px'
            }}
          >
            {t('zaloCommunity.cta')}
          </Button>
        </RevealOnScroll>
      </div>
    </section>
  );
};
