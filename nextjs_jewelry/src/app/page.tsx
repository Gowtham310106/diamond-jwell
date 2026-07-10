'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import CategoryNav from '@/components/CategoryNav';
import ScrollIntro from '@/components/ScrollIntro';
import Hero from '@/components/Hero';
import AuraCollections from '@/components/AuraCollections';
import Categories from '@/components/Categories';
import StylingGuide from '@/components/StylingGuide';
import AuraAssurance from '@/components/AuraAssurance';
import MarkYourMoment from '@/components/MarkYourMoment';
import Craftsmanship from '@/components/Craftsmanship';
import Footer from '@/components/Footer';

export default function Home() {
  const [isTransparent, setIsTransparent] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      if (window.scrollY < 3.2 * vh) {
        setIsTransparent(true);
      } else {
        setIsTransparent(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#0F172A] select-none">
      
      {/* Premium Aura Navigation Header */}
      <Navbar
        activeTab="home"
        setActiveTab={() => {}}
        cartCount={0}
        onOpenCart={() => {}}
        isTransparent={isTransparent}
      />

      {/* Main Category Circle Nav Bar */}
      <CategoryNav isTransparent={isTransparent} />

      {/* Pandora-Style Viewport Scroller Intro */}
      <ScrollIntro />

      {/* Main Homepage Flow (Positioned relatively so it sits in normal document flow below intro) */}
      <main className="relative z-10 bg-white">
        
        {/* Swiper Banner Carousel Section */}
        <Hero
          onShopClick={() => {}}
          onBuilderClick={() => {}}
        />

        {/* Aura divider symbol */}
        <div className="flex justify-center bg-white py-6">
          <img src="/tanishq/tanishq_divider.png" alt="Gold divider" className="max-w-[200px] h-auto opacity-40" />
        </div>

        <AuraCollections />

        <div className="flex justify-center bg-white py-6">
          <img src="/tanishq/tanishq_divider.png" alt="Gold divider" className="max-w-[200px] h-auto opacity-40" />
        </div>

        <Categories onCategoryClick={() => {}} />

        <div className="flex justify-center bg-white py-6">
          <img src="/tanishq/tanishq_divider.png" alt="Gold divider" className="max-w-[200px] h-auto opacity-40" />
        </div>

        <StylingGuide />

        <div className="flex justify-center bg-white py-6">
          <img src="/tanishq/tanishq_divider.png" alt="Gold divider" className="max-w-[200px] h-auto opacity-40" />
        </div>

        <AuraAssurance />

        <div className="flex justify-center bg-white py-6">
          <img src="/tanishq/tanishq_divider.png" alt="Gold divider" className="max-w-[200px] h-auto opacity-40" />
        </div>

        <MarkYourMoment
          onProductClick={() => {}}
          onAddToCart={() => {}}
        />

        <div className="flex justify-center bg-white py-6">
          <img src="/tanishq/tanishq_divider.png" alt="Gold divider" className="max-w-[200px] h-auto opacity-40" />
        </div>

        <Craftsmanship />
      </main>

      {/* Aura Editorial Footer */}
      <Footer />

    </div>
  );
}
