import React from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 className={`animate-spin text-primary-600 ${sizeClasses[size]} ${className}`} />
  );
};

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', lines = 1 }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-200 rounded h-4 mb-2 last:mb-0"
          style={{ width: index === lines - 1 ? '75%' : '100%' }}
        />
      ))}
    </div>
  );
};

interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg p-4 sm:p-6 border border-gray-200 ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-1">
            <div className="h-5 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-px bg-gray-200 w-12"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
          <div className="space-y-1">
            <div className="h-5 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
};

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  message = 'Loading...',
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center rounded-lg">
          <Spinner size="lg" />
          {message && (
            <p className="mt-2 text-sm text-gray-600">{message}</p>
          )}
        </div>
      )}
    </div>
  );
};

interface PageLoaderProps {
  message?: string;
  className?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Loading...',
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] ${className}`}>
      <Spinner size="lg" />
      {message && (
        <p className="mt-4 text-lg text-gray-600">{message}</p>
      )}
    </div>
  );
};





