// components/CategoryCard.tsx
import React from 'react';

interface CategoryCardProps {
  image: string;
  title: string;
  itemCount: number;
}

export function CategoryCard({ image, title, itemCount }: CategoryCardProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
      <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden bg-gray-100">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-center">
        {itemCount} items
      </p>
    </div>
  );
}