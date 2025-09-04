import { useRef, useEffect } from 'react';

/**
 * Custom hook for managing AbortController instances
 * Automatically aborts ongoing requests when component unmounts or dependencies change
 */
export function useAbortController(deps: any[] = []) {
  const abortControllerRef = useRef<AbortController | null>(null);

  // Create new abort controller when dependencies change
  useEffect(() => {
    // Abort previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new controller
    abortControllerRef.current = new AbortController();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, deps);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const getSignal = () => abortControllerRef.current?.signal;
  
  const abort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();
    }
  };

  return { getSignal, abort };
}

/**
 * Simple hook to prevent duplicate requests
 */
export function useRequestLock() {
  const lockRef = useRef(false);

  const lock = () => {
    if (lockRef.current) return false;
    lockRef.current = true;
    return true;
  };

  const unlock = () => {
    lockRef.current = false;
  };

  const isLocked = () => lockRef.current;

  return { lock, unlock, isLocked };
}