import React, { useState, useEffect } from 'react';
import { CONFIG } from '../../config/landingConfig';
import { FaCommentDots } from 'react-icons/fa';
import './FloatingActions.css';

export const FloatingActions = () => {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after hero section (approx 600px)
      if (window.scrollY > 600) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <a href={CONFIG.zaloLink} target="_blank" rel="noreferrer" className="floating-zalo" aria-label="Chat Zalo">
        <FaCommentDots size={24} />
      </a>

      <div className={`sticky-cta ${showSticky ? 'visible' : ''}`}>
        <div className="sticky-content">
          <div className="sticky-text">
            <strong>Giữ chỗ hôm nay</strong>
            <span>Chỉ còn {CONFIG.slotsRemaining} suất</span>
          </div>
          <button onClick={scrollToForm} className="btn btn-primary sticky-btn">
            Giữ chỗ
          </button>
        </div>
      </div>
    </>
  );
};
