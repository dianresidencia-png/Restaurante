"use client"
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { StarRating } from './StarRating';

interface MenuItemCardProps {
  image: string;
  title: string;
  description: string;
  price: number;
  rating: number;
}


export function MenuItemCard({ image, title, description, price, rating }: MenuItemCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
      <div className="relative mb-6">
        <div className="w-full h-48 rounded-2xl  flex items-center justify-center">
          <img 
            src={image} 
            alt={title}
            className="w-44 h-44 object-contain rounded-full"
          />
        </div>
        
        <button 
          onClick={toggleFavorite}
          className={`absolute top-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            isFavorite 
              ? 'bg-orange-500 hover:bg-orange-600' 
              : 'bg-orange-100 hover:bg-orange-200'
          }`}
          aria-label="Add to favorites"
        >
          <Heart 
            className={`w-5 h-5 transition-all ${
              isFavorite 
                ? 'text-white fill-white' 
                : 'text-orange-500'
            }`}
          />
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-900">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold text-gray-900">
            ${price.toFixed(2)}
          </span>
          
          <StarRating rating={rating} />
        </div>
      </div>
    </div>
  );
}