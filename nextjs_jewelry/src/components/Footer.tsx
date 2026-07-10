'use client';

import React from 'react';
import { Sparkles, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white border-t border-white/10 pt-16 pb-8 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="text-white">
              <svg className="h-8 w-auto text-left" viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Premium Faceted Diamond Emblem */}
                <path d="M24 10 L36 10 L42 22 L24 40 L6 22 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M6 22 L42 22" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
                <path d="M24 10 L24 40" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
                <path d="M15 10 L24 22 L33 10" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
                <path d="M15 10 L6 22 L24 40 L38 22 L33 10" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
                
                {/* Luxury Serif Wordmark */}
                <text x="58" y="31" fill="currentColor" style={{ fontFamily: '"Playfair Display", "Georgia", serif', letterSpacing: '0.22em', fontSize: '24px', fontWeight: 'bold' }}>AURA</text>
              </svg>
            </div>
            <p className="font-sans text-xs text-white/70 leading-relaxed max-w-xs">
              Hand-crafting certified diamond jewelry, loose solitaires, and luxury bridal collections. Committed to ethically-sourced masterworks that celebrate your moments.
            </p>
            <div className="flex space-x-3 pt-2">
              {[Facebook, Instagram, Twitter].map((Social, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white transition-colors"
                >
                  <Social className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links col 1 */}
          <div>
            <h4 className="font-serif text-sm text-white font-semibold tracking-wide mb-4">Collections</h4>
            <ul className="space-y-2 text-xs font-sans text-white/70">
              {['Engagement Rings', 'Solitaire Studs', 'Diamond Necklaces', 'Micropavé Bands', 'Loose Diamonds'].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links col 2 */}
          <div>
            <h4 className="font-serif text-sm text-white font-semibold tracking-wide mb-4">Customer Care</h4>
            <ul className="space-y-2 text-xs font-sans text-white/70">
              {['Complimentary Resizing', 'Insured Express Delivery', 'Lifetime Care Plan', 'Appraisals & GIA Dossier', 'Return Policy'].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter col */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm text-white font-semibold tracking-wide mb-2">Concierge Updates</h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Subscribe to unlock private collection viewings, design updates, and priority invitations.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full rounded-full border border-white/20 bg-white/5 py-2 pl-4 pr-10 text-xs text-white placeholder-white/45 focus:border-white/50 focus:outline-none"
              />
              <button className="absolute right-3.5 top-2.5 text-white/70 hover:text-white">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Footer Bottom copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-sans text-white/40 uppercase tracking-widest">
          <span>© {new Date().getFullYear()} Aura Diamonds & Jewellery. All Rights Reserved.</span>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
