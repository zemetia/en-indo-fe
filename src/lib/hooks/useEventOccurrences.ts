import { useState, useEffect, useCallback, useRef } from 'react';
import { getOccurrencesInRange, EventOccurrence } from '@/lib/api/events';

export interface UseEventOccurrencesOptions {
  startDate: Date;
  endDate: Date;
  timezone?: string;
  autoFetch?: boolean;
}

export interface UseEventOccurrencesReturn {
  events: EventOccurrence[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isRefetching: boolean;
}

/**
 * Custom hook to fetch event occurrences within a date range
 * Handles loading states, errors, and provides refetch capability
 */
export function useEventOccurrences({
  startDate,
  endDate,
  timezone = 'Asia/Jakarta',
  autoFetch = true,
}: UseEventOccurrencesOptions): UseEventOccurrencesReturn {
  const [events, setEvents] = useState<EventOccurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchEvents = useCallback(
    async (isRefetch = false) => {
      // Abort previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        if (isRefetch) {
          setIsRefetching(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        const occurrences = await getOccurrencesInRange(
          startDateStr,
          endDateStr,
          timezone,
          abortControllerRef.current.signal
        );

        setEvents(occurrences);
      } catch (err: any) {
        // Don't set error for aborted requests
        if (err.name === 'AbortError' || err.message?.includes('aborted')) {
          return;
        }
        setError(err instanceof Error ? err : new Error('Failed to fetch events'));
      } finally {
        setLoading(false);
        setIsRefetching(false);
      }
    },
    [startDate, endDate, timezone]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchEvents();
    }

    // Cleanup function to abort request on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchEvents, autoFetch]);

  const refetch = useCallback(async () => {
    await fetchEvents(true);
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    refetch,
    isRefetching,
  };
}
