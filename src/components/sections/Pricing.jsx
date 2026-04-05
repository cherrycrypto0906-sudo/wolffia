import React from 'react';
import { CONFIG } from '../../config/landingConfig';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { Button } from '../UI/Button';
import './Pricing.css';

export const Pricing = () => {
  const scrollToForm = (packageId) => {
    // Optionally update a state variable here to pre-select, but simple scroll works for now
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
    // Attempt to set a custom attribute or dispatch event for the form if we wanted to auto-select
    window.dispatchEvent(new CustomEvent('selectPackage', { detail: packageId }));
  };

  return (
    <section className="pricing-section section-padding">
      <div className="container">
        
        <div className="pricing-header text-center">
          <RevealOnScroll>
            <h2>Chọn gói phù hợp với nhịp sống của bạn</h2>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <p className="pricing-subheadline">
              Từ gói thử nhỏ đến gói dùng đều trong tuần, Diệp Châu có lựa chọn để bạn bắt đầu theo cách nhẹ nhàng nhất.
            </p>
          </RevealOnScroll>
        </div>

        <div className="pricing-grid">
          {CONFIG.packages.map((pkg, index) => (
            <RevealOnScroll key={index} delay={200 + index * 100} className={`pricing-card ${pkg.badge ? 'highlighted' : ''}`}>
              {pkg.badge && <div className="pricing-badge">{pkg.badge}</div>}
              <div className="pricing-content">
                <h3 className="pkg-name">{pkg.name}</h3>
                <div className="pkg-weight">{pkg.weight}</div>
                <div className="pkg-price">
                  {pkg.originalPrice && <span className="original-price"><del>{pkg.originalPrice}đ</del></span>}
                  <div className="pkg-price-row" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <span className="current-price">{pkg.price}</span>
                    <small className="currency-unit">đ</small>
                  </div>
                </div>
                <p className="pkg-desc">{pkg.description}</p>
              </div>
              <div className="pricing-footer">
                <Button 
                  variant={pkg.badge ? 'primary' : 'outline'} 
                  className="w-100" 
                  onClick={() => scrollToForm(pkg.id)}
                >
                  {pkg.ctaText}
                </Button>
                {pkg.badge && (
                  <div className="text-center mt-2" style={{ fontSize: '0.85rem', color: 'var(--primary)'}}>
                    <i>* Áp dụng giá ưu đãi khi cọc/giữ chỗ</i>
                  </div>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={400} className="pricing-note text-center">
          <p>
            Bạn có thể giữ chỗ miễn phí hoặc đặt cọc <strong>29.000đ</strong> để ưu tiên chắc suất.<br/>
            Khoản cọc sẽ được trừ vào đơn hàng và <strong>đảm bảo bạn được hưởng mức giá ưu đãi trên</strong>.
          </p>
          <div className="scarcity-alert">
            🚨 <strong>{CONFIG.scarcity}</strong>
          </div>
          <div className="guarantee-badge mt-3" style={{ color: "var(--primary-dark)", fontWeight: "500" }}>
            🛡️ {CONFIG.guarantee}
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
};
