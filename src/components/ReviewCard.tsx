import React from 'react';
import { Star } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  image: string;
  rating: number;
  comment: string;
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm h-full">
      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-6">
        {/* Avatar with Badge */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md">
            <img 
              src={review.image} 
              alt={review.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Verified Badge */}
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Name and Rating */}
        <div className="flex-1">
          <h4 className="text-lg font-bold text-gray-900 mb-1">
            {review.name}
          </h4>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`w-4 h-4 ${
                  index < review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Comment */}
      <p className="text-gray-600 leading-relaxed">
        {review.comment}
      </p>
    </div>
  );
}