// src/hooks/useScrollReveal.js
import { useEffect, useRef } from 'react';

/**
 * Attach to a container ref. Any child with class "scroll-reveal",
 * "scroll-reveal-left", or "scroll-reveal-scale" will animate in
 * when it enters the viewport.
 */
export function useScrollReveal(options = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const { threshold = 0.12, rootMargin = '0px 0px -40px 0px' } = options;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold, rootMargin }
    );

    const targets = document.querySelectorAll(
      '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-scale'
    );
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return containerRef;
}
