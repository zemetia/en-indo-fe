import { useCallback, useRef, useEffect } from 'react';

// Context-aware debounce configurations
export const DEBOUNCE_PRESETS = {
  search: 300,           // User search input
  filter: 200,           // Filter changes
  departmentChange: 500, // Department selection triggering pelayanan fetch
  formValidation: 400,   // Form field validation
  apiCall: 600,          // General API calls
  typing: 150,           // Fast typing scenarios
  navigation: 100        // Navigation/route changes
} as const;

export type DebouncePreset = keyof typeof DEBOUNCE_PRESETS;

interface UseSmartDebounceOptions {
  preset?: DebouncePreset;
  customDelay?: number;
  leading?: boolean;  // Execute immediately, then debounce subsequent calls
  trailing?: boolean; // Execute after delay (default behavior)
  maxWait?: number;   // Maximum time to wait before forcing execution
}

/**
 * Smart debounce hook with preset configurations and advanced options
 */
export function useSmartDebounce<T extends (...args: any[]) => any>(
  callback: T,
  options: UseSmartDebounceOptions = {}
): T {
  const {
    preset = 'apiCall',
    customDelay,
    leading = false,
    trailing = true,
    maxWait
  } = options;

  // Get delay from preset or custom value
  const delay = customDelay ?? DEBOUNCE_PRESETS[preset];

  // Refs to track state
  const timeoutRef = useRef<NodeJS.Timeout>();
  const maxTimeoutRef = useRef<NodeJS.Timeout>();
  const lastCallTimeRef = useRef<number>(0);
  const lastExecTimeRef = useRef<number>(0);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (maxTimeoutRef.current) clearTimeout(maxTimeoutRef.current);
    };
  }, []);

  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    lastCallTimeRef.current = now;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Execute immediately if leading and first call
    if (leading && lastExecTimeRef.current === 0) {
      lastExecTimeRef.current = now;
      return callbackRef.current(...args);
    }

    // Set up max wait timeout if specified
    if (maxWait && !maxTimeoutRef.current) {
      maxTimeoutRef.current = setTimeout(() => {
        if (maxTimeoutRef.current) {
          clearTimeout(maxTimeoutRef.current);
          maxTimeoutRef.current = undefined;
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = undefined;
        }
        lastExecTimeRef.current = Date.now();
        return callbackRef.current(...args);
      }, maxWait);
    }

    // Set up trailing execution
    if (trailing) {
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = undefined;
        
        // Clear max timeout if it exists
        if (maxTimeoutRef.current) {
          clearTimeout(maxTimeoutRef.current);
          maxTimeoutRef.current = undefined;
        }
        
        lastExecTimeRef.current = Date.now();
        return callbackRef.current(...args);
      }, delay);
    }
  }, [delay, leading, trailing, maxWait]) as T;

  return debouncedCallback;
}

/**
 * Specialized debounce hook for dependent API calls (like department -> pelayanan)
 */
export function useApiCallDebounce<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: any[] = []
): T & { cancel: () => void; flush: () => void } {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const argsRef = useRef<Parameters<T>>();
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cancel and execute immediately when dependencies change
  useEffect(() => {
    // Cancel any pending execution
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, dependencies);

  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    argsRef.current = args;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = undefined;
      if (argsRef.current) {
        return callbackRef.current(...argsRef.current);
      }
    }, DEBOUNCE_PRESETS.departmentChange);
  }, []) as T;

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
      if (argsRef.current) {
        return callbackRef.current(...argsRef.current);
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return Object.assign(debouncedCallback, { cancel, flush });
}

/**
 * Hook for debouncing search queries with intelligent presets
 */
export function useSearchDebounce<T extends (query: string) => any>(
  searchFn: T,
  options: {
    minQueryLength?: number;
    emptyQueryDelay?: number;
  } = {}
): T {
  const { minQueryLength = 0, emptyQueryDelay = 100 } = options;

  return useSmartDebounce(
    useCallback((...args: Parameters<T>) => {
      const query = args[0] as string;
      
      // Handle empty queries faster
      if (query.length === 0) {
        return searchFn(...args);
      }
      
      // Don't search for very short queries
      if (query.length < minQueryLength) {
        return;
      }
      
      return searchFn(...args);
    }, [searchFn, minQueryLength]),
    {
      preset: 'search',
      customDelay: emptyQueryDelay
    }
  ) as T;
}

/**
 * Hook for debouncing form validation
 */
export function useValidationDebounce<T extends (...args: any[]) => any>(
  validationFn: T
): T {
  return useSmartDebounce(validationFn, {
    preset: 'formValidation',
    trailing: true,
    maxWait: 1000 // Force validation after 1 second max
  });
}

/**
 * Utility to create adaptive debounce based on user behavior
 */
export function useAdaptiveDebounce<T extends (...args: any[]) => any>(
  callback: T,
  baseDelay: number = 300
): T {
  const callTimesRef = useRef<number[]>([]);
  const dynamicDelayRef = useRef(baseDelay);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    callTimesRef.current.push(now);

    // Keep only recent calls (last 5 seconds)
    callTimesRef.current = callTimesRef.current.filter(time => now - time < 5000);

    // Adapt delay based on call frequency
    const callsInLastSecond = callTimesRef.current.filter(time => now - time < 1000).length;
    
    if (callsInLastSecond > 5) {
      // High frequency - increase delay
      dynamicDelayRef.current = Math.min(baseDelay * 2, 1000);
    } else if (callsInLastSecond < 2) {
      // Low frequency - decrease delay
      dynamicDelayRef.current = Math.max(baseDelay * 0.7, 100);
    }

    // Use the adaptive delay
    return useSmartDebounce(callback, {
      customDelay: dynamicDelayRef.current
    })(...args);
  }, [callback, baseDelay]) as T;
}