import React from 'react';

export function SpeechBubble() {
  return (
    <div className="absolute top-20 left-1/4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2 z-10">
      <span className="text-gray-900 font-medium">This Plate Speaks!</span>
      <span className="text-orange-500">🧡</span>
    </div>
  );
}