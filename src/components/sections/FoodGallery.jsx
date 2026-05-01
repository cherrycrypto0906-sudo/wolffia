import React, { useRef, useState, useEffect } from 'react';
import { CONFIG } from '../../config/landingConfig';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './FoodGallery.css';

export const FoodGallery = () => {
  const { t } = useTranslation();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const galleryItems = t('config.galleryItems', { returnObjects: true }) || [];

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth > 600 ? 400 : 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <section className="gallery-section section-padding">
      <div className="container">
        
        <div className="gallery-header text-center">
          <RevealOnScroll>
            <h2>{t('foodGallery.headline')}</h2>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <p className="gallery-subheadline">
              {t('foodGallery.subheadline')}
            </p>
          </RevealOnScroll>
        </div>

      </div>

      <RevealOnScroll delay={200} className="gallery-carousel-wrapper">
        <button 
          className={`gallery-nav btn-prev ${!canScrollLeft ? 'disabled' : ''}`}
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
        >
          <FaChevronLeft />
        </button>
        
        <div 
          className="gallery-carousel" 
          ref={scrollRef}
          onScroll={checkScroll}
        >
          {galleryItems.map((item, index) => {
            const configImage = [
              CONFIG.images.salad,
              CONFIG.images.soup,
              CONFIG.images.noodles,
              CONFIG.images.smoothie,
              CONFIG.images.breakfast
            ][index];
            return (
              <div key={index} className="gallery-item">
                <img src={configImage || item.image} alt={item.title} />
                <div className="gallery-item-title">{item.title}</div>
              </div>
            );
          })}
        </div>

        <button 
          className={`gallery-nav btn-next ${!canScrollRight ? 'disabled' : ''}`}
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
        >
          <FaChevronRight />
        </button>
      </RevealOnScroll>

      <div className="container">
        <RevealOnScroll delay={300} className="gallery-closing text-center">
          <p>{t('foodGallery.closing')}</p>
        </RevealOnScroll>
      </div>

    </section>
  );
};
