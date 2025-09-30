import React from 'react';

export function FooterLinks() {
  const links = [
    { label: 'Order food', href: '#order' },
    { label: 'Reservation', href: '#reservation' },
    { label: 'Our menu', href: '#menu' },
    { label: 'Offers', href: '#offers' }
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Helpful Links
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a 
              href={link.href} 
              className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}