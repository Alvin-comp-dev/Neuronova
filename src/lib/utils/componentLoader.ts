import { lazy, ComponentType, LazyExoticComponent } from 'react';

interface LoadableOptions {
  fallback?: ComponentType;
  delay?: number;
  timeout?: number;
  retry?: number;
}

interface LoadableComponent<T = {}> extends LazyExoticComponent<ComponentType<T>> {
  preload?: () => Promise<{ default: ComponentType<T> }>;
}

/**
 * Enhanced dynamic component loader with preloading and error handling
 */
export function loadable<T = {}>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  options: LoadableOptions = {}
): LoadableComponent<T> {
  const { delay = 200, timeout = 10000, retry = 3 } = options;

  let importPromise: Promise<{ default: ComponentType<T> }> | null = null;
  let retryCount = 0;

  const loadComponent = async (): Promise<{ default: ComponentType<T> }> => {
    if (importPromise) {
      return importPromise;
    }

    importPromise = new Promise(async (resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Component loading timeout after ${timeout}ms`));
      }, timeout);

      try {
        // Add artificial delay for better UX (prevents flash)
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        const result = await importFunc();
        clearTimeout(timeoutId);
        resolve(result);
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (retryCount < retry) {
          retryCount++;
          console.warn(`Component loading failed, retrying... (${retryCount}/${retry})`, error);
          importPromise = null;
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          return loadComponent();
        }
        
        console.error('Component loading failed after all retries:', error);
        reject(error);
      }
    });

    return importPromise;
  };

  const LazyComponent = lazy(loadComponent);

  // Add preload method
  (LazyComponent as LoadableComponent<T>).preload = loadComponent;

  return LazyComponent as LoadableComponent<T>;
}

/**
 * Preload multiple components
 */
export function preloadComponents(components: LoadableComponent[]): Promise<void[]> {
  return Promise.all(
    components.map(component => {
      if (component.preload) {
        return component.preload().catch(error => {
          console.warn('Failed to preload component:', error);
        });
      }
      return Promise.resolve();
    })
  );
}

/**
 * Create a component with retry logic
 */
export function withRetry<T extends {}>(
  Component: ComponentType<T>,
  maxRetries: number = 3
): ComponentType<T> {
  return function RetryWrapper(props: T) {
    const [retryCount, setRetryCount] = useState(0);
    const [hasError, setHasError] = useState(false);

    const resetError = () => {
      setHasError(false);
      setRetryCount(0);
    };

    const retry = () => {
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        setHasError(false);
      }
    };

    if (hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Component failed to load</h3>
          <p className="text-gray-600 mb-4">
            {retryCount < maxRetries 
              ? `Attempt ${retryCount + 1} of ${maxRetries + 1}`
              : 'Maximum retry attempts reached'
            }
          </p>
          <div className="space-x-2">
            {retryCount < maxRetries && (
              <button
                onClick={retry}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            )}
            <button
              onClick={resetError}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Reset
            </button>
          </div>
        </div>
      );
    }

    return (
      <ErrorBoundary
        fallback={
          <div className="p-4 text-center">
            <p className="text-red-500">Something went wrong</p>
            <button
              onClick={() => setHasError(true)}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Show Error Details
            </button>
          </div>
        }
        onError={() => setHasError(true)}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Simple error boundary for the retry wrapper
import { Component as ReactComponent, ErrorInfo, ReactNode, useState } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends ReactComponent<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
} 