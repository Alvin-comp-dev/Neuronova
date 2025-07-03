'use client';

import { useEffect } from 'react';

interface PerformanceMetrics {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

// Core Web Vitals thresholds
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

function reportMetric(metric: PerformanceMetrics) {
  // Only log in development or when explicitly enabled
  if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENABLE_PERF_MONITORING === 'true') {
    console.log(`%c[Performance] ${metric.name}: ${metric.value}ms (${metric.rating})`, 
      `color: ${metric.rating === 'good' ? 'green' : metric.rating === 'needs-improvement' ? 'orange' : 'red'}`
    );
  }
  
  // Store metrics for analytics (if needed)
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = JSON.parse(localStorage.getItem('neuronova-perf-metrics') || '[]');
      stored.push({
        ...metric,
        timestamp: Date.now(),
        url: window.location.pathname,
      });
      // Keep only last 50 metrics
      if (stored.length > 50) stored.splice(0, stored.length - 50);
      localStorage.setItem('neuronova-perf-metrics', JSON.stringify(stored));
    } catch (e) {
      // Ignore storage errors
    }
  }
}

export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Track Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const metric: PerformanceMetrics = {
          name: entry.name,
          value: Math.round(entry.value),
          rating: getRating(entry.name, entry.value),
        };
        reportMetric(metric);
      }
    });

    // Observe different performance metrics
    try {
      observer.observe({ entryTypes: ['paint', 'navigation', 'measure'] });
    } catch (e) {
      // Fallback for older browsers
      console.warn('Performance Observer not fully supported');
    }

    // Track page load time
    const trackPageLoad = () => {
      if (document.readyState === 'complete') {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        reportMetric({
          name: 'Page Load',
          value: loadTime,
          rating: getRating('LCP', loadTime),
        });
      }
    };

    if (document.readyState === 'complete') {
      trackPageLoad();
    } else {
      window.addEventListener('load', trackPageLoad);
    }

    // Track route changes (for SPA navigation)
    let startTime = performance.now();
    const trackRouteChange = () => {
      const navigationTime = performance.now() - startTime;
      reportMetric({
        name: 'Route Change',
        value: Math.round(navigationTime),
        rating: navigationTime < 500 ? 'good' : navigationTime < 1000 ? 'needs-improvement' : 'poor',
      });
      startTime = performance.now();
    };

    // Listen for Next.js route changes
    const handleRouteChangeStart = () => {
      startTime = performance.now();
    };

    const handleRouteChangeComplete = () => {
      trackRouteChange();
    };

    // Add event listeners for Next.js router events
    if (typeof window !== 'undefined' && (window as any).next?.router) {
      (window as any).next.router.events.on('routeChangeStart', handleRouteChangeStart);
      (window as any).next.router.events.on('routeChangeComplete', handleRouteChangeComplete);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('load', trackPageLoad);
      if (typeof window !== 'undefined' && (window as any).next?.router) {
        (window as any).next.router.events.off('routeChangeStart', handleRouteChangeStart);
        (window as any).next.router.events.off('routeChangeComplete', handleRouteChangeComplete);
      }
    };
  }, []);

  // Return null - this is a monitoring component that doesn't render anything
  return null;
}

// Export utility function to get performance metrics
export function getPerformanceMetrics(): PerformanceMetrics[] {
  if (typeof window === 'undefined') return [];
  
  try {
    return JSON.parse(localStorage.getItem('neuronova-perf-metrics') || '[]');
  } catch (e) {
    return [];
  }
}

// Export utility function to clear performance metrics
export function clearPerformanceMetrics(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('neuronova-perf-metrics');
  }
} 