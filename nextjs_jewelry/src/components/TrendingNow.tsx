'use client';

import React from 'react';

const trendingItems = [
  {
    image: '/tanishq/trending_everyday_diamonds.png',
    label: 'Everyday Diamonds'
  },
  {
    image: '/tanishq/trending_solitaire_statement.png',
    label: 'Solitaire Statement'
  },
  {
    image: '/tanishq/trending_signature_couture.png',
    label: 'Signature Couture'
  }
];

export default function TrendingNow() {
  return (
    <section className="py-16 bg-white text-[#0F172A] border-t border-[#e5dcd3]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Headings */}
        <div className="text-center mb-10 md:mb-12">
          <h2 
            className="text-3xl sm:text-4xl font-semibold tracking-wide text-[#0F172A]"
            style={{ fontFamily: '"Playfair Display", "Fraunces", serif' }}
          >
            Trending Now
          </h2>
          <p 
            className="mt-2 text-xs sm:text-sm text-[#0F172A]/60 tracking-wide font-sans"
          >
            Jewellery pieces everyone’s eyeing right now
          </p>
          <div className="mt-3 mx-auto h-0.5 w-16 bg-[#0EA5E9]/30 rounded-full" />
        </div>

        {/* 3-Image Grid Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trendingItems.map((item, idx) => (
            <div 
              key={idx} 
              className="flex flex-col group cursor-pointer"
            >
              {/* Image box with gold border and rounded design */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-[#e5dcd3] shadow-sm bg-white">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* Below-image labels styled like Aura */}
              <div className="mt-4 text-center">
                <p 
                  className="text-sm font-sans font-semibold tracking-wider text-[#0F172A]/80 group-hover:text-[#0F172A] transition-colors"
                >
                  {item.label}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
