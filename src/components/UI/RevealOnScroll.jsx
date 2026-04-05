import React, { useEffect, useRef, useState } from 'react';

export const RevealOnScroll = ({ children, className = '', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  const delayClass = delay > 0 ? `delay-${delay}` : '';
  
  return (
    <div 
      ref={ref} 
      className={`reveal ${isVisible ? 'active' : ''} ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
};
