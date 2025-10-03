// components/MenuSection.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { MenuItemCard } from '../../app/Menu/components/MenuItemCard';

export const MENU_ITEMS = [
  {
    id: 1,
    image: "https://tse1.mm.bing.net/th/id/OIP.A3yzbENzWOowasNJAyjjPQHaFZ?rs=1&pid=ImgDetMain&o=7&rm=3",
    title: "Chicken Wrap",
    description: "Juicy chicken wrapped with fresh veggies, savory sauces...",
    price: 11.30,
    rating: 4.5,
    category: "main-dishes"
  },
  {
    id: 2,
    image: "https://th.bing.com/th/id/R.9cf11973379fd40833ce431fbdcd51e9?rik=YNk6nJe8sSR29g&pid=ImgRaw&r=0",
    title: "Fresh Lemonade",
    description: "Fresh lemonade with a perfect balance of tangy le...",
    price: 6.00,
    rating: 4.5,
    category: "beverages"
  },
  {
    id: 3,
    image: "https://tse3.mm.bing.net/th/id/OIP.8_4HgagDrrwSmRFWYJbRPQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3",
    title: "Fattoush Salad",
    description: "Crisp veggies, tangy dressing, pita crisps, Mediterranean fl...",
    price: 10.00,
    rating: 5.0,
    category: "salads"
  }
] as const;


export function MenuSection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-orange-500 font-semibold text-lg mb-2">
              Our Menu
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Must-Try Dishes for You
            </h2>
          </div>
          
          <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-6 text-lg font-medium hidden md:flex">
            View All
          </Button>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {MENU_ITEMS.map((item) => (
            <MenuItemCard
              key={item.id}
              image={item.image}
              title={item.title}
              description={item.description}
              price={item.price}
              rating={item.rating}
            />
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="flex justify-center mt-8 md:hidden">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-6 text-lg font-medium">
            View All
          </Button>
        </div>
      </div>
    </section>
  );
}