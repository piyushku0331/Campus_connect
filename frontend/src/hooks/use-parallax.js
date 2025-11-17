import { useEffect, useRef } from 'react';

export const useParallax = (speed = 0.5) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const rate = scrolled * -speed;
          element.style.transform = `translateY(${rate}px) translateZ(0)`;
          element.style.willChange = 'transform';
          ticking = false;
        });
        ticking = true;
      }
    };

    const initialScroll = window.pageYOffset;
    const initialRate = initialScroll * -speed;
    element.style.transform = `translateY(${initialRate}px) translateZ(0)`;

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return elementRef;
};