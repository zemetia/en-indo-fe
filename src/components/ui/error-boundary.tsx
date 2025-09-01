'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Terjadi Kesalahan
          </h3>
          <p className="text-red-600 mb-4 max-w-md">
            Komponen mengalami masalah dan tidak dapat ditampilkan. Silakan coba lagi atau hubungi administrator jika masalah berlanjut.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="text-xs text-red-500 mb-4 p-2 bg-red-100 rounded border max-w-full overflow-auto">
              <strong>Error:</strong> {this.state.error.message}
            </div>
          )}
          <Button 
            onClick={this.handleRetry}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}