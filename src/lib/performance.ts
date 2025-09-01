// Performance optimization utilities

// Debounce function to reduce excessive function calls
export function debounce<T extends (...args: any[]) => void>(
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

// Throttle function to limit function calls
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Memoization utility
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Simple cache implementation
export class SimpleCache<T = any> {
  private cache = new Map<string, { value: T; expiry?: number }>();
  
  set(key: string, value: T, ttl?: number): void {
    const expiry = ttl ? Date.now() + ttl : undefined;
    this.cache.set(key, { value, expiry });
  }
  
  get(key: string): T | undefined {
    const item = this.cache.get(key);
    
    if (!item) return undefined;
    
    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }
    
    return item.value;
  }
  
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
}

// Check if we're in development mode
export const isDev = process.env.NODE_ENV === 'development';

// Performance measurement helper
export function measurePerformance<T>(
  fn: () => T,
  label?: string
): T {
  if (!isDev) return fn();
  
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`${label || 'Operation'} took ${end - start} milliseconds`);
  return result;
}

// Async performance measurement
export async function measurePerformanceAsync<T>(
  fn: () => Promise<T>,
  label?: string
): Promise<T> {
  if (!isDev) return await fn();
  
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  
  console.log(`${label || 'Async operation'} took ${end - start} milliseconds`);
  return result;
}

// Image optimization helper
export function optimizeImageSrc(src: string, width?: number, quality = 75): string {
  if (!src) return '';
  
  // If it's a placeholder or external URL, return as-is
  if (src.includes('placehold.co') || src.startsWith('http')) {
    return src;
  }
  
  // For local images, you can add optimization parameters
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  params.append('q', quality.toString());
  
  return params.toString() ? `${src}?${params.toString()}` : src;
}

// Intersection Observer helper for lazy loading
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
}