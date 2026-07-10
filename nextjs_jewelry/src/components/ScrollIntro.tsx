'use client';

import React, { useState, useEffect } from 'react';

export default function ScrollIntro() {
  const [activeScreen, setActiveScreen] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      const container = document.querySelector('.scroll-intro-container');
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const scrolledInto = -rect.top; // how far container top is past viewport top
      
      if (scrolledInto < vh) {
        setActiveScreen(1);
      } else if (scrolledInto >= vh && scrolledInto < vh * 2) {
        setActiveScreen(2);
      } else if (scrolledInto >= vh * 2 && scrolledInto < vh * 3) {
        setActiveScreen(3);
      } else {
        setActiveScreen(4);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full h-[400vh] bg-white z-1 scroll-intro-container">
      
      {/* Screen 4: Image Screen 3 (Festival of Brilliance) */}
      <div 
        className="w-full h-screen flex items-center justify-center overflow-hidden sticky top-0 z-1 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/tanishq/banner_souls_in_symphony.png')" }}
      >
        <div className="absolute inset-0 bg-black/25 flex flex-col items-start justify-end text-left p-10 sm:p-16 md:p-24 text-white">
          <div className={`max-w-2xl space-y-2 transition-all duration-[800ms] ease-out transform ${
            activeScreen === 4 
              ? 'opacity-100 translate-y-0 filter blur-0' 
              : 'opacity-0 translate-y-8 filter blur-[2px]'
          }`}>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-widest uppercase drop-shadow-lg leading-tight transition-all duration-[800ms]">
              Festival of Brilliance
            </h1>
            <p className="font-sans text-xs sm:text-sm tracking-[0.3em] uppercase text-white/90 drop-shadow-md transition-all duration-[800ms] delay-150">
              Celebrate Special Moments with Aura
            </p>
          </div>
        </div>
      </div>
      
      {/* Stacking Container 3 */}
      <div className="absolute top-0 left-0 w-full h-[300vh] z-2">
        {/* Screen 3: Video Screen (Modern Origami) */}
        <div className="w-full h-screen flex items-center justify-center overflow-hidden sticky top-0 z-2">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src="/High_fashion_macro_slow_motio.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/30 flex flex-col items-start justify-end text-left p-10 sm:p-16 md:p-24 text-white">
            <div className={`max-w-2xl space-y-2 transition-all duration-[800ms] ease-out transform ${
              activeScreen === 3 
                ? 'opacity-100 translate-y-0 filter blur-0' 
                : 'opacity-0 translate-y-8 filter blur-[2px]'
            }`}>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-widest uppercase drop-shadow-lg leading-tight transition-all duration-[800ms]">
                Modern Origami
              </h1>
              <p className="font-sans text-xs sm:text-sm tracking-[0.3em] uppercase text-white/90 drop-shadow-md transition-all duration-[800ms] delay-150">
                Contemporary Designs Crafted in Gold
              </p>
            </div>
          </div>
        </div>
        
        {/* Stacking Container 2 */}
        <div className="absolute top-0 left-0 w-full h-[200vh] z-3">
          {/* Screen 2: Video Screen (The Diamond Edit) */}
          <div className="w-full h-screen flex items-center justify-center overflow-hidden sticky top-0 z-3">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-full object-cover"
            >
              <source src="/tanishq/diamonds_main.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/30 flex flex-col items-start justify-end text-left p-10 sm:p-16 md:p-24 text-white">
              <div className={`max-w-2xl space-y-2 transition-all duration-[800ms] ease-out transform ${
                activeScreen === 2 
                  ? 'opacity-100 translate-y-0 filter blur-0' 
                  : 'opacity-0 translate-y-8 filter blur-[2px]'
              }`}>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-widest uppercase drop-shadow-lg leading-tight transition-all duration-[800ms]">
                  The Diamond Edit
                </h1>
                <p className="font-sans text-xs sm:text-sm tracking-[0.3em] uppercase text-white/90 drop-shadow-md transition-all duration-[800ms] delay-150">
                  Discover Brilliance For Every Moment
                </p>
              </div>
            </div>
          </div>
          
          {/* Screen 1: Video Screen */}
          <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center overflow-hidden z-4">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-full object-cover"
            >
              <source src="/Cinematic_close_up_of_a_magnif.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/30 flex flex-col items-start justify-end text-left p-10 sm:p-16 md:p-24 text-white">
              <div className={`max-w-2xl space-y-2 transition-all duration-[800ms] ease-out transform ${
                activeScreen === 1 
                  ? 'opacity-100 translate-y-0 filter blur-0' 
                  : 'opacity-0 translate-y-8 filter blur-[2px]'
              }`}>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-widest uppercase drop-shadow-lg leading-tight transition-all duration-[800ms]">
                  Aura
                </h1>
                <p className="font-sans text-xs sm:text-sm tracking-[0.3em] uppercase text-white/90 drop-shadow-md transition-all duration-[800ms] delay-150">
                  Purity &amp; Eternal Elegance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
