import React from 'react';
import { Navbar } from '@/components/Landing/Navbar';
import { HeroContent } from '@/components/Landing/heroComponent';
import { HeroImage } from '@/components/Landing/heroImagen';
import { FoodCategoriesSection } from '@/components/Landing/SeccionCategorias';
import { ServicesSection } from '@/components/Landing/SeccionServicios';
import { MenuSection } from '@/components/Landing/MenuSection';
import { ReviewsSection } from '@/components/Landing/SeccionReviews';
import { SubscribeSection } from '@/components/Landing/SeccionSuscripción';
import { Footer } from '@/components/Landing/Footer';

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