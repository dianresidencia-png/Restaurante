"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReviewCard } from './ReviewCard';

export const CUSTOMER_REVIEWS = [
  {
    id: 1,
    name: "Darya Toulani",
    image: "/images/customer-1.jpg",
    rating: 5,
    comment: "Foodzy makes eating healthy so easy and enjoyable. The meals are crafted with such care, you can taste the freshness in every bite. It's rare to find such a perfect balance of flavor and nutrition. I genuinely look forward to every order!"
  },
  {
    id: 2,
    name: "Reza Madad",
    image: "/images/customer-2.jpg",
    rating: 5,
    comment: "The flavors are unmatched, and the convenience of ordering is a game-changer. The food always arrives fresh, hot, and perfectly presented. It's like having a gourmet chef at home."
  },
  {
    id: 3,
    name: "Alex Sandros",
    image: "/images/customer-3.jpg",
    rating: 5,
    comment: "Fresh ingredients, quick service, and meals every time. Whether I'm craving something hearty or light, Foodzy's menu keeps surprising me with options. It's my first choice for any meal!"
  }
] as const;

export function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CUSTOMER_REVIEWS.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const nextSlide = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % CUSTOMER_REVIEWS.length);
  };

  const prevSlide = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + CUSTOMER_REVIEWS.length) % CUSTOMER_REVIEWS.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlay(false);
    setCurrentIndex(index);
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <p className="text-orange-500 font-semibold text-lg mb-2">
            Our Reviews
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            What Our Customers Say
          </h2>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / 3)}%)` 
              }}
            >
              {CUSTOMER_REVIEWS.map((review) => (
                <div 
                  key={review.id} 
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg hover:bg-orange-50 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          
          <button
            onClick={nextSlide}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg hover:bg-orange-50 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          <div className="flex justify-center gap-2 mt-8">
            {CUSTOMER_REVIEWS.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-orange-500 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}