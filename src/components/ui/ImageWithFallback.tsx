'use client';

import React, { useState } from 'react';
import { User, FileText, Video, Headphones, Book, Link, Microscope } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackType?: 'user' | 'article' | 'video' | 'podcast' | 'document' | 'tool' | 'dataset';
  width?: number;
  height?: number;
}

export default function ImageWithFallback({ 
  src, 
  alt, 
  className = '', 
  fallbackType = 'article',
  width,
  height 
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getFallbackIcon = () => {
    const iconClass = "h-8 w-8 text-slate-400";
    switch (fallbackType) {
      case 'user':
        return <User className={iconClass} />;
      case 'video':
        return <Video className={iconClass} />;
      case 'podcast':
        return <Headphones className={iconClass} />;
      case 'document':
        return <Book className={iconClass} />;
      case 'tool':
        return <Link className={iconClass} />;
      case 'dataset':
        return <Microscope className={iconClass} />;
      default:
        return <FileText className={iconClass} />;
    }
  };

  const getFallbackGradient = () => {
    switch (fallbackType) {
      case 'user':
        return 'from-blue-500/20 to-purple-500/20';
      case 'video':
        return 'from-red-500/20 to-pink-500/20';
      case 'podcast':
        return 'from-green-500/20 to-emerald-500/20';
      case 'document':
        return 'from-amber-500/20 to-orange-500/20';
      case 'tool':
        return 'from-cyan-500/20 to-blue-500/20';
      case 'dataset':
        return 'from-purple-500/20 to-violet-500/20';
      default:
        return 'from-slate-500/20 to-slate-600/20';
    }
  };

  if (imageError || !src) {
    return (
      <div 
        className={`bg-gradient-to-br ${getFallbackGradient()} flex items-center justify-center border border-slate-600/20 ${className}`}
        style={{ width, height }}
      >
        {getFallbackIcon()}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {imageLoading && (
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${getFallbackGradient()} flex items-center justify-center border border-slate-600/20 animate-pulse`}
        >
          {getFallbackIcon()}
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
        style={{ width, height }}
      />
    </div>
  );
} 