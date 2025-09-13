import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelToken } from 'axios';
import { getToken } from '@/lib/helper';

// Enhanced API client with request management, caching, and deduplication
export class EnhancedAPIClient {
  private client: AxiosInstance;
  private requestCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private pendingRequests = new Map<string, Promise<any>>();
  private abortControllers = new Map<string, AbortController>();

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL: baseURL || process.env.NEXT_PUBLIC_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.setupCleanupInterval();
  }

  private setupInterceptors() {
    // Request interceptor for auth and abort controller
    this.client.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          const isAuthEndpoint = error.config?.url?.includes('/api/user/login') || 
                                 error.config?.url?.includes('/api/user/register') ||
                                 error.config?.url?.includes('/api/user/auth/setup-password');
          
          if (!isAuthEndpoint && typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private setupCleanupInterval() {
    // Clean up expired cache and completed requests every 5 minutes
    setInterval(() => {
      this.cleanupExpiredCache();
      this.cleanupCompletedRequests();
    }, 5 * 60 * 1000);
  }

  private cleanupExpiredCache() {
    const now = Date.now();
    for (const [key, { timestamp, ttl }] of this.requestCache.entries()) {
      if (now - timestamp > ttl) {
        this.requestCache.delete(key);
      }
    }
  }

  private cleanupCompletedRequests() {
    // Clean up completed requests that are older than 1 minute
    const cutoff = Date.now() - 60 * 1000;
    for (const [key, promise] of this.pendingRequests.entries()) {
      // Check if promise is settled by attempting to get its state
      Promise.resolve(promise).then(
        () => {
          // Promise resolved, can clean up if old enough
          if (Date.now() > cutoff) {
            this.pendingRequests.delete(key);
          }
        },
        () => {
          // Promise rejected, can clean up if old enough
          if (Date.now() > cutoff) {
            this.pendingRequests.delete(key);
          }
        }
      );
    }
  }

  private generateRequestKey(method: string, url: string, data?: any): string {
    const dataString = data ? JSON.stringify(data) : '';
    return `${method.toLowerCase()}:${url}:${dataString}`;
  }

  private getCachedData(key: string): any | null {
    const cached = this.requestCache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      this.requestCache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCachedData(key: string, data: any, ttl: number) {
    this.requestCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // Enhanced request method with caching, deduplication, and abort support
  async request<T = any>(
    config: AxiosRequestConfig & {
      cache?: boolean;
      cacheTTL?: number;
      retries?: number;
      retryDelay?: number;
      deduplicate?: boolean;
    }
  ): Promise<T> {
    const {
      cache = false,
      cacheTTL = 5 * 60 * 1000, // 5 minutes default
      retries = 3,
      retryDelay = 1000,
      deduplicate = true,
      ...axiosConfig
    } = config;

    const requestKey = this.generateRequestKey(
      axiosConfig.method || 'get',
      axiosConfig.url || '',
      axiosConfig.data
    );

    // Check cache first for GET requests
    if (cache && axiosConfig.method?.toLowerCase() === 'get') {
      const cachedData = this.getCachedData(requestKey);
      if (cachedData) {
        return cachedData;
      }
    }

    // Check for duplicate requests
    if (deduplicate) {
      const pendingRequest = this.pendingRequests.get(requestKey);
      if (pendingRequest) {
        console.log(`Deduplicating request: ${requestKey}`);
        return pendingRequest;
      }
    }

    // Create abort controller for this request
    const abortController = new AbortController();
    this.abortControllers.set(requestKey, abortController);

    // Create the request promise
    const requestPromise = this.executeRequestWithRetry<T>({
      ...axiosConfig,
      signal: abortController.signal
    }, retries, retryDelay);

    // Store pending request for deduplication
    if (deduplicate) {
      this.pendingRequests.set(requestKey, requestPromise);
    }

    try {
      const response = await requestPromise;
      
      // Cache successful GET responses
      if (cache && axiosConfig.method?.toLowerCase() === 'get' && response) {
        this.setCachedData(requestKey, response, cacheTTL);
      }

      return response;
    } finally {
      // Cleanup
      this.abortControllers.delete(requestKey);
      if (deduplicate) {
        // Don't delete immediately - let cleanup interval handle it
        // This allows other callers to still get the result
      }
    }
  }

  private async executeRequestWithRetry<T>(
    config: AxiosRequestConfig,
    maxRetries: number,
    delay: number
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.client.request<T>(config);
        return response.data;
      } catch (error: any) {
        lastError = error;

        // Don't retry for client errors (4xx) or aborted requests
        if (
          error.response?.status >= 400 && error.response?.status < 500 ||
          error.name === 'CanceledError' ||
          error.name === 'AbortError'
        ) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === maxRetries) {
          throw error;
        }

        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
      }
    }

    throw lastError;
  }

  // Cancel all pending requests (useful for component unmount)
  cancelAllRequests() {
    for (const [key, controller] of this.abortControllers.entries()) {
      controller.abort();
      this.abortControllers.delete(key);
    }
    this.pendingRequests.clear();
  }

  // Cancel specific request by key
  cancelRequest(method: string, url: string, data?: any) {
    const key = this.generateRequestKey(method, url, data);
    const controller = this.abortControllers.get(key);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(key);
      this.pendingRequests.delete(key);
    }
  }

  // Convenience methods
  async get<T = any>(url: string, config?: AxiosRequestConfig & { cache?: boolean; cacheTTL?: number }): Promise<T> {
    return this.request<T>({
      method: 'get',
      url,
      cache: true, // Enable cache by default for GET requests
      ...config
    });
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({
      method: 'post',
      url,
      data,
      ...config
    });
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({
      method: 'put',
      url,
      data,
      ...config
    });
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({
      method: 'delete',
      url,
      ...config
    });
  }

  // Clear all cache
  clearCache() {
    this.requestCache.clear();
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.requestCache.size,
      pendingRequests: this.pendingRequests.size,
      activeControllers: this.abortControllers.size
    };
  }
}

// Export singleton instance
export const enhancedApiClient = new EnhancedAPIClient();

// Export default instance for backward compatibility
export default enhancedApiClient;