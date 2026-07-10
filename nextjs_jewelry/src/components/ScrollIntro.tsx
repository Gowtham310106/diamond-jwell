'use client';

import React from 'react';

export default function ScrollIntro() {
  return (
    <div className="relative w-full h-[400vh] bg-white z-1">
      
      {/* Screen 4: Image Screen 3 (Festival of Brilliance) */}
      <div 
        className="w-full h-screen flex items-center justify-center overflow-hidden sticky top-0 z-1 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/tanishq/banner_souls_in_symphony.png')" }}
      >
        <div className="absolute inset-0 bg-black/25 flex flex-col items-start justify-end text-left p-10 sm:p-16 md:p-24 text-white">
          <div className="max-w-2xl space-y-2">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-widest uppercase drop-shadow-lg leading-tight animate-fade-in-up">
              Festival of Brilliance
            </h1>
            <p className="font-sans text-xs sm:text-sm tracking-[0.3em] uppercase text-white/90 drop-shadow-md">
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
            <div className="max-w-2xl space-y-2">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-widest uppercase drop-shadow-lg leading-tight">
                Modern Origami
              </h1>
              <p className="font-sans text-xs sm:text-sm tracking-[0.3em] uppercase text-white/90 drop-shadow-md">
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
              <div className="max-w-2xl space-y-2">
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-widest uppercase drop-shadow-lg leading-tight">
                  The Diamond Edit
                </h1>
                <p className="font-sans text-xs sm:text-sm tracking-[0.3em] uppercase text-white/90 drop-shadow-md">
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
              <div className="max-w-2xl space-y-2">
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-widest uppercase drop-shadow-lg leading-tight">
                  Aura
                </h1>
                <p className="font-sans text-xs sm:text-sm tracking-[0.3em] uppercase text-white/90 drop-shadow-md">
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
