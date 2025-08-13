'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoAnatomyBackgroundProps {
  videoSrc?: string;
  opacity?: number;
  className?: string;
}

export default function VideoAnatomyBackground({ 
  videoSrc = '/videos/Anatomy-Animation.mp4', 
  opacity = 0.3,
  className = ''
}: VideoAnatomyBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoad = () => {
      setIsLoaded(true);
      // Ensure video plays and loops
      video.play().catch(console.error);
    };

    const handleError = () => {
      setHasError(true);
      console.warn('Video background failed to load, falling back to static background');
    };

    video.addEventListener('loadeddata', handleLoad);
    video.addEventListener('error', handleError);

    // Preload video
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoad);
      video.removeEventListener('error', handleError);
    };
  }, [videoSrc]);

  // Fallback gradient if video fails to load
  if (hasError) {
    return (
      <div 
        className={`fixed inset-0 -z-10 ${className}`}
        style={{ 
          background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          opacity 
        }}
      />
    );
  }

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {/* Video Background */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ opacity: isLoaded ? opacity : 0 }}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={videoSrc} type="video/mp4" />
        <source src={videoSrc.replace('.mp4', '.webm')} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better text readability */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-transparent to-slate-900/40"
        style={{ zIndex: 1 }}
      />

      {/* Loading indicator */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse text-blue-400 text-sm">
            Loading anatomy visualization...
          </div>
        </div>
      )}
    </div>
  );
} 