// components/SubscribeImage.tsx
import React from 'react';

export function SubscribeImage() {
  return (
    <div className="relative h-64 lg:h-auto min-h-[400px]">
      {/* Decorative Tomatoes */}
      <div className="absolute top-8 left-12 w-16 h-16 lg:w-20 lg:h-20 z-10">
        <img 
          src="https://pngimg.com/uploads/tomato/tomato_PNG12521.png" 
          alt="Fresh tomato"
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>
      <div className="absolute top-16 left-4 w-12 h-12 lg:w-16 lg:h-16 z-10">
        <img 
          src="https://pngimg.com/uploads/tomato/tomato_PNG12521.png" 
          alt="Fresh tomato"
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>

      {/* Main Food Image */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 lg:relative lg:top-0 lg:translate-y-0 w-80 h-80 lg:w-full lg:h-full flex items-center justify-center">
        <img 
          src="https://tse4.mm.bing.net/th/id/OIP.4OD2S4lNmGGZF1xHH6mEoQHaFN?rs=1&pid=ImgDetMain&o=7&rm=3" 
          alt="Fresh healthy salad bowl with vegetables"
          className="w-full h-full object-contain drop-shadow-2xl"
        />
      </div>
    </div>
  );
}