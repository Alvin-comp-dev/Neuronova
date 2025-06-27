'use client';

import { useEffect, useState } from 'react';

export default function SimpleAnatomyBackground() {
  const [highlightedPart, setHighlightedPart] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightedPart((prev) => (prev + 1) % 6);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const bodyParts = [
    { name: 'brain', color: '#ff6b6b', x: '50%', y: '15%' },
    { name: 'heart', color: '#ff4757', x: '45%', y: '35%' },
    { name: 'lungs', color: '#ffa502', x: '55%', y: '35%' },
    { name: 'liver', color: '#2ed573', x: '52%', y: '45%' },
    { name: 'kidneys', color: '#3742fa', x: '48%', y: '50%' },
    { name: 'spine', color: '#5f27cd', x: '50%', y: '40%' }
  ];

  return (
    <>
      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes anatomyFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes anatomyRotate {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }

        .anatomy-float {
          animation: anatomyFloat 6s ease-in-out infinite;
        }

        .anatomy-rotate {
          animation: anatomyRotate 30s linear infinite;
        }

        .anatomy-particle {
          animation: anatomyFloat 4s ease-in-out infinite;
        }
      `}</style>

      <div className="fixed inset-0 -z-10 overflow-hidden opacity-10 dark:opacity-20">
        {/* Animated gradient background */}
        <div 
          className="absolute inset-0 animate-pulse anatomy-float"
          style={{
            background: `
              radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)
            `
          }}
        />

        {/* Human silhouette */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative transform scale-75 md:scale-100 anatomy-rotate">
            {/* Head */}
            <div 
              className={`absolute w-16 h-16 rounded-full border-2 transition-all duration-500 ${
                highlightedPart === 0 ? 'border-red-400 shadow-lg shadow-red-400/50' : 'border-blue-300'
              }`}
              style={{ top: '0px', left: '50%', transform: 'translateX(-50%)' }}
            />

            {/* Torso */}
            <div 
              className={`absolute w-20 h-32 rounded-lg border-2 transition-all duration-500 ${
                highlightedPart === 1 ? 'border-red-400 shadow-lg shadow-red-400/50' : 'border-blue-300'
              }`}
              style={{ top: '60px', left: '50%', transform: 'translateX(-50%)' }}
            />

            {/* Arms */}
            <div 
              className={`absolute w-6 h-24 rounded-full border-2 transition-all duration-500 ${
                highlightedPart === 2 ? 'border-orange-400 shadow-lg shadow-orange-400/50' : 'border-blue-300'
              }`}
              style={{ top: '70px', left: '20%', transform: 'rotate(15deg)' }}
            />
            <div 
              className={`absolute w-6 h-24 rounded-full border-2 transition-all duration-500 ${
                highlightedPart === 2 ? 'border-orange-400 shadow-lg shadow-orange-400/50' : 'border-blue-300'
              }`}
              style={{ top: '70px', right: '20%', transform: 'rotate(-15deg)' }}
            />

            {/* Legs */}
            <div 
              className={`absolute w-8 h-32 rounded-full border-2 transition-all duration-500 ${
                highlightedPart === 3 ? 'border-green-400 shadow-lg shadow-green-400/50' : 'border-blue-300'
              }`}
              style={{ top: '180px', left: '40%' }}
            />
            <div 
              className={`absolute w-8 h-32 rounded-full border-2 transition-all duration-500 ${
                highlightedPart === 3 ? 'border-green-400 shadow-lg shadow-green-400/50' : 'border-blue-300'
              }`}
              style={{ top: '180px', right: '40%' }}
            />

            {/* Internal organs */}
            {bodyParts.map((part, index) => (
              <div
                key={part.name}
                className={`absolute w-4 h-4 rounded-full transition-all duration-500 ${
                  highlightedPart === index 
                    ? 'shadow-lg animate-ping' 
                    : 'animate-pulse'
                }`}
                style={{
                  backgroundColor: part.color,
                  left: part.x,
                  top: part.y,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: highlightedPart === index 
                    ? `0 0 20px ${part.color}` 
                    : `0 0 5px ${part.color}`
                }}
              />
            ))}

            {/* Neural network lines */}
            <svg 
              className="absolute inset-0 w-full h-full opacity-30 animate-pulse"
            >
              <defs>
                <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              
              {/* Neural connections */}
              <path
                d="M 80 30 Q 100 80 80 130 Q 60 180 80 230"
                stroke="url(#neuralGradient)"
                strokeWidth="1"
                fill="none"
                className="animate-pulse"
              />
              <path
                d="M 120 30 Q 100 80 120 130 Q 140 180 120 230"
                stroke="url(#neuralGradient)"
                strokeWidth="1"
                fill="none"
                className="animate-pulse"
                style={{ animationDelay: '1s' }}
              />
            </svg>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-50 anatomy-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
} 