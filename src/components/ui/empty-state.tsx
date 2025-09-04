import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  };
  className?: string;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="font-semibold text-gray-700 mb-2 text-lg">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <Button
          variant={action.variant || 'default'}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

interface SearchEmptyStateProps {
  searchTerm: string;
  type: string;
  onClear?: () => void;
}

export function SearchEmptyState({ 
  searchTerm, 
  type, 
  onClear 
}: SearchEmptyStateProps) {
  return (
    <div className="text-center py-12 text-gray-500">
      <div className="text-4xl mb-4">🔍</div>
      <h3 className="font-semibold text-gray-700 mb-2">
        Tidak Ada Hasil Pencarian
      </h3>
      <p className="text-sm mb-4">
        Tidak ada {type} yang cocok dengan "{searchTerm}".
      </p>
      {onClear && (
        <Button variant="outline" onClick={onClear}>
          Hapus Pencarian
        </Button>
      )}
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ 
  message = "Memuat data...", 
  className = "" 
}: LoadingStateProps) {
  return (
    <div className={`flex justify-center items-center py-10 ${className}`}>
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
  retrying?: boolean;
  className?: string;
}

export function ErrorState({ 
  title, 
  description, 
  onRetry, 
  retrying = false,
  className = ""
}: ErrorStateProps) {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-6 text-center ${className}`}>
      <div className="text-red-400 text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-red-800 mb-2">{title}</h3>
      <p className="text-red-600 mb-4">{description}</p>
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          disabled={retrying}
          className="border-red-300 text-red-700 hover:bg-red-100"
        >
          {retrying ? (
            <>
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2"></div>
              Memuat...
            </>
          ) : (
            'Coba Lagi'
          )}
        </Button>
      )}
    </div>
  );
}