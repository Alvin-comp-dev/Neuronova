'use client';

import { useEffect, useRef, useState } from 'react';
import AnatomyBackground from './AnatomyBackground';
import VideoAnatomyBackground from './VideoAnatomyBackground';

type BackgroundType = 'video' | '3d' | 'gradient' | 'auto';

interface DynamicBackgroundProps {
  type?: BackgroundType;
  videoSrc?: string;
  opacity?: number;
  className?: string;
  enableUserChoice?: boolean;
}

export default function DynamicBackground({ 
  type = 'auto',
  videoSrc = '/videos/Anatomy-Animation.mp4',
  opacity = 0.3,
  className = '',
  enableUserChoice = true
}: DynamicBackgroundProps) {
  const [backgroundType, setBackgroundType] = useState<BackgroundType>(type);
  const [showControls, setShowControls] = useState(false);
  const [videoAvailable, setVideoAvailable] = useState(false);

  // Check if video file exists
  useEffect(() => {
    if (type === 'auto') {
      // Check if video exists
      console.log('🎥 Checking video availability at:', videoSrc);
      fetch(videoSrc, { method: 'HEAD' })
        .then(response => {
          console.log('🎥 Video check response:', response.status, response.ok);
          if (response.ok) {
            setVideoAvailable(true);
            setBackgroundType('video');
            console.log('🎥 Video available, setting background to video');
          } else {
            setVideoAvailable(false);
            setBackgroundType('3d');
            console.log('🎥 Video not available, setting background to 3d');
          }
        })
        .catch((error) => {
          console.log('🎥 Video check failed:', error);
          setVideoAvailable(false);
          setBackgroundType('3d');
        });
    } else {
      setBackgroundType(type);
      // For non-auto types, assume video is available if type is 'video'
      if (type === 'video') {
        setVideoAvailable(true);
      }
    }
  }, [type, videoSrc]);

  // Load user preference from localStorage
  useEffect(() => {
    if (enableUserChoice) {
      const saved = localStorage.getItem('neuronova-background-type');
      if (saved && ['video', '3d', 'gradient'].includes(saved)) {
        setBackgroundType(saved as BackgroundType);
      }
    }
  }, [enableUserChoice]);

  // Save user preference
  const changeBackground = (newType: BackgroundType) => {
    console.log('🎨 Changing background from', backgroundType, 'to', newType);
    setBackgroundType(newType);
    if (enableUserChoice) {
      localStorage.setItem('neuronova-background-type', newType);
      console.log('🎨 Background preference saved to localStorage:', newType);
    }
  };

  const renderBackground = () => {
    // Ensure only one background is active at a time
    console.log('🎨 Rendering background type:', backgroundType);
    return (
      <div className="fixed inset-0 -z-10">
        {backgroundType === 'video' && (
          <VideoAnatomyBackground key="video" videoSrc={videoSrc} opacity={opacity} className={className} />
        )}
        {backgroundType === '3d' && (
          <AnatomyBackground key="3d" />
        )}
        {backgroundType === 'gradient' && (
          <div 
            key="gradient"
            className={`fixed inset-0 -z-10 ${className}`}
            style={{ 
              background: `
                radial-gradient(ellipse at top left, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%)
              `,
              opacity 
            }}
          />
        )}
      </div>
    );
  };

  return (
    <>
      {renderBackground()}
      
      {/* Background Controls */}
      {enableUserChoice && (
        <div className="fixed bottom-4 right-4 z-50">
          <div 
            className={`bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-700 transition-all duration-300 ${
              showControls ? 'p-4 opacity-100' : 'p-2 opacity-60 hover:opacity-100'
            }`}
          >
            {/* Toggle Button */}
            <button
              onClick={() => setShowControls(!showControls)}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              title="Background Settings"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {!showControls && <span className="text-xs">BG</span>}
            </button>

            {/* Controls Panel */}
            {showControls && (
              <div className="mt-3 space-y-2">
                <div className="text-xs text-slate-400 font-medium mb-2">
                  Background Style 
                  <span className="text-slate-500 ml-1">
                    ({backgroundType} - Video: {videoAvailable ? 'Yes' : 'No'})
                  </span>
                </div>
                
                <button
                  onClick={() => changeBackground('video')}
                  className={`w-full text-left px-3 py-2 rounded text-xs transition-colors ${
                    backgroundType === 'video' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  🎥 Video Animation {!videoAvailable && '(Loading...)'}
                </button>
                
                <button
                  onClick={() => changeBackground('3d')}
                  className={`w-full text-left px-3 py-2 rounded text-xs transition-colors ${
                    backgroundType === '3d' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  🧠 3D Interactive
                </button>
                
                <button
                  onClick={() => changeBackground('gradient')}
                  className={`w-full text-left px-3 py-2 rounded text-xs transition-colors ${
                    backgroundType === 'gradient' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  🌈 Gradient Only
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
} 