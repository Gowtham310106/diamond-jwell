'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Product, MOCK_PRODUCTS } from '@/lib/data';

interface MarkYourMomentProps {
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function MarkYourMoment({ onProductClick, onAddToCart }: MarkYourMomentProps) {
  // Select a couple of premium necklace sets for this campaign showcase
  const campaignProducts = MOCK_PRODUCTS.filter(
    (p) => p.sku === 'NEC-VNS-001' || p.sku === 'NEC-BLM-009'
  );

  return (
    <section className="py-20 bg-white text-[#0F172A] border-t border-[#e5dcd3] relative overflow-hidden">
      
      {/* Background Burgundy Accent Watermark (Aura Style) */}
      <div className="absolute right-0 top-0 h-64 w-64 bg-[#0EA5E9]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-0 h-64 w-64 bg-[#0EA5E9]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Aura-style Editorial Banners */}
          <div 
            className="lg:col-span-5 p-8 md:p-12 rounded-3xl text-white space-y-6 relative overflow-hidden shadow-xl shadow-[#0EA5E9]/10 min-h-[480px] flex flex-col justify-between border border-[#e5dcd3] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.5)), url('/tanishq/banner_mark_your_moment.png')" }}
          >
            {/* Elegant luxury overlay decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-25">
              <img src="/tanishq/diamond-logo.png" alt="Diamond logo" className="h-10 w-10" />
            </div>
            
            <div className="space-y-4 relative z-10 bg-[#0F172A]/85 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 shadow-lg">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/25 px-3.5 py-1 text-[9px] font-sans font-bold uppercase tracking-wider text-white">
                <Sparkles className="h-3 w-3 animate-pulse" /> Festive Collections
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-widest text-[#EBE4D8] leading-none">
                #AuraMoments
              </h3>
              <p className="font-serif text-lg leading-relaxed text-[#FCFAF7] font-medium pt-2">
                Diamonds crafted for special occasions and styled with your festive attire.
              </p>
              <p className="font-sans text-xs text-white/85 leading-relaxed pt-2">
                Honor every significant chapter of your journey with Aura’s signature, hand-set, GIA-certified diamond collections.
              </p>
            </div>

            <div className="pt-6 border-t border-white/20 space-y-4 relative z-10">
              <div className="flex items-center gap-2.5 text-[10px] font-sans text-white/75">
                <ShieldCheck className="h-4.5 w-4.5 text-[#EBE4D8]" />
                <span>Original GIA Certification dossiers provided.</span>
              </div>
              <Button
                variant="outline"
                className="h-11 rounded-full border-white text-white hover:bg-white hover:text-[#0F172A] font-sans font-bold uppercase tracking-wider text-xs px-6 bg-transparent"
              >
                Request Custom Consultation
              </Button>
            </div>

          </div>

          {/* Right Column: Festive Necklace Sets grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {campaignProducts.map((prod) => (
              <Card
                key={prod.id}
                className="group relative flex flex-col justify-between overflow-hidden border border-[#e5dcd3] bg-[#FCFAF7] hover:border-[#0EA5E9]/35 hover:shadow-[0_4px_30px_rgba(15,23,42,0.08)] transition-all duration-500 rounded-3xl"
              >
                
                {/* Product image container with gold box frame */}
                <div className="relative aspect-square w-[calc(100%-1.5rem)] mx-auto mt-3 bg-white overflow-hidden border border-[#e5dcd3] rounded-2xl flex items-center justify-center p-4">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-[#0F172A] px-2.5 py-1 text-[8px] font-sans font-bold uppercase tracking-wider text-white">
                    Festive Choice
                  </span>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#0F172A]/60 mb-1 font-sans">
                      <span className="font-mono tracking-widest">{prod.sku}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-[#0EA5E9] text-[#0F172A]" />
                        <span className="font-semibold text-[#0F172A]">{prod.rating}</span>
                      </div>
                    </div>

                    <h4 
                      onClick={() => onProductClick(prod)}
                      className="font-serif text-base font-semibold text-[#0F172A] tracking-wide hover:text-[#0F172A] transition-colors cursor-pointer line-clamp-1"
                    >
                      {prod.name}
                    </h4>

                    <p className="text-[10px] text-[#0F172A]/70 line-clamp-2 mt-2 leading-relaxed">
                      {prod.description}
                    </p>

                    <div className="mt-3 flex gap-1">
                      <span className="text-[8px] font-sans tracking-wide uppercase px-2 py-0.5 rounded border border-[#e5dcd3] bg-white text-[#0F172A]/80 font-semibold">
                        {prod.metal}
                      </span>
                      <span className="text-[8px] font-sans tracking-wide uppercase px-2 py-0.5 rounded border border-[#e5dcd3] bg-white text-[#0F172A]/80 font-semibold">
                        {prod.diamondWeight} • {prod.diamondClarity}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#e5dcd3] flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-sans tracking-widest text-[#0F172A]/60 uppercase">Price</span>
                      <span className="text-base font-serif font-bold text-[#0F172A]">
                        ₹{(prod.price * 85).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <Button
                      onClick={() => onAddToCart(prod)}
                      className="h-9 rounded-full bg-[#0F172A] hover:bg-[#0F172A]/90 text-white font-sans font-bold uppercase tracking-wider text-[10px] px-4 shadow-sm"
                    >
                      Buy Set
                    </Button>
                  </div>

                </div>

              </Card>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
