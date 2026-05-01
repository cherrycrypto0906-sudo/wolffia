import React, { useState, useEffect } from 'react';
import { CONFIG } from '../../config/landingConfig';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { FaUserPlus, FaBell, FaFire } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './SocialProof.css';

export const SocialProof = () => {
  const { t } = useTranslation();
  const [activePopup, setActivePopup] = useState(null);

  useEffect(() => {
    // Luân phiên hiển thị popup live activity
    const activities = t('config.socialProof.recentActivities', { returnObjects: true }) || [];
    let index = 0;
    
    // Initial delay before showing first popup
    const startDelay = setTimeout(() => {
      showNextPopup();
    }, 5000);

    const showNextPopup = () => {
      setActivePopup(activities[index]);
      
      // Hide after 4 seconds
      setTimeout(() => {
        setActivePopup(null);
        
        // Show next after 8 seconds
        index = (index + 1) % activities.length;
        setTimeout(showNextPopup, 8000);
      }, 4000);
    };

    return () => clearTimeout(startDelay);
  }, []);

  return (
    <>
      <section className="social-proof-section section-padding">
        <div className="container">
          
          <RevealOnScroll className="text-center">
            <h2 className="proof-headline">
              {t('socialProof.headline')}
            </h2>
          </RevealOnScroll>

          <div className="counters-container">
            <RevealOnScroll delay={100} className="counter-item">
              <div className="counter-icon"><FaUserPlus /></div>
              <div className="counter-number">{CONFIG.socialProof.totalInterested}</div>
              <div className="counter-label">{t('socialProof.stats.interested')}</div>
            </RevealOnScroll>

            <RevealOnScroll delay={200} className="counter-item">
              <div className="counter-icon alt"><FaBell /></div>
              <div className="counter-number">{CONFIG.socialProof.totalInZalo}</div>
              <div className="counter-label">{t('socialProof.stats.inZalo')}</div>
            </RevealOnScroll>

            <RevealOnScroll delay={300} className="counter-item">
              <div className="counter-icon danger"><FaFire /></div>
              <div className="counter-number">{CONFIG.slotsRemaining}</div>
              <div className="counter-label">{t('socialProof.stats.slots')}</div>
            </RevealOnScroll>
          </div>

        </div>
      </section>

      {/* Floating Live Activity Popup */}
      <div className={`live-activity-popup ${activePopup ? 'visible' : ''}`}>
        <div className="popup-icon">🔔</div>
        <div className="popup-text">{activePopup}</div>
      </div>
    </>
  );
};
