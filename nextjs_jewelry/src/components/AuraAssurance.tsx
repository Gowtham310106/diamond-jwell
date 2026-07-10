'use client';

import React from 'react';

const badges = [
  {
    image: '/tanishq/tanishq-quality-crafting.svg',
    title: 'Quality Craftsmanship'
  },
  {
    image: '/tanishq/tanishq-ethically-sourced.svg',
    title: 'Ethically Sourced'
  },
  {
    image: '/tanishq/tanishq-transparency.svg',
    title: '100% Transparency'
  },
  {
    image: '/tanishq/tanishq-exchange-logo.svg',
    title: 'Aura Exchange'
  },
  {
    image: '/tanishq/tanishq-purity-logo.svg',
    title: 'The Purity Guarantee'
  },
  {
    image: '/tanishq/tanishq-lifetime-logo.svg',
    title: 'Lifetime Maintenance'
  }
];

export default function TanishqAssurance() {
  return (
    <section className="py-16 bg-[#FCFAF7] text-[#0F172A] border-t border-[#e5dcd3]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading */}
          <div className="lg:col-span-4 space-y-2 text-center lg:text-left">
            <h3 
              className="text-3xl sm:text-4xl font-semibold tracking-wide text-[#0F172A]"
              style={{ fontFamily: '"Playfair Display", "Fraunces", serif' }}
            >
              Aura <span className="text-[#0F172A]/80">Assurance</span>
            </h3>
            <p 
              className="text-xs sm:text-sm font-sans tracking-widest text-[#0F172A]/60 uppercase"
            >
              Crafted by experts, cherished by you
            </p>
            <div className="mt-3 h-0.5 w-16 bg-[#0EA5E9]/30 rounded-full mx-auto lg:mx-0" />
          </div>

          {/* Right Column: Badges Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {badges.map((badge, idx) => (
              <div 
                key={idx}
                className="flex flex-col items-center p-6 bg-white border border-[#e5dcd3] rounded-2xl text-center shadow-sm hover:border-[#0EA5E9]/35 transition-all duration-300 group"
              >
                <div className="h-12 w-12 flex items-center justify-center relative overflow-hidden mb-3 transform group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={badge.image} 
                    alt={badge.title} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <h4 
                  className="font-serif text-xs sm:text-sm font-semibold text-[#0F172A] group-hover:text-[#0F172A] transition-colors tracking-wide leading-tight"
                  style={{ fontFamily: '"Playfair Display", "Fraunces", serif' }}
                >
                  {badge.title}
                </h4>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
