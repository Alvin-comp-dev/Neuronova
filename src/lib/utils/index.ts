import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for merging Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Debounce function for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

// Throttle function for performance optimization
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Generate random ID
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Sleep function for async operations
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Check if code is running on client side
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

// Check if code is running on server side
export function isServer(): boolean {
  return typeof window === 'undefined';
}

// Local storage helpers with error handling
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (!isClient()) return defaultValue || null;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.warn(`Error reading from localStorage key "${key}":`, error);
      return defaultValue || null;
    }
  },
  
  set: <T>(key: string, value: T): boolean => {
    if (!isClient()) return false;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  },
  
  remove: (key: string): boolean => {
    if (!isClient()) return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  },
  
  clear: (): boolean => {
    if (!isClient()) return false;
    
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
      return false;
    }
  }
};

// URL helpers
export const url = {
  isValidUrl: (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  },
  
  getQueryParam: (param: string): string | null => {
    if (!isClient()) return null;
    
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },
  
  setQueryParam: (param: string, value: string): void => {
    if (!isClient()) return;
    
    const url = new URL(window.location.href);
    url.searchParams.set(param, value);
    window.history.replaceState({}, '', url.toString());
  },
  
  removeQueryParam: (param: string): void => {
    if (!isClient()) return;
    
    const url = new URL(window.location.href);
    url.searchParams.delete(param);
    window.history.replaceState({}, '', url.toString());
  }
};

// Date helpers
export const date = {
  formatRelative: (date: Date | string): string => {
    const now = new Date();
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
  },
  
  format: (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    return targetDate.toLocaleDateString(undefined, options);
  }
};

// Array helpers
export const array = {
  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },
  
  unique: <T>(array: T[]): T[] => {
    return [...new Set(array)];
  },
  
  shuffle: <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
};

// Object helpers
export const object = {
  pick: <T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },
  
  omit: <T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach(key => {
      delete result[key];
    });
    return result;
  }
}; 