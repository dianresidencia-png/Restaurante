// components/Navbar.tsx
import React from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { NavMenu } from './NavMenu';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 lg:px-12">
      <Logo />
      <NavMenu />
      <div className="flex items-center gap-3">
        <button className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center hover:bg-orange-200 transition-colors">
          <Search className="w-5 h-5 text-orange-600" />
        </button>
        <button className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center hover:bg-orange-200 transition-colors">
          <ShoppingBag className="w-5 h-5 text-orange-600" />
        </button>
        <Button variant="ghost" className="hidden md:inline-flex text-gray-700 hover:text-orange-500">
          Log in
        </Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6">
          Sign up
        </Button>
      </div>
    </nav>
  );
}