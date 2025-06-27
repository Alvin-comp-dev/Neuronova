// Performance monitoring and analytics
export interface PerformanceMetrics {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
  navigationType?: string;
}

export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: PerformanceEntry[];
}

// Core Web Vitals thresholds
const THRESHOLDS = {
  CLS: [0.1, 0.25],
  FID: [100, 300],
  FCP: [1800, 3000],
  LCP: [2500, 4000],
  TTFB: [800, 1800],
  INP: [200, 500],
};

// Performance observer for monitoring
class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    // Observe navigation timing
    if ('PerformanceObserver' in window) {
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              this.processNavigationEntry(entry as PerformanceNavigationTiming);
            }
          }
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navigationObserver);
      } catch (e) {
        console.warn('Navigation timing observer not supported');
      }

      // Observe paint timing
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.processPaintEntry(entry);
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);
      } catch (e) {
        console.warn('Paint timing observer not supported');
      }

      // Observe layout shift
      try {
        const layoutShiftObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.processLayoutShiftEntry(entry as any);
          }
        });
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(layoutShiftObserver);
      } catch (e) {
        console.warn('Layout shift observer not supported');
      }
    }
  }

  private processNavigationEntry(entry: PerformanceNavigationTiming) {
    const ttfb = entry.responseStart - entry.requestStart;
    const domContentLoaded = entry.domContentLoadedEventEnd - (entry as any).navigationStart;
    const loadComplete = entry.loadEventEnd - (entry as any).navigationStart;

    this.recordMetric('TTFB', ttfb, this.getRating('TTFB', ttfb));
    this.recordMetric('DCL', domContentLoaded, this.getRating('FCP', domContentLoaded));
    this.recordMetric('Load', loadComplete, this.getRating('LCP', loadComplete));
  }

  private processPaintEntry(entry: PerformanceEntry) {
    const value = entry.startTime;
    if (entry.name === 'first-contentful-paint') {
      this.recordMetric('FCP', value, this.getRating('FCP', value));
    } else if (entry.name === 'first-paint') {
      this.recordMetric('FP', value, this.getRating('FCP', value));
    }
  }

  private processLayoutShiftEntry(entry: any) {
    if (!entry.hadRecentInput) {
      const currentCLS = this.metrics.get('CLS')?.value || 0;
      const newCLS = currentCLS + entry.value;
      this.recordMetric('CLS', newCLS, this.getRating('CLS', newCLS));
    }
  }

  private getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = THRESHOLDS[metric as keyof typeof THRESHOLDS];
    if (!thresholds) return 'good';
    
    if (value <= thresholds[0]) return 'good';
    if (value <= thresholds[1]) return 'needs-improvement';
    return 'poor';
  }

  private recordMetric(name: string, value: number, rating: 'good' | 'needs-improvement' | 'poor') {
    const metric: PerformanceMetrics = {
      name,
      value,
      rating,
      id: `${name}-${Date.now()}`,
    };

    this.metrics.set(name, metric);
    this.reportMetric(metric);
  }

  private reportMetric(metric: PerformanceMetrics) {
    // Send to analytics service (placeholder)
    if (process.env.NODE_ENV === 'production') {
      // In production, you would send this to your analytics service
      console.log('Performance metric:', metric);
    }

    // Store in localStorage for debugging
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('performance-metrics') || '[]';
        const metrics = JSON.parse(stored);
        metrics.push({
          ...metric,
          timestamp: Date.now(),
          url: window.location.href,
        });
        
        // Keep only last 100 metrics
        if (metrics.length > 100) {
          metrics.splice(0, metrics.length - 100);
        }
        
        localStorage.setItem('performance-metrics', JSON.stringify(metrics));
      } catch (e) {
        console.warn('Failed to store performance metrics');
      }
    }
  }

  public getMetrics(): Map<string, PerformanceMetrics> {
    return new Map(this.metrics);
  }

  public getMetric(name: string): PerformanceMetrics | undefined {
    return this.metrics.get(name);
  }

  public clearMetrics() {
    this.metrics.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('performance-metrics');
    }
  }

  public disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor;
}

// Web Vitals reporting function
export function reportWebVitals(metric: WebVitalsMetric) {
  const monitor = getPerformanceMonitor();
  monitor['recordMetric'](metric.name, metric.value, metric.rating);
}

// Custom performance measurement
export function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): T | Promise<T> {
  const start = performance.now();
  
  const finish = (result: T) => {
    const duration = performance.now() - start;
    const monitor = getPerformanceMonitor();
    monitor['recordMetric'](`custom-${name}`, duration, duration < 100 ? 'good' : duration < 500 ? 'needs-improvement' : 'poor');
    return result;
  };

  try {
    const result = fn();
    if (result instanceof Promise) {
      return result.then(finish);
    }
    return finish(result);
  } catch (error) {
    const duration = performance.now() - start;
    const monitor = getPerformanceMonitor();
    monitor['recordMetric'](`custom-${name}-error`, duration, 'poor');
    throw error;
  }
}

// Resource loading performance
export function trackResourceLoading() {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'resource') {
        const resource = entry as PerformanceResourceTiming;
        const duration = resource.responseEnd - resource.startTime;
        
        // Track slow resources
        if (duration > 1000) {
          console.warn(`Slow resource: ${resource.name} took ${duration}ms`);
        }
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['resource'] });
  } catch (e) {
    console.warn('Resource timing observer not supported');
  }
}

// Memory usage tracking
export function trackMemoryUsage() {
  if (typeof window === 'undefined' || !('memory' in performance)) return;

  const memory = (performance as any).memory;
  const monitor = getPerformanceMonitor();
  
  monitor['recordMetric']('memory-used', memory.usedJSHeapSize, 
    memory.usedJSHeapSize < 50 * 1024 * 1024 ? 'good' : 
    memory.usedJSHeapSize < 100 * 1024 * 1024 ? 'needs-improvement' : 'poor'
  );
}

// Initialize performance monitoring
export function initializePerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  getPerformanceMonitor();
  trackResourceLoading();
  
  // Track memory usage periodically
  setInterval(trackMemoryUsage, 30000); // Every 30 seconds
} 