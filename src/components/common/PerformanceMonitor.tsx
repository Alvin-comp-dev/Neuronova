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

    let observer: PerformanceObserver | null = null;

    try {
      // Track Core Web Vitals
      observer = new PerformanceObserver((list) => {
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
      observer.observe({ entryTypes: ['paint', 'navigation', 'measure'] });
    } catch (e) {
      // Fallback for older browsers
      console.warn('Performance Observer not fully supported:', e);
    }

    // Track page load time
    const trackPageLoad = () => {
      try {
        if (document.readyState === 'complete') {
          const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
          reportMetric({
            name: 'Page Load',
            value: loadTime,
            rating: getRating('LCP', loadTime),
          });
        }
      } catch (e) {
        console.warn('Failed to track page load time:', e);
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
      try {
        const navigationTime = performance.now() - startTime;
        reportMetric({
          name: 'Route Change',
          value: Math.round(navigationTime),
          rating: navigationTime < 500 ? 'good' : navigationTime < 1000 ? 'needs-improvement' : 'poor',
        });
        startTime = performance.now();
      } catch (e) {
        console.warn('Failed to track route change:', e);
      }
    };

    // Listen for Next.js route changes
    const handleRouteChangeStart = () => {
      startTime = performance.now();
    };

    const handleRouteChangeComplete = () => {
      trackRouteChange();
    };

    // Safely check for Next.js router events
    let routerEvents: any = null;
    try {
      // Check for Next.js router in different possible locations
      if (typeof window !== 'undefined') {
        const nextRouter = (window as any).next?.router || (window as any).__NEXT_ROUTER__;
        if (nextRouter && nextRouter.events && typeof nextRouter.events.on === 'function') {
          routerEvents = nextRouter.events;
          routerEvents.on('routeChangeStart', handleRouteChangeStart);
          routerEvents.on('routeChangeComplete', handleRouteChangeComplete);
        }
      }
    } catch (e) {
      // Router events not available, continue without them
      console.warn('Next.js router events not available:', e);
    }

    return () => {
      try {
        if (observer) {
          observer.disconnect();
        }
        window.removeEventListener('load', trackPageLoad);
        
        if (routerEvents && typeof routerEvents.off === 'function') {
          routerEvents.off('routeChangeStart', handleRouteChangeStart);
          routerEvents.off('routeChangeComplete', handleRouteChangeComplete);
        }
      } catch (e) {
        console.warn('Cleanup error in PerformanceMonitor:', e);
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