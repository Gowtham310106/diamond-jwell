'use client';

import React, { useState } from 'react';
import { MOCK_PRODUCTS, Product } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ShoppingBag, Eye } from 'lucide-react';

interface BestsellersProps {
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function Bestsellers({ onProductClick, onAddToCart }: BestsellersProps) {
  const [activeTab, setActiveTab] = useState<'All' | 'Rings' | 'Necklaces' | 'Earrings'>('All');

  // Filter products based on active category tab
  const filteredProducts = MOCK_PRODUCTS.filter((prod) => {
    if (activeTab === 'All') return true;
    return prod.category === activeTab;
  });

  return (
    <section className="py-16 bg-white text-[#0F172A] border-t border-[#e5dcd3]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="font-serif text-sm uppercase tracking-[0.25em] text-[#0F172A] mb-2 font-semibold">Exquisite Choices</h2>
            <h3 className="font-serif text-3xl sm:text-4xl font-semibold tracking-wide text-[#0F172A]" style={{ fontFamily: '"Playfair Display", "Fraunces", serif' }}>
              Trending Bestsellers
            </h3>
          </div>

          {/* Filtering Tabs */}
          <div className="flex bg-[#FCFAF7] border border-[#e5dcd3] rounded-full p-1 self-start md:self-end">
            {(['All', 'Rings', 'Necklaces', 'Earrings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-1.5 rounded-full text-xs font-sans tracking-widest uppercase transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-[#0F172A] text-white font-semibold' 
                    : 'text-[#0F172A]/75 hover:text-[#0F172A]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <Card
              key={prod.id}
              className="group relative flex flex-col justify-between overflow-hidden border border-[#e5dcd3] bg-[#FCFAF7] hover:border-[#0EA5E9]/35 hover:shadow-[0_4px_30px_rgba(15,23,42,0.08)] transition-all duration-500 rounded-2xl"
            >
              
              {/* Product Image Area with Gold-Trimmed Jewel Box Frame */}
              <div className="relative aspect-square w-[calc(100%-1.5rem)] mx-auto mt-3 bg-white overflow-hidden border border-[#e5dcd3] rounded-xl">
                
                {/* Bestseller Luxury Badge */}
                {prod.isBestseller && (
                  <div className="absolute left-4 top-4 z-10 rounded-full bg-[#0F172A] px-3 py-1 text-[9px] font-sans font-bold uppercase tracking-wider text-white shadow-sm">
                    Bestseller
                  </div>
                )}

                <img
                  src={prod.image}
                  alt={prod.name}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlaid Hover Quick actions */}
                <div className="absolute inset-0 bg-[#0EA5E9]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <Button
                    onClick={() => onProductClick(prod)}
                    className="h-10 w-10 rounded-full bg-white text-[#0F172A] hover:bg-[#0F172A] hover:text-white transition-colors"
                    size="icon"
                  >
                    <Eye className="h-4.5 w-4.5" />
                  </Button>
                  <Button
                    onClick={() => onAddToCart(prod)}
                    className="h-10 w-10 rounded-full bg-[#0F172A] text-white hover:bg-[#0F172A]/90 transition-colors"
                    size="icon"
                  >
                    <ShoppingBag className="h-4.5 w-4.5" />
                  </Button>
                </div>
              </div>

              {/* Product Specifications & Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#0F172A]/60 mb-1">
                    <span className="font-mono tracking-widest">{prod.sku}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-[#0EA5E9] text-[#0F172A]" />
                      <span className="font-semibold text-[#0F172A]">{prod.rating}</span>
                    </div>
                  </div>

                  <h4 
                    onClick={() => onProductClick(prod)}
                    className="font-serif text-base font-semibold text-[#0F172A] tracking-wide hover:text-[#0F172A] transition-colors cursor-pointer line-clamp-1"
                  >
                    {prod.name}
                  </h4>

                  {/* Specifications tags */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="text-[9px] font-sans tracking-wide uppercase px-2 py-0.5 rounded border border-[#e5dcd3] bg-white text-[#0F172A]/85">
                      {prod.metal}
                    </span>
                    <span className="text-[9px] font-sans tracking-wide uppercase px-2 py-0.5 rounded border border-[#e5dcd3] bg-white text-[#0F172A]/85">
                      {prod.diamondWeight} • {prod.diamondClarity}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#e5dcd3] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-sans tracking-widest text-[#0F172A]/60 uppercase">Price</span>
                    <span className="text-base font-serif font-bold text-[#0F172A]">
                      ₹{(prod.price * 85).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <Button
                    onClick={() => onAddToCart(prod)}
                    variant="ghost"
                    className="text-xs text-[#0F172A] hover:bg-[#0EA5E9]/5 font-bold uppercase tracking-wider"
                  >
                    Add to Cart
                  </Button>
                </div>

              </div>

            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}
