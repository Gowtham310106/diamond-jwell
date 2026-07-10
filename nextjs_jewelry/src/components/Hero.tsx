'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
  onBuilderClick: () => void;
}

const slides = [
  {
    image: '/tanishq/banner_souls_in_symphony.png',
    title: 'Souls In Symphony',
    description: 'A beautiful union of diamonds designed to celebrate the harmony of two hearts.',
  },
  {
    image: '/tanishq/banner_signature_couture.png',
    title: 'Signature Couture Edit',
    description: 'High-fashion editorial designs featuring hand-selected rare natural diamonds.',
  },
  {
    image: '/tanishq/banner_floral_bloom.png',
    title: 'Floral Bloom Collection',
    description: 'Delicate floral motifs crafted with micro-pave diamonds on warm 18K yellow gold.',
  },
  {
    image: '/tanishq/banner_diamond_exchange.png',
    title: 'Diamond Exchange Program',
    description: 'Upgrade your old gold jewelry for brand-new GIA-certified diamond creations.',
  },
  {
    image: '/tanishq/banner_everyday_diamond.png',
    title: 'The Everyday Diamond Edit',
    description: 'Minimalist studs, line bracelets, and stackable bands designed to shine daily.',
  }
];

export default function Hero({ onShopClick, onBuilderClick }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent trigger banner click
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent trigger banner click
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section 
      className="relative h-[550px] w-full overflow-hidden bg-white border-b border-[#e2e8f0] cursor-pointer"
      onClick={onShopClick}
    >
      
      {/* Slides Container */}
      <div className="absolute inset-0 w-full h-full">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image Banner */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[12000ms] hover:scale-105"
              style={{ backgroundImage: `url('${slide.image}')` }}
            />
            {/* Dark editorial masks to ensure readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            
            {/* Slide Content Frame */}
            <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
              <div className="max-w-xl space-y-6 text-left">
                
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[10px] text-white uppercase tracking-[0.25em] w-fit">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                  <span>Aura Couture</span>
                </span>
                
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-wide text-white leading-[1.1] drop-shadow-md">
                  {slide.title}
                </h1>
                
                <p className="font-sans text-xs sm:text-sm leading-relaxed text-white/90 max-w-md drop-shadow-sm">
                  {slide.description}
                </p>
                
                {/* Visual hint indicator that slide is clickable */}
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0EA5E9] hover:underline pt-2">
                  <span>Explore Collection</span>
                  <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>

              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full border border-white/25 bg-black/45 text-white hover:bg-[#0EA5E9] hover:border-transparent flex items-center justify-center transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full border border-white/25 bg-black/45 text-white hover:bg-[#0EA5E9] hover:border-transparent flex items-center justify-center transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Indicator Dot Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide(idx);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentSlide ? 'w-6 bg-[#0EA5E9]' : 'w-2 bg-white/40'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

    </section>
  );
}
