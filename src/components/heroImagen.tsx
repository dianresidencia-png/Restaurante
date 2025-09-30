// components/HeroImage.tsx
import React from 'react';
import { SpeechBubble } from './SpeechBubble';
import { DecorativePattern } from './DecorativePattern';

export function HeroImage() {
  return (
    <div className="relative">
      {/* Orange Circle Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] lg:w-[600px] lg:h-[600px] bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full opacity-90"></div>
      
      <DecorativePattern />
      <SpeechBubble />

      <div className="relative z-10 flex items-center justify-center pt-8">
        <div className="w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src="/plato2.png" 
              alt="Plato de comida"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}