// components/HeroContent.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

export function HeroContent() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold">
          <span className="text-orange-500">Bold Flavors,</span>
          <br />
          <span className="text-gray-900">Quick Service</span>
        </h1>
      </div>

      <p className="text-gray-600 text-lg lg:text-xl max-w-md">
        Discover Fresh, Flavorful Dishes Delivered Straight To Your Door.
      </p>

      <div className="flex flex-wrap gap-4 pt-4">
        <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-6 text-lg font-medium">
          Order Now
        </Button>
        <Button variant="ghost" className="text-gray-900 hover:text-orange-500 rounded-full px-8 py-6 text-lg font-medium flex items-center gap-2">
          Order Guide
          <Play className="w-5 h-5 fill-current" />
        </Button>
      </div>
    </div>
  );
}