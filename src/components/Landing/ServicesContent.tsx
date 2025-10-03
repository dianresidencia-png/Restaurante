import React from 'react';
import { ShoppingCart, Clock, Calendar, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServiceFeature } from './ServiceFeature';

export function ServicesContent() {
  const features = [
    { icon: <ShoppingCart className="w-5 h-5" />, title: "Online Order" },
    { icon: <Clock className="w-5 h-5" />, title: "24/7 Service" },
    { icon: <Calendar className="w-5 h-5" />, title: "Pre-reservation" },
    { icon: <ChefHat className="w-5 h-5" />, title: "Super Chefs" }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-orange-500 font-semibold text-lg">
          Our Services
        </p>
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
          Healthy & Delicious Eats!
        </h2>
      </div>

      <p className="text-gray-600 text-lg leading-relaxed">
        We are dedicated to bringing you a wide variety of delicious and wholesome meals, designed to satisfy your cravings without compromising your health. Our menu is thoughtfully crafted to provide the perfect balance of rich flavor and nutrition.
      </p>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {features.map((feature, index) => (
          <ServiceFeature
            key={index}
            icon={feature.icon}
            title={feature.title}
          />
        ))}
      </div>

      {/* CTA Button */}
      <div className="pt-6">
        <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-6 text-lg font-medium">
          Learn More
        </Button>
      </div>
    </div>
  );
}