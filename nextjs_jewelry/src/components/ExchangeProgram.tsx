'use client';

import React, { useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

export default function ExchangeProgram() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section className="py-16 bg-white text-[#0F172A] border-t border-[#e5dcd3]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Headings */}
        <div className="text-center mb-10">
          <h2 
            className="text-3xl sm:text-4xl font-semibold tracking-wide text-[#0F172A]"
            style={{ fontFamily: '"Playfair Display", "Fraunces", serif' }}
          >
            Exchange Program
          </h2>
          <p 
            className="mt-2 text-xs sm:text-sm text-[#0F172A]/60 tracking-wide font-sans"
          >
            Trusted by 2.8M+ families
          </p>
          <div className="mt-3 mx-auto h-0.5 w-16 bg-[#0EA5E9]/30 rounded-full" />
        </div>

        {/* Video Player Display Container */}
        <div className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-lg border border-[#e5dcd3] aspect-video group bg-[#FCFAF7]">
          
          <video
            ref={videoRef}
            src="/tanishq/dailywear_story.mp4"
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
          
          {/* Controls overlay */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="h-14 w-14 rounded-full bg-white/90 hover:bg-white text-[#0F172A] flex items-center justify-center transition-transform duration-300 scale-90 group-hover:scale-100 shadow-md"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 fill-[#0EA5E9]" />
              ) : (
                <Play className="h-6 w-6 fill-[#0EA5E9] ml-1" />
              )}
            </button>
          </div>

        </div>

        {/* Bottom Burgundy-Bordered Text Divider Panel */}
        <div className="mt-10 max-w-2xl mx-auto text-center px-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-[#0F172A]" />
            <img 
              src="https://www.aura.co.in/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw631366a1/homepage/diamond-logo.png" 
              alt="Assurance flower symbol" 
              className="h-4.5 w-4.5 opacity-60" 
            />
            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-[#0F172A]" />
          </div>
          <p 
            className="font-serif italic text-base sm:text-lg text-[#0F172A] leading-relaxed font-medium"
            style={{ fontFamily: '"Playfair Display", "Fraunces", serif' }}
          >
            "Trust us to be part of your precious moments and to deliver jewellery that you'll cherish forever."
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="h-[1px] w-28 bg-gradient-to-r from-transparent to-[#0F172A]/30" />
            <div className="h-[1px] w-28 bg-gradient-to-l from-transparent to-[#0F172A]/30" />
          </div>
        </div>

      </div>
    </section>
  );
}
