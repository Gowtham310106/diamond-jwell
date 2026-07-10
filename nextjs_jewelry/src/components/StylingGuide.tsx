'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StoryCard {
  image: string;
  title: string;
  productName: string;
  productThumb: string;
  video?: string;
}

const storyCards: StoryCard[] = [
  {
    image: '/tanishq/earrings-3-4-26.jpg',
    video: '/Close_up_vertical_shot_of_a_m.mp4',
    title: 'Your earring sparkle, e...',
    productName: 'Dazzling Teardrop Diamond Drop Earrings',
    productThumb: '/tanishq/earrings-3-4-26.jpg',
  },
  {
    image: '/tanishq/ring-3-4-26.jpg',
    video: '/Vertical_macro_close_up_of_so.mp4',
    title: 'Ring styling for every...',
    productName: 'Everlasting Shine Diamond Finger Ring',
    productThumb: '/tanishq/ring-3-4-26.jpg',
  },
  {
    image: '/tanishq/bangles-3-4-26.jpg',
    title: 'Your hour is power hour',
    productName: 'Twisted Diamond Bangle',
    productThumb: '/tanishq/bangles-3-4-26.jpg',
  },
  {
    image: '/tanishq/pendants-3-4-26.jpg',
    title: 'Pendant party essentials',
    productName: 'Sparkling Hearts Diamond Necklace',
    productThumb: '/tanishq/pendants-3-4-26.jpg',
  },
  {
    image: '/tanishq/chains-3-4-26.jpg',
    title: 'Layer it your way',
    productName: 'Exquisite Vines Diamond Necklace Set',
    productThumb: '/tanishq/chains-3-4-26.jpg',
  },
  {
    image: '/tanishq/bracelets-3-4-26.jpg',
    title: 'Wrist game strong',
    productName: 'Arrow Diamond Bangle',
    productThumb: '/tanishq/bracelets-3-4-26.jpg',
  },
  {
    image: '/tanishq/mangalsutra-3-4-26.jpg',
    title: 'Modern traditions',
    productName: 'Contemporary Diamond Bangle',
    productThumb: '/tanishq/mangalsutra-3-4-26.jpg',
  },
];

export default function StylingGuide() {
  const [activeIndex, setActiveIndex] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const goNext = () => {
    setActiveIndex((prev) => (prev < storyCards.length - 1 ? prev + 1 : 0));
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : storyCards.length - 1));
  };

  // Auto-advance every 4 seconds
  useEffect(() => {
    const timer = setInterval(goNext, 4000);
    return () => clearInterval(timer);
  }, []);

  const getVisibleCards = () => {
    const total = storyCards.length;
    const indices = [];
    for (let offset = -1; offset <= 1; offset++) {
      let idx = activeIndex + offset;
      if (idx < 0) idx += total;
      if (idx >= total) idx -= total;
      indices.push({ index: idx, offset });
    }
    return indices;
  };

  return (
    <section className="py-16 md:py-20" style={{ background: '#FAF8F5' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Aura-style heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2
            className="text-3xl sm:text-4xl md:text-[42px] font-bold tracking-wide leading-tight"
            style={{
              fontFamily: '"Playfair Display", "Fraunces", serif',
              color: '#0F172A',
            }}
          >
            Styling 101 With Diamonds
          </h2>
          <p
            className="mt-3 text-sm sm:text-base md:text-lg"
            style={{
              fontFamily: '"Playfair Display", "Fraunces", serif',
              fontStyle: 'italic',
              color: '#56544E',
              fontWeight: 400,
            }}
          >
            Trendsetting diamond jewellery suited for every occasion
          </p>
        </div>

        {/* Story Card Carousel */}
        <div className="relative flex items-center justify-center" style={{ minHeight: '480px' }}>

          {/* Left Arrow */}
          <button
            onClick={goPrev}
            className="absolute left-0 md:left-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border transition-all hover:shadow-md"
            style={{
              borderColor: '#d4d0c8',
              background: '#fff',
              color: '#56544E',
            }}
            aria-label="Previous story"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Cards Container */}
          <div
            ref={containerRef}
            className="relative flex items-center justify-center"
            style={{ width: '100%', maxWidth: '700px', height: '460px' }}
          >
            {getVisibleCards().map(({ index, offset }) => {
              const card = storyCards[index];
              const isCenter = offset === 0;
              const isAdjacent = Math.abs(offset) === 1;
              const isOuter = Math.abs(offset) === 2;

              // Sizing and position
              const scale = isCenter ? 1 : isAdjacent ? 0.82 : 0.65;
              const translateX = offset * (isCenter ? 0 : isAdjacent ? 155 : 240);
              const zIndex = isCenter ? 20 : isAdjacent ? 10 : 5;
              const opacity = isCenter ? 1 : isAdjacent ? 0.7 : 0.4;
              const blur = isCenter ? 0 : isAdjacent ? 1 : 3;

              return (
                <div
                  key={`${index}-${offset}`}
                  className="absolute cursor-pointer"
                  onClick={() => setActiveIndex(index)}
                  style={{
                    width: '220px',
                    height: '390px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transform: `translateX(${translateX}px) scale(${scale})`,
                    zIndex,
                    opacity,
                    filter: `blur(${blur}px)`,
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isCenter
                      ? '0 20px 60px rgba(0,0,0,0.25)'
                      : '0 8px 25px rgba(0,0,0,0.15)',
                  }}
                >
                  {/* Story card background image or video */}
                  <div className="relative w-full h-full">
                    {card.video ? (
                      <video
                        src={card.video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    )}

                    {/* Top gradient overlay with title */}
                    <div
                      className="absolute inset-x-0 top-0 px-3 pt-3 pb-8"
                      style={{
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)',
                      }}
                    >
                      <p
                        className="text-[11px] text-white/90 truncate"
                        style={{ fontFamily: '"Montserrat", sans-serif' }}
                      >
                        {card.title}
                      </p>
                    </div>

                    {/* Bottom product overlay */}
                    <div
                      className="absolute inset-x-0 bottom-0 p-3"
                      style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="flex-shrink-0 h-9 w-9 rounded-lg overflow-hidden border"
                          style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                        >
                          <img
                            src={card.productThumb}
                            alt={card.productName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p
                          className="text-[10px] text-white/90 leading-tight flex-1 line-clamp-2"
                          style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 600 }}
                        >
                          {card.productName}
                        </p>
                        <div
                          className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(255,255,255,0.2)' }}
                        >
                          <ChevronRight className="h-3.5 w-3.5 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Aura logo watermark on center card */}
                    {isCenter && (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-80">
                        <img
                          src="/tanishq/diamond-logo.png"
                          alt="Diamond"
                          className="h-3.5 w-3.5"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={goNext}
            className="absolute right-0 md:right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border transition-all hover:shadow-md"
            style={{
              borderColor: '#d4d0c8',
              background: '#fff',
              color: '#56544E',
            }}
            aria-label="Next story"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-6">
          {storyCards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className="rounded-full transition-all duration-300"
              style={{
                width: activeIndex === idx ? '20px' : '6px',
                height: '6px',
                background: activeIndex === idx ? '#0F172A' : '#d4d0c8',
              }}
              aria-label={`Go to story ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
