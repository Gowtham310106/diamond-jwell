'use client';

import React, { useEffect, useRef } from 'react';

interface CategoryItem {
  id: string;
  gridArea: string;
  name: string;
  image: string;
  link: string;
}

const CATEGORY_ITEMS: CategoryItem[] = [
  { id: 'rings', gridArea: 'item1', name: 'Rings', image: '/bluestone/Rings-4x.webp', link: '#' },
  { id: 'earrings', gridArea: 'item2', name: 'Earrings', image: '/bluestone/Earrings-4x.webp', link: '#' },
  { id: 'pendants', gridArea: 'item3', name: 'Pendants', image: '/bluestone/Pendants-4x.webp', link: '#' },
  { id: 'chains', gridArea: 'item4', name: 'Chains', image: '/bluestone/Chains-4x.webp', link: '#' },
  { id: 'watch-acc', gridArea: 'item5', name: 'Watch Jewellery', image: '/bluestone/WatchJewellery-4x.webp', link: '#' },
  { id: 'necklaces', gridArea: 'item6', name: 'Necklaces', image: '/bluestone/Necklace-4x.webp', link: '#' },
  { id: 'bracelets', gridArea: 'item15', name: 'Bracelets', image: '/bluestone/Bracelets-4x.webp', link: '#' },
  { id: 'mangalsutras', gridArea: 'item14', name: 'Mangalsutras', image: '/bluestone/Mangalsutras-4x.webp', link: '#' },
  { id: 'nosepins', gridArea: 'item12', name: 'Nose Pins', image: '/bluestone/Nosepins-4x.webp', link: '#' },
  { id: 'solitaires', gridArea: 'item13', name: 'Solitaires', image: '/bluestone/Solitaires-4x.webp', link: '#' },
  { id: 'coins', gridArea: 'item7', name: 'Gold Coins', image: '/bluestone/GoldCoin-4x.webp', link: '#' },
  { id: 'kids', gridArea: 'item11', name: 'Kids Jewellery', image: '/bluestone/KidsJewellery-4x.webp', link: '#' },
  { id: 'men', gridArea: 'item16', name: "Men's Jewellery", image: '/bluestone/MensJewellery-4x.webp', link: '#' },
  { id: 'anklets', gridArea: 'item10', name: 'Anklets', image: '/bluestone/Anklets-4x.webp', link: '#' },
  { id: 'bangles', gridArea: 'item8', name: 'Bangles', image: '/bluestone/Bangles-4x.webp', link: '#' },
  { id: 'kadas', gridArea: 'item9', name: 'Kadas', image: '/bluestone/Kada-4x.webp', link: '#' },
];

export default function Categories({ onCategoryClick }: { onCategoryClick: (name: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const blocks = containerRef.current.querySelectorAll('.category-block');
    const directions = ['animate-left', 'animate-up', 'animate-right', 'animate-down'];
    
    // Assign animation directions to grid items
    blocks.forEach((block, index) => {
      const dir = directions[index % directions.length];
      block.classList.add(dir);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    blocks.forEach((block) => {
      observer.observe(block);
    });

    return () => {
      blocks.forEach((block) => observer.unobserve(block));
    };
  }, []);

  return (
    <section style={{ backgroundColor: 'transparent' }} className="pb-16 pt-8" data-analytics-section-name="Shop By Category">
      
      {/* Scoped CSS overrides moved to globals.css */}

      {/* Bento Grid Title Header */}
      <div className="text-center mb-10">
        <h1 
          className="text-3xl sm:text-4xl font-semibold tracking-wide text-[#0F172A]"
          style={{ fontFamily: '"Playfair Display", "Fraunces", serif' }}
        >
          Shop by Category
        </h1>
        <h2 
          className="mt-2 text-xs sm:text-sm text-[#0F172A]/60 uppercase tracking-widest font-sans"
        >
          Discover our most popular collections
        </h2>
        <div className="mt-3 mx-auto h-0.5 w-16 bg-[#0EA5E9]/30 rounded-full" />
      </div>

      {/* Main Bento Grid container */}
      <div ref={containerRef} className="bluestone-category-sec-container">
        <div 
          className="grid grid-cols-6"
          style={{
            gridTemplateAreas: `
              'item1 item1 item2 item2 item2 item2'
              'item1 item1 item2 item2 item2 item2'
              'item1 item1 item2 item2 item2 item2'
              'item1 item1 item3 item3 item4 item4'
              'item1 item1 item3 item3 item4 item4'
              'item15 item15 item8 item8 item8 item8'
              'item15 item15 item8 item8 item8 item8'
              'item15 item15 item8 item8 item8 item8'
              'item6 item6 item6 item12 item12 item12'
              'item6 item6 item6 item12 item12 item12'
              'item6 item6 item6 item12 item12 item12'
              'item13 item13 item13 item13 item9 item9'
              'item13 item13 item13 item13 item9 item9'
              'item13 item13 item13 item13 item9 item9'
              'item16 item16 item16 item16 item11 item11'
              'item16 item16 item16 item16 item11 item11'
              'item16 item16 item16 item16 item11 item11'
              'item10 item10 item10 item5 item5 item5'
              'item10 item10 item10 item5 item5 item5'
              'item10 item10 item10 item5 item5 item5'
              'item7 item7 item14 item14 item14 item14'
              'item7 item7 item14 item14 item14 item14'
              'item7 item7 item14 item14 item14 item14'
            `
          }}
        >
          {CATEGORY_ITEMS.map((item) => (
            <div 
              key={item.id} 
              className="category-block" 
              style={{ gridArea: item.gridArea }}
              onClick={() => onCategoryClick(item.name)}
            >
              {/* Exact 3D Floating Shadow hover transition design from Bluestone */}
              <div 
                className="relative h-full transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] [transform:translate3d(0,0,0)] 
                           shadow-[0_4px_10px_rgba(0,0,0,0.22)] md:shadow-[0_6px_16px_rgba(0,0,0,0.2)] 
                           md:hover:-translate-y-[2px] md:hover:scale-[1.015] md:hover:shadow-[0_20px_38px_rgba(0,0,0,0.28)] hover:z-10 cursor-pointer"
              >
                <div className="w-full h-full relative overflow-hidden rounded-[inherit]">
                  
                  {/* Category Image */}
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                    loading="lazy" 
                  />

                  {/* Gradient mask at the bottom (exactly 50% height from Bluestone) */}
                  <div 
                    className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2] rounded-b-[inherit]" 
                    style={{ 
                      background: 'linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0) 100%)',
                      height: '50%'
                    }} 
                  />

                  {/* Character spacing hover transition link from Bluestone */}
                  <h2 className="absolute bottom-0 left-0 right-0 m-0 z-[3]">
                    <a 
                      href={item.link} 
                      className="pointer-events-auto inline-block w-full px-3 pb-3 pt-6 font-semibold whitespace-pre-line text-center text-xs md:text-sm tracking-[0.03em] uppercase transition-all duration-300 ease-out hover:tracking-[0.07em] text-white"
                      style={{ fontFamily: "'Proxima Nova Regular', Arial, sans-serif" }}
                    >
                      {item.name}
                    </a>
                  </h2>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
