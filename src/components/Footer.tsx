
import React from 'react';
import { FooterBrand } from './FooterBrand';
import { FooterLinks } from './FooterLinks';
import { FooterContact } from './FooterContact';
import { FooterCompany } from './FooterCompany';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 pt-16 pb-8">
      <div className="container mx-auto px-6 lg:px-12">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-12">
          <FooterBrand />
          <FooterLinks />
          <FooterCompany />
          <FooterContact />
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-center text-gray-500 text-sm">
            © by team 3
          </p>
        </div>
      </div>
    </footer>
  );
}