import React from 'react';

export function DecorativePattern() {
  return (
    <div className="absolute top-10 left-10 w-32 h-32 opacity-10">
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
        {[0, 20, 40, 60, 80].map((y) => (
          [10, 30, 50, 70, 90].map((x) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="currentColor"/>
          ))
        ))}
      </svg>
    </div>
  );
}