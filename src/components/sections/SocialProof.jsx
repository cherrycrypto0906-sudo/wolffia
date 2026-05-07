import React, { useState, useEffect } from 'react';
import { CONFIG } from '../../config/landingConfig';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { FaUserPlus, FaBell, FaFire } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './SocialProof.css';

export const SocialProof = () => {
  const { t } = useTranslation();
  const [activePopup, setActivePopup] = useState(null);
  
  // State for dynamic numbers
  const [interested, setInterested] = useState(CONFIG.socialProof.totalInterested);
  const [inZalo, setInZalo] = useState(CONFIG.socialProof.totalInZalo);
  const [slots, setSlots] = useState(CONFIG.slotsRemaining);

  useEffect(() => {
    // Dynamic number increments
    const interestedInterval = setInterval(() => {
      setInterested(prev => prev + Math.floor(Math.random() * 3));
    }, 12000);
    
    const zaloInterval = setInterval(() => {
      setInZalo(prev => prev + Math.floor(Math.random() * 2));
    }, 18000);
    
    const slotsInterval = setInterval(() => {
      setSlots(prev => (prev > 3 ? prev - 1 : prev));
    }, 25000);
    
    return () => {
      clearInterval(interestedInterval);
      clearInterval(zaloInterval);
      clearInterval(slotsInterval);
    };
  }, []);

  useEffect(() => {
    // Luân phiên hiển thị popup live activity
    const activitiesRaw = t('socialProof.recentActivities', { returnObjects: true });
    const activities = Array.isArray(activitiesRaw) ? activitiesRaw : [];
    let index = 0;
    
    // Initial delay before showing first popup
    const startDelay = setTimeout(() => {
      showNextPopup();
    }, 5000);

    const showNextPopup = () => {
      // Pick a random activity instead of sequential for more natural feel
      const randomIndex = Math.floor(Math.random() * activities.length);
      setActivePopup(activities[randomIndex]);
      
      // Hide after 4 seconds
      setTimeout(() => {
        setActivePopup(null);
        
        // Show next after random interval between 6-12 seconds
        const nextDelay = 6000 + Math.random() * 6000;
        setTimeout(showNextPopup, nextDelay);
      }, 4000);
    };

    return () => clearTimeout(startDelay);
  }, [t]); // Add t to dependency array since it might change on language switch

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
              <div className="counter-number">{interested}</div>
              <div className="counter-label">{t('socialProof.stats.interested')}</div>
            </RevealOnScroll>

            <RevealOnScroll delay={200} className="counter-item">
              <div className="counter-icon alt"><FaBell /></div>
              <div className="counter-number">{inZalo}</div>
              <div className="counter-label">{t('socialProof.stats.inZalo')}</div>
            </RevealOnScroll>

            <RevealOnScroll delay={300} className="counter-item">
              <div className="counter-icon danger"><FaFire /></div>
              <div className="counter-number">{slots}</div>
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
