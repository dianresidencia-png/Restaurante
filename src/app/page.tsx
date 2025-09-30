import React from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroContent } from '@/components/heroComponent';
import { HeroImage } from '@/components/heroImagen';
import { FoodCategoriesSection } from '@/components/SeccionCategorias';
import { ServicesSection } from '@/components/SeccionServicios';
import { MenuSection } from '@/components/MenuSection';
import { ReviewsSection } from '@/components/SeccionReviews';
import { SubscribeSection } from '@/components/SeccionSuscripción';
import { Footer } from '@/components/Footer';

export default function FoodDeliveryHero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />
      
      <div className="container mx-auto px-6 lg:px-12 pt-12 lg:pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <HeroContent />
          <HeroImage />
        </div>
      </div>

      <FoodCategoriesSection />

      <ServicesSection />

      <MenuSection />

      <ReviewsSection />

      <SubscribeSection />

      <Footer />
    </div>
  );
}