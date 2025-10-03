import React from 'react';
import { ChefImage } from './ChefImage';
import { ServicesContent } from './ServicesContent';

export function ServicesSection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <ChefImage />
          <ServicesContent />
        </div>
      </div>
    </section>
  );
}