import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export function FooterContact() {
  const contactInfo = [
    {
      icon: Mail,
      text: 'admin@foodzy.com',
      href: 'mailto:admin@foodzy.com'
    },
    {
      icon: Phone,
      text: '+112 345 679 201',
      href: 'tel:+112345679201'
    },
    {
      icon: MapPin,
      text: '12 Avenue, Suite 567, Gourmet City',
      href: null
    }
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Contact Us
      </h3>
      <ul className="space-y-3">
        {contactInfo.map((item, index) => {
          const Icon = item.icon;
          const content = (
            <>
              <Icon className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <span>{item.text}</span>
            </>
          );

          if (item.href) {
            return (
              <li key={index}>
                <a 
                  href={item.href}
                  className="flex items-start gap-2 text-gray-600 hover:text-orange-500 transition-colors text-sm"
                >
                  {content}
                </a>
              </li>
            );
          }

          return (
            <li key={index} className="flex items-start gap-2 text-gray-600 text-sm">
              {content}
            </li>
          );
        })}
      </ul>
    </div>
  );
}