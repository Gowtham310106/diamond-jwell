'use client';

import React from 'react';
import { Award, Hammer, ShieldCheck, Heart } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function Craftsmanship() {
  return (
    <section className="py-20 bg-white text-[#0F172A] border-t border-[#e5dcd3]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Description column */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="left" delay={150}>
              <div className="space-y-6">
                <h2 className="font-serif text-sm uppercase tracking-[0.25em] text-[#0F172A] font-semibold">Handcrafted Heritage</h2>
                <h3 className="font-serif text-3xl sm:text-4xl font-semibold tracking-wide text-[#0F172A] leading-tight">
                  Where Masterful Engineering <br className="hidden sm:inline" />
                  Meets Timeless Artistry
                </h3>
                <p className="font-sans text-sm text-[#0F172A]/70 leading-relaxed max-w-2xl">
                  Every diamond selected by Aura represents a rigorous vetting cycle. Less than 1% of the world’s diamonds qualify for our solitaire inventory. Each gem is evaluated by veteran gemologists, certified by the Gemological Institute of America (GIA), and hand-set in micro-claw settings by master goldsmiths.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  {[
                    {
                      icon: Award,
                      title: "GIA Certified Selection",
                      desc: "We supply only GIA & IGI graded diamonds representing D to F color grades and VVS/IF clarities."
                    },
                    {
                      icon: Hammer,
                      title: "Artisanal Claw Settings",
                      desc: "Our settings are custom-crafted using premium Platinum 950 and 18K solid gold to maximize brilliance."
                    },
                    {
                      icon: ShieldCheck,
                      title: "Ethically Sourced",
                      desc: "We adhere strictly to the Kimberley Process, ensuring conflict-free sourcing on all solitaires."
                    },
                    {
                      icon: Heart,
                      title: "Lifetime Warranty",
                      desc: "Enjoy annual cleaning, diamond checking, prong tighteners, and resizing under our care program."
                    }
                  ].map((feat, idx) => {
                    const Icon = feat.icon;
                    return (
                      <div key={idx} className="flex gap-4">
                        <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0EA5E9]/5 border border-[#0F172A]/15 text-[#0F172A] shadow-sm">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-serif text-base text-[#0F172A] font-semibold tracking-wide">{feat.title}</h4>
                          <p className="font-sans text-xs text-[#0F172A]/60 mt-1 leading-relaxed">{feat.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Graphics and branding cards column */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <ScrollReveal direction="right" delay={250}>
              
              {/* Elegant luxury floating card layouts */}
              <div 
                className="w-full max-w-[380px] aspect-square rounded-3xl border border-[#e5dcd3] p-8 flex flex-col justify-between relative overflow-hidden shadow-[0_4px_30px_rgba(15,23,42,0.02)] bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.94)), url('/tanishq/aura_featured_collection.png')" }}
              >
                {/* background watermark lines */}
                <div className="absolute inset-0 border border-[#0F172A]/5 rounded-full scale-75 animate-pulse" />
                
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-sans tracking-[0.25em] text-[#0F172A] uppercase font-bold">LIFETIME AUDIT</span>
                  <span className="text-[10px] font-mono text-[#0F172A]/40">ID-198038A</span>
                </div>

                <div className="space-y-4 relative z-10 text-center py-6">
                  <span className="block font-serif text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#0F172A] to-[#0F172A]/65">100%</span>
                  <p className="font-serif text-lg font-semibold text-[#0F172A] tracking-wide">Certified Integrity</p>
                  <p className="font-sans text-xs text-[#0F172A]/70 leading-normal px-4">
                    Each purchase arrives accompanied by its original GIA grading dossier, laser inscription verification, and certificate of appraisal.
                  </p>
                </div>

                <div className="flex justify-between items-center text-[9px] font-sans text-[#0F172A]/40 tracking-wider uppercase border-t border-[#e5dcd3] pt-4">
                  <span>GENUINE VALUE</span>
                  <span>AUTHENTIC ORIGIN</span>
                </div>
              </div>

            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
}
