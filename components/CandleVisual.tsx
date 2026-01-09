
import React, { useState, useEffect } from 'react';

const CandleVisual: React.FC = () => {
  const [intensity, setIntensity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setIntensity(0.8 + Math.random() * 0.4);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center h-48 w-48">
      {/* Flame */}
      <div 
        className="absolute top-0 w-8 h-12 bg-amber-400 rounded-full blur-sm transition-all duration-150"
        style={{ 
          transform: `scale(${intensity})`,
          opacity: 0.8 + intensity * 0.2,
          boxShadow: `0 0 ${20 * intensity}px ${10 * intensity}px rgba(251, 191, 36, 0.6)`
        }}
      />
      <div className="absolute top-2 w-4 h-8 bg-amber-200 rounded-full" />
      
      {/* Wick */}
      <div className="absolute top-10 w-1 h-3 bg-gray-800" />
      
      {/* Candle Body */}
      <div className="absolute top-12 w-12 h-24 bg-orange-50 rounded-sm border-b-4 border-orange-100" />
      
      {/* Light Reflection on "Pūrs" (Abstract base) */}
      <div className="absolute bottom-0 w-32 h-4 bg-amber-900/30 blur-md rounded-full" />
    </div>
  );
};

export default CandleVisual;
