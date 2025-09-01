import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/context/ToastContext';

interface UseDataLoaderOptions<T> {
  fetchFn: () => Promise<T>;
  defaultValue: T;
  errorMessage?: string;
  successMessage?: string;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  dependencies?: any[];
}

interface UseDataLoaderResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  retry: () => void;
  setData: (data: T) => void;
}

export function useDataLoader<T>({
  fetchFn,
  defaultValue,
  errorMessage = 'Gagal memuat data',
  successMessage,
  onSuccess,
  onError,
  dependencies = []
}: UseDataLoaderOptions<T>): UseDataLoaderResult<T> {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFn();
      setData(result);
      
      if (successMessage) {
        showToast(successMessage, 'success');
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
    } catch (err) {
      console.error('Data loading error:', err);
      const errorMsg = err instanceof Error ? err.message : errorMessage;
      setError(errorMsg);
      
      // Don't show toast for every error, let component decide
      if (onError) {
        onError(err);
      } else {
        showToast(errorMsg, 'error');
      }
      
    } finally {
      setLoading(false);
    }
  }, [fetchFn, errorMessage, successMessage, onSuccess, onError, showToast]);

  const retry = useCallback(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    retry,
    setData
  };
}

// Hook for loading multiple data sources
interface UseMultiDataLoaderOptions {
  fetchers: Array<{
    name: string;
    fetchFn: () => Promise<any>;
    required?: boolean;
  }>;
  onPartialSuccess?: (results: Record<string, any>) => void;
  onError?: (errors: Record<string, any>) => void;
}

interface UseMultiDataLoaderResult {
  data: Record<string, any>;
  loading: boolean;
  errors: Record<string, string>;
  hasData: boolean;
  retry: () => void;
}

export function useMultiDataLoader({
  fetchers,
  onPartialSuccess,
  onError
}: UseMultiDataLoaderOptions): UseMultiDataLoaderResult {
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrors({});

    try {
      const results = await Promise.allSettled(
        fetchers.map(({ name, fetchFn }) => 
          fetchFn().then(result => ({ name, result }))
        )
      );

      const successResults: Record<string, any> = {};
      const errorResults: Record<string, string> = {};
      let hasAnySuccess = false;

      results.forEach((result, index) => {
        const { name, required = false } = fetchers[index];

        if (result.status === 'fulfilled') {
          successResults[name] = result.value.result;
          hasAnySuccess = true;
        } else {
          const errorMsg = result.reason instanceof Error 
            ? result.reason.message 
            : `Gagal memuat data ${name}`;
          errorResults[name] = errorMsg;
          console.error(`Failed to fetch ${name}:`, result.reason);
          
          if (required) {
            showToast(`Gagal memuat ${name}`, 'error');
          } else {
            showToast(`Gagal memuat ${name}`, 'warning');
          }
        }
      });

      setData(successResults);
      setErrors(errorResults);

      // Show overall status
      const failedCount = Object.keys(errorResults).length;
      const totalCount = fetchers.length;
      
      if (failedCount === 0) {
        // All success
        if (onPartialSuccess) onPartialSuccess(successResults);
      } else if (hasAnySuccess) {
        // Partial success
        showToast(
          `${totalCount - failedCount} dari ${totalCount} data berhasil dimuat`, 
          'warning'
        );
        if (onPartialSuccess) onPartialSuccess(successResults);
      } else {
        // All failed
        showToast('Tidak dapat memuat data. Periksa koneksi internet Anda.', 'error');
        if (onError) onError(errorResults);
      }

    } catch (unexpectedError) {
      console.error('Unexpected error in loadData:', unexpectedError);
      setErrors({ general: 'Terjadi kesalahan tidak terduga' });
      showToast('Terjadi kesalahan tidak terduga', 'error');
      if (onError) onError({ general: 'Terjadi kesalahan tidak terduga' });
    } finally {
      setLoading(false);
    }
  }, [fetchers, onPartialSuccess, onError, showToast]);

  const retry = useCallback(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, []);

  const hasData = Object.keys(data).length > 0;

  return {
    data,
    loading,
    errors,
    hasData,
    retry
  };
}