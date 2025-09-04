import { useState, useEffect, useCallback, useRef } from 'react';
import { enhancedApiClient } from '@/lib/api-client';
import { useDebouncedValue } from './useDebounce';

// Request states
export interface ApiRequestState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  isNetworkError: boolean;
}

// Hook options
export interface UseApiRequestOptions<T> {
  // Execution control
  enabled?: boolean; // Whether to auto-execute the request
  dependencies?: any[]; // Dependencies to trigger re-fetch
  debounceMs?: number; // Debounce delay for dependencies
  
  // Caching options
  cache?: boolean;
  cacheTTL?: number; // Cache time-to-live in milliseconds
  
  // Request options
  retries?: number;
  retryDelay?: number;
  deduplicate?: boolean;
  
  // Callbacks
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  onFinally?: () => void;
  
  // Transform response data
  select?: (data: any) => T;
}

// Request function type
export type ApiRequestFunction<T> = () => Promise<T>;

/**
 * Universal API request hook with caching, deduplication, and smart retry logic
 */
export function useApiRequest<T = any>(
  requestFn: ApiRequestFunction<T>,
  options: UseApiRequestOptions<T> = {}
): ApiRequestState<T> & {
  refetch: () => Promise<void>;
  mutate: (data: T | ((prevData: T | null) => T)) => void;
  cancel: () => void;
} {
  const {
    enabled = true,
    dependencies = [],
    debounceMs = 0,
    cache = false,
    cacheTTL = 5 * 60 * 1000,
    retries = 3,
    retryDelay = 1000,
    deduplicate = true,
    onSuccess,
    onError,
    onFinally,
    select = (data: any) => data
  } = options;

  // State management
  const [state, setState] = useState<ApiRequestState<T>>({
    data: null,
    loading: false,
    error: null,
    isNetworkError: false
  });

  // Refs for cleanup and memoization
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestKeyRef = useRef<string>('');
  const isMountedRef = useRef(true);

  // Debounced dependencies to prevent excessive requests
  const debouncedDeps = useDebouncedValue(dependencies, debounceMs);

  // Generate unique request key for this hook instance
  const generateRequestKey = useCallback(() => {
    const fnString = requestFn.toString();
    const depsString = JSON.stringify(debouncedDeps);
    return `${fnString}:${depsString}:${Date.now()}`;
  }, [requestFn, debouncedDeps]);

  // Execute the API request
  const execute = useCallback(async (isRetry = false) => {
    // Don't execute if disabled or component unmounted
    if (!enabled || !isMountedRef.current) return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const currentRequestKey = generateRequestKey();
    requestKeyRef.current = currentRequestKey;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Execute the request function
      const rawData = await requestFn();
      
      // Check if request was cancelled or component unmounted
      if (
        abortControllerRef.current?.signal.aborted || 
        !isMountedRef.current ||
        requestKeyRef.current !== currentRequestKey
      ) {
        return;
      }

      // Transform data if selector provided
      const data = select(rawData);

      // Update state
      setState({
        data,
        loading: false,
        error: null,
        isNetworkError: false
      });

      // Call success callback
      onSuccess?.(data);

    } catch (error: any) {
      // Don't handle errors for cancelled requests or unmounted components
      if (
        error.name === 'CanceledError' || 
        error.name === 'AbortError' || 
        !isMountedRef.current ||
        requestKeyRef.current !== currentRequestKey
      ) {
        return;
      }

      // Determine error type
      const isNetworkError = error.code === 'NETWORK_ERROR' || 
                           error.message?.includes('Network Error') ||
                           !navigator.onLine;
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'An unknown error occurred';

      // Update state
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        isNetworkError
      });

      // Call error callback
      onError?.(errorMessage);

    } finally {
      if (isMountedRef.current && requestKeyRef.current === currentRequestKey) {
        setState(prev => ({ ...prev, loading: false }));
      }
      onFinally?.();
    }
  }, [enabled, requestFn, select, onSuccess, onError, onFinally, generateRequestKey]);

  // Refetch function that can be called manually
  const refetch = useCallback(async () => {
    return execute(true);
  }, [execute]);

  // Mutate function to update data without refetch
  const mutate = useCallback((updater: T | ((prevData: T | null) => T)) => {
    setState(prev => ({
      ...prev,
      data: typeof updater === 'function' 
        ? (updater as Function)(prev.data)
        : updater
    }));
  }, []);

  // Cancel function
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Auto-execute on mount and dependency changes
  useEffect(() => {
    if (enabled) {
      execute();
    }
    return () => {
      // Cleanup is handled by the main effect below
    };
  }, [enabled, ...debouncedDeps]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    refetch,
    mutate,
    cancel
  };
}

/**
 * Specialized hook for service-based API calls with automatic error handling
 */
export function useServiceQuery<T = any>(
  service: () => Promise<T>,
  options: UseApiRequestOptions<T> = {}
) {
  return useApiRequest<T>(service, {
    cache: true,
    cacheTTL: 2 * 60 * 1000, // 2 minutes default for service calls
    deduplicate: true,
    retries: 2,
    ...options
  });
}

/**
 * Hook for mutations (POST, PUT, DELETE) that don't auto-execute
 */
export function useMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: string, variables: TVariables) => void;
    onFinally?: (variables: TVariables) => void;
  } = {}
) {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    data: TData | null;
  }>({
    loading: false,
    error: null,
    data: null
  });

  const mutate = useCallback(async (variables: TVariables) => {
    try {
      setState({ loading: true, error: null, data: null });
      
      const data = await mutationFn(variables);
      
      setState({ loading: false, error: null, data });
      options.onSuccess?.(data, variables);
      
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'An unknown error occurred';
      
      setState({ loading: false, error: errorMessage, data: null });
      options.onError?.(errorMessage, variables);
      
      throw error;
    } finally {
      options.onFinally?.(variables);
    }
  }, [mutationFn, options]);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: null });
  }, []);

  return {
    ...state,
    mutate,
    reset
  };
}