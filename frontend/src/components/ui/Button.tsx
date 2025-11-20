import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const isDisabled = disabled || loading;
  
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-primary-900 text-white hover:bg-primary-800 focus:ring-primary-500 active:bg-primary-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 active:bg-gray-400',
    tertiary: 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:ring-gray-500 active:bg-gray-200',
    outline: 'border-2 border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white focus:ring-primary-500 active:bg-primary-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm min-h-[32px] gap-1',
    md: 'px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base min-h-[40px] gap-2',
    lg: 'px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg min-h-[48px] gap-2'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button 
      className={classes} 
      disabled={isDisabled}
      aria-disabled={isDisabled}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
      )}
      {!loading && leftIcon && (
        <span className="flex-shrink-0 inline-flex items-center">{leftIcon}</span>
      )}
      <span className={`inline-flex items-center ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
      {!loading && rightIcon && (
        <span className="flex-shrink-0 inline-flex items-center">{rightIcon}</span>
      )}
    </button>
  );
};