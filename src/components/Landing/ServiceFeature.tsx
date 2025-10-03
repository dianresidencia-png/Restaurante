
import React from 'react';

interface ServiceFeatureProps {
  icon: React.ReactNode;
  title: string;
}

export function ServiceFeature({ icon, title }: ServiceFeatureProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-500">
        {icon}
      </div>
      <span className="text-gray-700 font-medium">{title}</span>
    </div>
  );
}