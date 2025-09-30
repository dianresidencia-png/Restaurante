// components/ChefImage.tsx
import React from 'react';
import { DecorativePattern } from './DecorativePattern';

export function ChefImage() {
  return (
    <div className="relative">
      {/* Orange Circle Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] bg-gradient-to-br from-orange-300 to-yellow-300 rounded-full opacity-80"></div>
      
      {/* Decorative Pattern Top Right */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-20">
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          {[0, 20, 40].map((y) => (
            [0, 20, 40].map((x) => (
              <circle key={`${x}-${y}`} cx={20 + x} cy={20 + y} r="3" fill="currentColor"/>
            ))
          ))}
        </svg>
      </div>

      {/* Chef Image */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="w-[350px] h-[350px] lg:w-[450px] lg:h-[450px] relative">
          <img 
            src="https://static.vecteezy.com/system/resources/previews/021/115/210/large_2x/cute-woman-chef-with-cake-free-png.png" 
            alt="Professional chef making OK gesture"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}