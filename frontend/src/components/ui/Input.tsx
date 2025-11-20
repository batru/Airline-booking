import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
  variant?: 'default' | 'email' | 'phone' | 'date' | 'password';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  success,
  icon,
  rightIcon,
  helperText,
  variant = 'default',
  className = '',
  ...props
}) => {
  const hasError = !!error;
  const hasSuccess = !!success && !hasError;
  
  const getInputType = () => {
    switch (variant) {
      case 'email': return 'email';
      case 'phone': return 'tel';
      case 'date': return 'date';
      case 'password': return 'password';
      default: return props.type || 'text';
    }
  };

  const getInputClasses = () => {
    const baseClasses = 'form-input transition-colors duration-200';
    const iconPadding = icon ? 'pl-10' : '';
    const rightIconPadding = rightIcon ? 'pr-10' : '';
    
    let stateClasses = '';
    if (hasError) {
      stateClasses = 'border-red-500 focus:ring-red-500 focus:border-red-500';
    } else if (hasSuccess) {
      stateClasses = 'border-green-500 focus:ring-green-500 focus:border-green-500';
    } else {
      stateClasses = 'border-gray-300 focus:ring-primary-500 focus:border-primary-500';
    }
    
    return `${baseClasses} ${iconPadding} ${rightIconPadding} ${stateClasses} ${className}`;
  };

  return (
    <div className="w-full">
      {label && (
        <label className="form-label" htmlFor={props.id}>
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={getInputType()}
          className={getInputClasses()}
          aria-invalid={hasError}
          aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
          {...props}
        />
        {rightIcon && !hasError && !hasSuccess && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
        {hasError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
            <AlertCircle className="w-4 h-4" />
          </div>
        )}
        {hasSuccess && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
            <CheckCircle className="w-4 h-4" />
          </div>
        )}
      </div>
      {error && (
        <p id={`${props.id}-error`} className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
      {success && !hasError && (
        <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {success}
        </p>
      )}
      {helperText && !error && !success && (
        <p id={`${props.id}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};