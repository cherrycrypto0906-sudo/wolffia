import React from 'react';
import { CONFIG } from '../../config/landingConfig';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { Button } from '../UI/Button';
import { useTranslation } from 'react-i18next';
import './Pricing.css';

export const Pricing = () => {
  const { t } = useTranslation();
  const scrollToPayment = (packageId) => {
    window.sessionStorage.setItem('selectedPackageId', packageId);
    window.location.href = '/thanhtoan';
  };

  return (
    <section className="pricing-section section-padding">
      <div className="container">
        
        <div className="pricing-header text-center">
          <RevealOnScroll>
            <h2>{t('pricingSection.headline')}</h2>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <p className="pricing-subheadline">
              {t('pricingSection.subheadline')}
            </p>
          </RevealOnScroll>
        </div>

        <div className="pricing-grid">
          {CONFIG.packages.map((pkg, index) => (
            <RevealOnScroll key={index} delay={200 + index * 100} className={`pricing-card ${pkg.badge ? 'highlighted' : ''}`}>
              {pkg.badge && <div className="pricing-badge">{t(`config.packages.${pkg.id}.badge`)}</div>}
              <div className="pricing-content">
                <h3 className="pkg-name">{t(`config.packages.${pkg.id}.name`)}</h3>
                <div className="pkg-weight">{t(`config.packages.${pkg.id}.weight`)}</div>
                
                <div className="pkg-price">
                  {pkg.originalPrice && <span className="original-price"><del>{pkg.originalPrice}đ</del></span>}
                  <div className="pkg-price-row" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <span className="current-price">{pkg.price}</span>
                    <small className="currency-unit">đ</small>
                  </div>
                </div>
                <p className="pkg-desc">{t(`config.packages.${pkg.id}.description`)}</p>
              </div>
              <div className="pricing-footer">
                <Button 
                  variant={pkg.badge ? 'primary' : 'outline'} 
                  className="w-100" 
                  onClick={() => scrollToPayment(pkg.id)}
                >
                  {t(`config.packages.${pkg.id}.ctaText`)}
                </Button>
                {pkg.badge && (
                  <div className="text-center mt-2" style={{ fontSize: '0.85rem', color: 'var(--primary)'}}>
                    <i>{t('pricingSection.qrNote')}</i>
                  </div>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={400} className="pricing-note text-center">
          <p dangerouslySetInnerHTML={{ __html: t('pricingSection.deliveryNote') }} />
          <div className="scarcity-alert">
            🚨 <strong>{t('config.scarcity')}</strong>
          </div>
          <div className="guarantee-badge mt-3" style={{ color: "var(--primary-dark)", fontWeight: "500" }}>
            🛡️ {t('config.guarantee')}
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
};
