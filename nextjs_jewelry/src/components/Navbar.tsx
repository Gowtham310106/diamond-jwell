import React, { useState } from 'react';
import { Search, Heart, User, ShoppingBag, MapPin, Calendar, HelpCircle, Menu, X } from 'lucide-react';
import { CATEGORIES } from './CategoryNav';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  isTransparent?: boolean;
}

export default function Navbar({ activeTab, setActiveTab, cartCount, onOpenCart, isTransparent = false }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const logoSrc = "/tanishq/aura_logo.png";

  return (
    <>
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
            
            {/* Mobile Burger Trigger & Logo Section */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-1 -ml-1 text-current hover:opacity-80 transition-opacity"
                aria-label="Open mobile menu"
              >
                <Menu className="h-6 w-6" />
              </button>
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

      {/* Mobile Drawer Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[3000] md:hidden bg-black/60 backdrop-blur-sm transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="w-80 max-w-[85vw] h-full bg-white text-[#0F172A] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Header: Brand Name & Close icon */}
              <div className="flex justify-between items-center pb-4 border-b border-[#e5dcd3]">
                <span className="font-serif text-lg font-bold tracking-widest text-[#0F172A]">AURA</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-[#0F172A] hover:opacity-75 transition-opacity"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Search input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search collections..."
                  className="w-full rounded-full border border-[#e5dcd3] bg-[#FCFAF7] py-2.5 pl-4 pr-10 text-xs text-[#0F172A] placeholder-[#0F172A]/40 focus:border-[#0F172A] focus:bg-white focus:outline-none"
                />
                <Search className="absolute right-3.5 top-3 h-4 w-4 text-[#0F172A]/60" />
              </div>

              {/* Categories list accordion */}
              <div className="space-y-4 pt-2">
                <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#0F172A]/50">Shop Categories</h4>
                <nav className="space-y-4">
                  {CATEGORIES.map((cat) => (
                    <div key={cat.id} className="space-y-2 border-b border-[#e5dcd3]/40 pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center">
                        <span className="font-serif text-sm font-semibold tracking-wide">{cat.name}</span>
                        <span className="text-[8px] text-white bg-[#0EA5E9] px-2 py-0.5 rounded font-sans uppercase font-bold tracking-wider">NEW</span>
                      </div>
                      <div className="pl-3 border-l border-[#e5dcd3]/60 space-y-1.5 py-1">
                        {cat.items.slice(0, 5).map((sub, sIdx) => (
                          <a 
                            key={sIdx}
                            href={sub.link}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block font-sans text-xs text-[#0F172A]/70 hover:text-[#0F172A] py-1 transition-colors"
                          >
                            {sub.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </nav>
              </div>
            </div>

            {/* Contacts & Store info */}
            <div className="pt-6 border-t border-[#e5dcd3] mt-8 space-y-3 text-center text-xs font-sans">
              <a href="#" className="block py-1 text-[#0F172A]/80 hover:text-[#0F172A] font-semibold">Find store near you</a>
              <a href="#" className="block py-1 text-[#0F172A]/80 hover:text-[#0F172A] font-semibold">Book an appointment</a>
              <p className="text-[9px] text-[#0F172A]/40 pt-2">© Aura Diamonds & Jewellery. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
