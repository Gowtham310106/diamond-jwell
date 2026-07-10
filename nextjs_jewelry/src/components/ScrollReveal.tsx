'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 800,
  className = ''
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once it's visible, we can unobserve if we only want it to animate once
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        threshold: 0.1, // trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // offset so it triggers slightly before coming into view
      }
    );

    const currentRef = elementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Direction transform styles
  const getDirectionClass = () => {
    switch (direction) {
      case 'up':
        return 'translate-y-12';
      case 'down':
        return '-translate-y-12';
      case 'left':
        return '-translate-x-12';
      case 'right':
        return 'translate-x-12';
      default:
        return 'translate-y-12';
    }
  };

  return (
    <div
      ref={elementRef}
      className={`transition-all ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0, 0)' : undefined,
      }}
    >
      <div className={isVisible ? '' : getDirectionClass()}>
        {children}
      </div>
    </div>
  );
}
