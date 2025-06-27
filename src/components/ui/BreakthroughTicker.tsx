'use client';

import { useState, useEffect } from 'react';

interface BreakthroughItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
}

export default function BreakthroughTicker() {
  const [breakthroughs, setBreakthroughs] = useState<BreakthroughItem[]>([]);

  const mockBreakthroughs: BreakthroughItem[] = [
    {
      id: '1',
      title: 'CRISPR breakthrough enables precise gene editing in brain cells',
      source: 'Nature',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      title: 'AI system detects early-stage Alzheimer\'s with 94% accuracy',
      source: 'Science',
      timestamp: '4 hours ago'
    },
    {
      id: '3',
      title: 'New neural implant restores speech in paralyzed patients',
      source: 'Cell',
      timestamp: '6 hours ago'
    },
    {
      id: '4',
      title: 'Breakthrough drug shows promise for treating depression in 48 hours',
      source: 'The Lancet',
      timestamp: '8 hours ago'
    },
    {
      id: '5',
      title: 'Revolutionary brain-computer interface enables thought-to-text typing',
      source: 'Nature Neuroscience',
      timestamp: '12 hours ago'
    },
    {
      id: '6',
      title: 'Gene therapy trial successfully treats inherited blindness',
      source: 'NEJM',
      timestamp: '1 day ago'
    },
    {
      id: '7',
      title: 'AI discovers new antibiotic effective against drug-resistant bacteria',
      source: 'Science Translational Medicine',
      timestamp: '1 day ago'
    }
  ];

  useEffect(() => {
    setBreakthroughs(mockBreakthroughs);
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes ticker-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .ticker-animate {
          animation: ticker-scroll 60s linear infinite;
        }
        
        .ticker-animate:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="bg-blue-900/90 backdrop-blur-sm border-y border-blue-400/30 py-3 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-blue-900/90 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-blue-900/90 to-transparent z-10"></div>
        
        <div className="flex items-center">
          <div className="flex-shrink-0 px-6">
            <span className="text-blue-200 font-semibold text-sm uppercase tracking-wide">
              🔬 Latest Breakthroughs
            </span>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <div className="flex ticker-animate">
              {[...breakthroughs, ...breakthroughs].map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex-shrink-0 flex items-center mx-8"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">
                      {item.title}
                    </span>
                    <span className="text-blue-300 text-xs">
                      — {item.source}
                    </span>
                    <span className="text-blue-400 text-xs">
                      {item.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 