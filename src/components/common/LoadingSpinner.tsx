'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const colorClasses = {
  primary: 'text-blue-600 dark:text-blue-400',
  secondary: 'text-gray-600 dark:text-gray-400',
  white: 'text-white',
  gray: 'text-gray-400',
};

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'spinner', 
  color = 'primary',
  className,
  text 
}: LoadingSpinnerProps) {
  const baseClasses = cn(
    sizeClasses[size],
    colorClasses[color],
    className
  );

  const renderSpinner = () => {
    switch (variant) {
      case 'spinner':
        return (
          <svg
            className={cn(baseClasses, 'animate-spin')}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );

      case 'dots':
        return (
          <div className={cn('flex space-x-1', className)}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'rounded-full bg-current animate-pulse',
                  size === 'sm' ? 'w-1 h-1' : 
                  size === 'md' ? 'w-2 h-2' :
                  size === 'lg' ? 'w-3 h-3' : 'w-4 h-4',
                  colorClasses[color]
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.4s',
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div
            className={cn(
              baseClasses,
              'rounded-full bg-current animate-pulse'
            )}
          />
        );

      case 'bars':
        return (
          <div className={cn('flex space-x-1', className)}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'bg-current animate-pulse',
                  size === 'sm' ? 'w-1 h-3' : 
                  size === 'md' ? 'w-1 h-4' :
                  size === 'lg' ? 'w-2 h-6' : 'w-2 h-8',
                  colorClasses[color]
                )}
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '1.2s',
                }}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (text) {
    return (
      <div className={cn('flex items-center space-x-3', className)}>
        {renderSpinner()}
        <span className={cn('text-sm font-medium', colorClasses[color])}>
          {text}
        </span>
      </div>
    );
  }

  return renderSpinner();
}

// Skeleton loading component
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({ 
  className, 
  variant = 'text', 
  width, 
  height, 
  lines = 1 
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded';
      case 'text':
      default:
        return 'rounded';
    }
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1rem' : undefined),
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(baseClasses, getVariantClasses())}
            style={{
              ...style,
              width: i === lines - 1 ? '75%' : '100%',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, getVariantClasses(), className)}
      style={style}
    />
  );
}

// Page loading component
interface PageLoadingProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
}

export function PageLoading({ 
  message = 'Loading...', 
  showProgress = false, 
  progress = 0 
}: PageLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <LoadingSpinner size="xl" className="mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {message}
        </p>
        
        {showProgress && (
          <div className="w-64 mx-auto">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Button loading state
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function LoadingButton({ 
  loading = false, 
  loadingText, 
  children, 
  disabled,
  className,
  ...props 
}: LoadingButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'relative inline-flex items-center justify-center',
        loading && 'cursor-not-allowed',
        className
      )}
    >
      {loading && (
        <LoadingSpinner 
          size="sm" 
          color="white" 
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" 
        />
      )}
      <span className={cn(loading && 'opacity-0')}>
        {loading && loadingText ? loadingText : children}
      </span>
    </button>
  );
} 