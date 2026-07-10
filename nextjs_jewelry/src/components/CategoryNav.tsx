'use client';

import React, { useState, useRef, useEffect } from 'react';

interface CategoryNavProps {
  isTransparent?: boolean;
}

interface Subcategory {
  name: string;
  link: string;
}

interface Category {
  id: string;
  name: string;
  image: string;
  items: Subcategory[];
  bannerImg: string;
  bannerTitle: string;
  bannerLink: string;
}

const CATEGORIES: Category[] = [
  {
    id: 'all',
    name: 'All Jewellery',
    image: '/tanishq/cat_all_jewellery.png',
    bannerImg: '/tanishq/aura_featured_collection.png',
    bannerTitle: 'Aura Signature - Modern Fine Jewelry.',
    bannerLink: '#',
    items: [
      { name: 'All Jewellery', link: '#' },
      { name: 'Earrings', link: '#' },
      { name: 'Pendants', link: '#' },
      { name: 'Finger Rings', link: '#' },
      { name: 'Mangalsutra', link: '#' },
      { name: 'Chains', link: '#' },
      { name: 'Nose Pin', link: '#' },
      { name: 'Necklaces', link: '#' },
      { name: 'Necklace Set', link: '#' },
      { name: 'Bangles', link: '#' },
      { name: 'Bracelets', link: '#' }
    ]
  },
  {
    id: 'gold',
    name: 'Gold',
    image: '/tanishq/cat_gold.png',
    bannerImg: '/tanishq/aura_gemstone_edit.png',
    bannerTitle: 'Liquid Gold & Gemstone Masterpieces.',
    bannerLink: '#',
    items: [
      { name: 'All Gold', link: '#' },
      { name: 'Gold Bangles', link: '#' },
      { name: 'Gold Bracelets', link: '#' },
      { name: 'Gold Earrings', link: '#' },
      { name: 'Gold Chains', link: '#' },
      { name: 'Gold Pendants', link: '#' },
      { name: 'Gold Rings', link: '#' },
      { name: 'Gold Necklaces', link: '#' }
    ]
  },
  {
    id: 'diamond',
    name: 'Diamond',
    image: '/tanishq/cat_diamond.png',
    bannerImg: '/tanishq/banner_diamond_exchange.png',
    bannerTitle: 'Brilliant Cut Solitaire Diamonds.',
    bannerLink: '#',
    items: [
      { name: 'All Diamond', link: '#' },
      { name: 'Diamond Bangles', link: '#' },
      { name: 'Diamond Bracelets', link: '#' },
      { name: 'Diamond Earrings', link: '#' },
      { name: 'Diamond Rings', link: '#' },
      { name: 'Diamond Mangalsutra', link: '#' },
      { name: 'Diamond Necklaces', link: '#' },
      { name: 'Diamond Pendants', link: '#' }
    ]
  },
  {
    id: 'earrings',
    name: 'Earrings',
    image: '/tanishq/earrings-circle.webp',
    bannerImg: '/tanishq/trending_signature_couture.png',
    bannerTitle: 'Aura Statement Chandelier Earrings.',
    bannerLink: '#',
    items: [
      { name: 'All Earrings', link: '#' },
      { name: 'Drop & Danglers', link: '#' },
      { name: 'Hoop & Huggies', link: '#' },
      { name: 'Jhumkas', link: '#' },
      { name: 'Studs & Tops', link: '#' },
      { name: 'Under ₹25K', link: '#' },
      { name: '₹25K - ₹50K', link: '#' },
      { name: 'Office Wear', link: '#' }
    ]
  },
  {
    id: 'rings',
    name: 'Rings',
    image: '/tanishq/rings-circle.webp',
    bannerImg: '/tanishq/trending_solitaire_statement.png',
    bannerTitle: 'Aura Engagement & Solitaire Bands.',
    bannerLink: '#',
    items: [
      { name: 'All Rings', link: '#' },
      { name: 'Casual Rings', link: '#' },
      { name: 'Couple Rings', link: '#' },
      { name: 'Diamond Engagement Rings', link: '#' },
      { name: 'Engagement Rings', link: '#' },
      { name: 'Gold Engagement Rings', link: '#' },
      { name: "Men's Rings", link: '#' }
    ]
  },
  {
    id: 'dailywear',
    name: 'Dailywear',
    image: '/tanishq/dailywear-circle.webp',
    bannerImg: '/tanishq/banner_everyday_diamond.png',
    bannerTitle: 'Minimalist Stackable Diamond Essentials.',
    bannerLink: '#',
    items: [
      { name: 'Dailywear Jewellery', link: '#' },
      { name: 'Dailywear Chains', link: '#' },
      { name: 'Dailywear Earrings', link: '#' },
      { name: 'Dailywear Rings', link: '#' },
      { name: 'Dailywear Mangalsutra', link: '#' },
      { name: 'Dailywear Pendants', link: '#' }
    ]
  },
  {
    id: 'gemstones',
    name: 'Gemstones',
    image: '/tanishq/gemstones-circle.webp',
    bannerImg: '/tanishq/aura_gemstone_edit.png',
    bannerTitle: 'Vibrant Deep Gemstone Jewels.',
    bannerLink: '#',
    items: [
      { name: 'Gemstone Jewellery', link: '#' },
      { name: 'Gemstone Earrings', link: '#' },
      { name: 'Gemstone Pendants', link: '#' },
      { name: 'Gemstone Rings', link: '#' },
      { name: 'Emerald Stones', link: '#' },
      { name: 'Rubies', link: '#' }
    ]
  },
  {
    id: 'rivaah',
    name: 'Rivaah',
    image: '/tanishq/rivaah-circle.webp',
    bannerImg: '/tanishq/aura_couture_luxury.png',
    bannerTitle: 'Aura Couture Luxury Bridal Collection.',
    bannerLink: '#',
    items: [
      { name: 'All Rivaah', link: '#' },
      { name: 'Wedding Choker', link: '#' },
      { name: 'Wedding Haram', link: '#' },
      { name: 'Wedding Bangles', link: '#' },
      { name: 'Wedding Diamond', link: '#' },
      { name: 'Wedding Mangalsutra', link: '#' }
    ]
  },
  {
    id: 'gifting',
    name: 'Gifting',
    image: '/tanishq/gifting-circle.webp',
    bannerImg: '/tanishq/trending_everyday_diamonds.png',
    bannerTitle: "Celebrate life's special moments with Aura.",
    bannerLink: '#',
    items: [
      { name: 'Gifting Her', link: '#' },
      { name: 'Gifting Him', link: '#' },
      { name: 'Gifting Kids', link: '#' },
      { name: 'Aura Gift Card', link: '#' },
      { name: 'Aura E-Gift Card', link: '#' }
    ]
  },
  {
    id: 'more',
    name: 'More',
    image: '/tanishq/more-circle.webp',
    bannerImg: '/tanishq/banner_souls_in_symphony.png',
    bannerTitle: 'Explore more exclusive Aura programs.',
    bannerLink: '#',
    items: [
      { name: 'Gold Exchange Program', link: '#' },
      { name: 'KonkonKotha Collection', link: '#' },
      { name: 'Maithili Collection', link: '#' },
      { name: 'Digital Gold', link: '#' }
    ]
  }
];

function getSubcategoryIcon(name: string): string {
  const n = name.toLowerCase();
  
  // Dailywear subcategories
  if (n.includes('dailywear chains')) return '/tanishq/dailywear-chains.png';
  if (n.includes('dailywear earrings')) return '/tanishq/dailywear-earrings.png';
  if (n.includes('dailywear rings')) return '/tanishq/dailywear-rings.png';
  if (n.includes('dailywear mangalsutra')) return '/tanishq/dailywear-mangalsutra.png';
  if (n.includes('dailywear pendants')) return '/tanishq/dailywear-pendant.png';
  if (n.includes('dailywear jewellery')) return '/tanishq/dailywear-jewellery.png';
  
  // Standard categories
  if (n.includes('earring')) return '/tanishq/earrings.png';
  if (n.includes('necklace set')) return '/tanishq/necklace-set.png';
  if (n.includes('necklace')) return '/tanishq/necklaces.png';
  if (n.includes('pendant')) return '/tanishq/pendants.png';
  if (n.includes('ring')) return '/tanishq/finger-rings.png';
  if (n.includes('mangalsutra')) return '/tanishq/mangalsutra.png';
  if (n.includes('chain')) return '/tanishq/chains.png';
  if (n.includes('nose')) return '/tanishq/nosepin.png';
  if (n.includes('bangle')) return '/tanishq/bangles.png';
  if (n.includes('bracelet')) return '/tanishq/bracelets.png';
  
  // Theme highlights
  if (n.includes('gold')) return '/tanishq/gold-l1.svg';
  if (n.includes('diamond')) return '/tanishq/diamond-l1.svg';
  if (n.includes('rivaah')) return '/tanishq/wedding-l1.svg';
  if (n.includes('gift')) return '/tanishq/gifting-l1.svg';
  
  return '/tanishq/all-jewellery-l3.png';
}

export default function CategoryNav({ isTransparent = false }: CategoryNavProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeCatData = CATEGORIES.find(c => c.id === activeCategory);

  const handleMouseEnter = (catId: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveCategory(catId);
  };

  const handleMouseLeave = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 150);
  };

  const handleDropdownMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleDropdownMouseLeave = () => {
    setActiveCategory(null);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <div 
      className={`w-full transition-all duration-300 megamenu-group ${
        isTransparent 
          ? 'fixed top-[88px] sm:top-[98px] left-0 z-[1999] bg-transparent' 
          : 'relative bg-white border-b border-[#e5dcd3]'
      } ${isTransparent ? 'is-transparent' : 'is-scrolled'}`}
      onMouseLeave={() => {
        if (closeTimerRef.current) {
          clearTimeout(closeTimerRef.current);
          closeTimerRef.current = null;
        }
        setActiveCategory(null);
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 relative">
        
        {/* Horizontal Row of Aura circular categories */}
        <div className="flex justify-start md:justify-center items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-hide firstlevel-menu">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className={`cat-circle-item group ${activeCategory === cat.id ? 'cat-circle-item--active' : ''}`}
              onMouseEnter={() => handleMouseEnter(cat.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="circle-trigger">
                {/* 3D Concentric Ring Wrapper */}
                <div className="cat-circle-item__ring">
                  <div className="cat-circle-item__img">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      loading="lazy" 
                    />
                  </div>
                </div>
                
                {/* Circle Label */}
                <span className="cat-circle-item__label">
                  {cat.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Full-width Mega-Menu Dropdown Panel aligned exactly to max-w-7xl container bounds */}
        {activeCategory && activeCatData && (
          <div 
            className="absolute top-full left-0 right-0 w-full pt-1.5 z-[2100] animate-fade-in secondlevel-menu px-4 sm:px-6 lg:px-8"
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <div className="bg-white border border-[#e5dcd3] shadow-[0_20px_50px_rgba(48,7,8,0.15)] rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[380px]">
              
              {/* Left Side: Columns of Subcategories (with miniature thumbnail icons) */}
              <div className="flex-grow p-6 md:p-8">
                <h4 className="text-xs tracking-widest uppercase font-bold text-[#0F172A] border-b border-[#e5dcd3] pb-2 mb-5">
                  Shop By Category
                </h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                  {activeCatData.items.map((sub, idx) => (
                    <a 
                      key={idx}
                      href={sub.link}
                      className="flex items-center gap-3 py-1 group/item cursor-pointer text-left"
                    >
                      {/* Subcategory mini thumbnail icon */}
                      <img 
                        src={getSubcategoryIcon(sub.name)} 
                        alt="" 
                        className="h-8 w-8 object-contain rounded-full bg-[#FCFAF7] border border-[#e5dcd3]/50 p-1 transition-transform group-hover/item:scale-105" 
                        loading="lazy"
                      />
                      <span className="text-xs font-semibold text-[#0F172A]/85 group-hover/item:text-[#0F172A] tracking-wide transition-colors">
                        {sub.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Right Side: Editorial Banner Section */}
              <div className="w-full md:w-80 bg-[#FCFAF7] border-t md:border-t-0 md:border-l border-[#e5dcd3] p-6 flex flex-col justify-between right-side-category-banner-section text-left">
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-xl border border-[#e5dcd3] relative aspect-[4/3] w-full">
                    <img 
                      src={activeCatData.bannerImg} 
                      alt="" 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-sm font-serif font-bold text-[#0F172A] leading-tight">
                    {activeCatData.bannerTitle}
                  </h3>
                </div>
                
                <a 
                  href={activeCatData.bannerLink}
                  className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0F172A] hover:underline"
                >
                  Explore Now
                  <svg className="h-3 w-3 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
