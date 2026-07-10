'use client';

import React from 'react';

export default function TanishqCollections() {
  return (
    <section className="py-12 sm:py-16" style={{ background: '#FCFAF7' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Heading Component */}
        <div className="text-center mb-8 md:mb-12">
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide text-[#0F172A]"
            style={{ fontFamily: '"Playfair Display", "Fraunces", serif' }}
          >
            Aura Collections
          </h2>
          <p 
            className="mt-2 text-[10px] sm:text-xs text-[#0F172A]/60 uppercase tracking-widest font-sans"
          >
            Explore our newly curated luxury diamond collections
          </p>
          <div className="mt-3 mx-auto h-0.5 w-16 bg-[#0EA5E9]/30 rounded-full" />
        </div>

        {/* 2-Column Grid (1 Big, 2 Small stacked) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          
          {/* Left Column - Large Collection Banner */}
          <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl border border-[#e5dcd3] shadow-md aspect-[3/2] sm:aspect-[4/3] md:aspect-auto md:h-full min-h-[220px] sm:min-h-[340px]">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('/tanishq/aura_featured_collection.png')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-left">
              <span className="text-[8px] sm:text-[9px] uppercase font-sans tracking-widest text-white bg-[#0EA5E9] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-bold shadow-sm">
                Aura Signature
              </span>
              <h4 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-white mt-2 sm:mt-3">Aura Dailywear</h4>
              <p className="font-sans text-[10px] sm:text-xs text-white/80 mt-1 sm:mt-1.5 leading-relaxed line-clamp-2">
                Brilliant, modern diamond essentials crafted to capture the essence of everyday luxury.
              </p>
            </div>
          </div>

          {/* Right Column - Stacked Small Collection Banners */}
          <div className="flex flex-col gap-4 sm:gap-6 justify-between">
            
            {/* Top Right Card */}
            <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl border border-[#e5dcd3] shadow-sm aspect-[16/9] sm:aspect-[21/9] flex-1 min-h-[140px] sm:min-h-[160px]">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: "url('/tanishq/aura_gemstone_edit.png')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 text-left">
                <span className="text-[8px] sm:text-[9px] uppercase font-sans tracking-widest text-white bg-[#0EA5E9]/90 px-2 sm:px-2.5 py-0.5 rounded-full font-bold shadow-sm">
                  Gemstone Edit
                </span>
                <h4 className="font-serif text-base sm:text-lg font-bold text-white mt-1.5 sm:mt-2">Sapphires & Diamonds</h4>
              </div>
            </div>

            {/* Bottom Right Card */}
            <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl border border-[#e5dcd3] shadow-sm aspect-[16/9] sm:aspect-[21/9] flex-1 min-h-[140px] sm:min-h-[160px]">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: "url('/tanishq/aura_couture_luxury.png')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 text-left">
                <span className="text-[8px] sm:text-[9px] uppercase font-sans tracking-widest text-white bg-[#0EA5E9]/90 px-2 sm:px-2.5 py-0.5 rounded-full font-bold shadow-sm">
                  Couture Luxuries
                </span>
                <h4 className="font-serif text-base sm:text-lg font-bold text-white mt-1.5 sm:mt-2">Editorial Bridal Masterpieces</h4>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
