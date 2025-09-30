import React from 'react';

export function FooterCompany() {
  const links = [
    { label: 'Why Foodzy?', href: '#why' },
    { label: 'About us', href: '#about' },
    { label: 'Careers', href: '#careers' },
    { label: 'Privacy', href: '#privacy' }
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Company
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