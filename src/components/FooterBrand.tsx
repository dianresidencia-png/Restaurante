import React from 'react';
import { Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';

export function FooterBrand() {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: MessageCircle, href: '#', label: 'WhatsApp' }
  ];

  return (
    <div className="space-y-4">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 0 0 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
          </svg>
        </div>
        <span className="text-xl font-bold text-gray-900">Foodzy</span>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
        Discover fresh, flavorful dishes delivered straight to your door.
      </p>

      {/* Social Icons */}
      <div className="flex items-center gap-3">
        {socialLinks.map((social) => {
          const Icon = social.icon;
          return (
            <a 
              key={social.label}
              href={social.href} 
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-orange-100 transition-colors shadow-sm"
              aria-label={social.label}
            >
              <Icon className="w-5 h-5 text-gray-700" />
            </a>
          );
        })}
      </div>
    </div>
  );
}