import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
}

export function StarRating({ rating, maxStars = 5 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(maxStars)].map((_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${
            index < Math.floor(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : index < rating
              ? 'fill-yellow-400 text-yellow-400 opacity-50'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}