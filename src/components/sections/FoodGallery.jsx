import React, { useRef, useState, useEffect } from 'react';
import { CONFIG } from '../../config/landingConfig';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './FoodGallery.css';

export const FoodGallery = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const galleryItems = [
    { title: "Gỏi / Salad", image: CONFIG.images.salad },
    { title: "Cơm / Cháo", image: CONFIG.images.soup },
    { title: "Bánh xèo / Chiên", image: CONFIG.images.noodles },
    { title: "Smoothie bowl", image: CONFIG.images.smoothie },
    { title: "Bữa sáng healthy", image: CONFIG.images.breakfast }
  ];

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
            <h2>Ngày bận vẫn có thể ăn xanh theo cách ngon mắt hơn</h2>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <p className="gallery-subheadline">
              Chỉ cần thêm một chút Wolffia, món quen đã trông tươi hơn và bớt nhàm hơn rất nhiều.
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
          {galleryItems.map((item, index) => (
            <div key={index} className="gallery-item">
              <img src={item.image} alt={item.title} />
              <div className="gallery-item-title">{item.title}</div>
            </div>
          ))}
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
          <p>Một nguyên liệu nhỏ, nhưng đủ để làm bạn muốn ăn ở nhà nhiều hơn.</p>
        </RevealOnScroll>
      </div>

    </section>
  );
};
