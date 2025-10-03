
import React from 'react';
import { SubscribeForm } from './SubscribeForm';
import { SubscribeImage } from './SubscribeImage';

export function SubscribeSection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl lg:rounded-[3rem] overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <SubscribeForm />
            <SubscribeImage />
          </div>
        </div>
      </div>
    </section>
  );
}