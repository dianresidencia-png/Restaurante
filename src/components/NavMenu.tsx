// components/NavMenu.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

export function NavMenu() {
  return (
    <div className="hidden md:flex items-center gap-8">
      <a href="#" className="text-gray-900 font-medium hover:text-orange-500 transition-colors">
        Home
      </a>
      <button className="text-gray-700 font-medium hover:text-orange-500 transition-colors flex items-center gap-1">
        Menu
        <ChevronDown className="w-4 h-4" />
      </button>
      <button className="text-gray-700 font-medium hover:text-orange-500 transition-colors flex items-center gap-1">
        Services
        <ChevronDown className="w-4 h-4" />
      </button>
      <a href="#" className="text-gray-700 font-medium hover:text-orange-500 transition-colors">
        Offers
      </a>
    </div>
  );
}