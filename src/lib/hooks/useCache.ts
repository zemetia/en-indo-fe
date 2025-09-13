import { useRef, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of cached items
}

/**
 * Simple in-memory cache hook with TTL (Time To Live) support
 */
export function useCache<T>(options: CacheOptions = {}) {
  const { ttl = 5 * 60 * 1000, maxSize = 100 } = options; // Default: 5 minutes TTL, 100 items max
  const cacheRef = useRef(new Map<string, CacheEntry<T>>());

  const get = useCallback((key: string): T | null => {
    const cache = cacheRef.current;
    const entry = cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      cache.delete(key);
      return null;
    }

    return entry.data;
  }, []);

  const set = useCallback((key: string, data: T): void => {
    const cache = cacheRef.current;
    const now = Date.now();

    // Remove expired entries and enforce max size
    if (cache.size >= maxSize) {
      const entries = Array.from(cache.entries());
      
      // First, remove expired entries
      entries.forEach(([k, entry]) => {
        if (now > entry.expiresAt) {
          cache.delete(k);
        }
      });

      // If still at max size, remove oldest entries
      if (cache.size >= maxSize) {
        const sortedEntries = entries
          .filter(([k]) => cache.has(k)) // Only consider non-expired entries
          .sort(([, a], [, b]) => a.timestamp - b.timestamp);
        
        const toRemove = sortedEntries.slice(0, cache.size - maxSize + 1);
        toRemove.forEach(([k]) => cache.delete(k));
      }
    }

    cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    });
  }, [ttl, maxSize]);

  const has = useCallback((key: string): boolean => {
    const entry = cacheRef.current.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expiresAt) {
      cacheRef.current.delete(key);
      return false;
    }
    
    return true;
  }, []);

  const del = useCallback((key: string): void => {
    cacheRef.current.delete(key);
  }, []);

  const clear = useCallback((): void => {
    cacheRef.current.clear();
  }, []);

  const size = useCallback((): number => {
    const cache = cacheRef.current;
    const now = Date.now();
    
    // Clean expired entries first
    cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        cache.delete(key);
      }
    });
    
    return cache.size;
  }, []);

  return { get, set, has, del, clear, size };
}

/**
 * Hook for caching API responses with automatic retry on cache miss
 */
export function useCachedApi<T>(
  options: CacheOptions & { 
    retryOnError?: boolean;
    onError?: (error: any) => void;
  } = {}
) {
  const { retryOnError = true, onError, ...cacheOptions } = options;
  const { get, set, has, del, clear } = useCache<T>(cacheOptions);

  const cachedFetch = useCallback(async (
    key: string,
    fetcher: () => Promise<T>,
    forceRefresh = false
  ): Promise<T> => {
    // Return cached data if available and not forcing refresh
    if (!forceRefresh) {
      const cached = get(key);
      if (cached !== null) {
        return cached;
      }
    }

    try {
      const data = await fetcher();
      set(key, data);
      return data;
    } catch (error) {
      // If we have cached data and retry is enabled, return cached data
      if (retryOnError) {
        const cached = get(key);
        if (cached !== null) {
          console.warn(`API call failed, returning cached data for key: ${key}`, error);
          return cached;
        }
      }

      if (onError) {
        onError(error);
      }
      throw error;
    }
  }, [get, set, retryOnError, onError]);

  return { cachedFetch, has, del, clear, get, set };
}

/**
 * Generate cache key from multiple parameters
 */
export function createCacheKey(prefix: string, ...params: (string | number | boolean | undefined | null)[]): string {
  const cleanParams = params
    .filter(p => p !== undefined && p !== null)
    .map(p => String(p));
    
  return `${prefix}:${cleanParams.join(':')}`;
}