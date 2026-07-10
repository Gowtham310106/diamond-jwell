'use client';

import React from 'react';
import { Search, Heart, User, ShoppingBag, MapPin, Calendar, HelpCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  isTransparent?: boolean;
}

export default function Navbar({ activeTab, setActiveTab, cartCount, onOpenCart, isTransparent = false }: NavbarProps) {
  const logoSrc = "/tanishq/aura_logo.png";

  return (
    <header 
      className={`w-full fixed top-0 left-0 z-[2000] transition-all duration-300 ${
        isTransparent 
          ? 'bg-transparent border-transparent shadow-none text-white' 
          : 'bg-white border-b border-[#e5dcd3] shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-[#0F172A]'
      }`}
    >
      {/* Tier 1: Top Bar */}
      <div 
        className={`w-full py-1.5 transition-all duration-300 ${
          isTransparent 
            ? 'bg-black/10 text-white/90 border-b border-white/10' 
            : 'bg-[#0F172A] text-[#FCFAF7] border-b border-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center text-[10px] tracking-wider uppercase font-semibold">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span>Gold Rate (22K): ₹6,840/g</span>
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <MapPin className="h-3 w-3" /> Find Store
            </a>
            <a href="#" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <Calendar className="h-3 w-3" /> Book Appointment
            </a>
            <a href="#" className="hidden sm:flex items-center gap-1 hover:opacity-80 transition-opacity">
              <HelpCircle className="h-3 w-3" /> Contact Us
            </a>
          </div>
        </div>
      </div>

      {/* Tier 2: Brand Header */}
      <div className="w-full py-3 sm:py-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex justify-between items-center">
          
          {/* Logo Section */}
          <div 
            onClick={() => setActiveTab('home')}
            className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
              isTransparent ? 'text-white' : 'text-[#0F172A]'
            }`}
          >
            <svg className="h-8 sm:h-10 w-auto" viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg">
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

          {/* Search Section */}
          <div className="relative max-w-md w-full mx-6 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for Gold Jewellery, Diamonds, Coins..."
                className={`w-full rounded-full border py-2 pl-4 pr-10 text-[11px] font-medium transition-all ${
                  isTransparent
                    ? 'border-white/20 bg-white/10 text-white placeholder-white/50 focus:border-white focus:bg-white/25 focus:ring-0'
                    : 'border-[#0F172A]/20 bg-[#FCFAF7] text-[#0F172A] placeholder-[#0F172A]/50 focus:border-[#0F172A] focus:bg-white focus:ring-0'
                }`}
              />
              <Search className={`absolute right-3.5 top-2.5 h-4 w-4 ${
                isTransparent ? 'text-white/60' : 'text-[#0F172A]/60'
              }`} />
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-6">
            <button 
              className={`flex flex-col items-center group transition-colors ${
                isTransparent ? 'text-white hover:text-white/80' : 'text-[#0F172A] hover:text-[#0F172A]'
              }`}
            >
              <Heart className="h-5 sm:h-6 w-5 sm:w-6 transition-transform group-hover:scale-105" />
              <span className="text-[9px] mt-1 font-semibold tracking-wider uppercase hidden sm:block">Wishlist</span>
            </button>

            <button 
              className={`flex flex-col items-center group transition-colors ${
                isTransparent ? 'text-white hover:text-white/80' : 'text-[#0F172A] hover:text-[#0F172A]'
              }`}
            >
              <User className="h-5 sm:h-6 w-5 sm:w-6 transition-transform group-hover:scale-105" />
              <span className="text-[9px] mt-1 font-semibold tracking-wider uppercase hidden sm:block">Login</span>
            </button>

            <button 
              onClick={onOpenCart}
              className={`flex flex-col items-center group relative transition-colors ${
                isTransparent ? 'text-white hover:text-white/80' : 'text-[#0F172A] hover:text-[#0F172A]'
              }`}
            >
              <div className="relative">
                <ShoppingBag className="h-5 sm:h-6 w-5 sm:w-6 transition-transform group-hover:scale-105" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0F172A] text-[9px] font-bold text-white shadow-sm border border-white animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[9px] mt-1 font-semibold tracking-wider uppercase hidden sm:block">Cart</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
