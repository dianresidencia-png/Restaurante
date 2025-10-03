import React from 'react';

interface SectionHeaderProps {
  subtitle: string;
  title: string;
}

export function SectionHeader({ subtitle, title }: SectionHeaderProps) {
  return (
    <div className="text-center mb-12">
      <p className="text-orange-500 font-semibold text-lg mb-2">
        {subtitle}
      </p>
      <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
        {title}
      </h2>
    </div>
  );
}