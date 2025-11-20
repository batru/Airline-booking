import React, { useState } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Button } from './Button';

interface AlertProps {
  type?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  variant?: 'default' | 'bordered' | 'filled';
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className = '',
  variant = 'default'
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          titleColor: 'text-green-900'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          titleColor: 'text-yellow-900'
        };
      case 'error':
        return {
          icon: AlertCircle,
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          titleColor: 'text-red-900'
        };
      case 'info':
      default:
        return {
          icon: Info,
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          titleColor: 'text-blue-900'
        };
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'bordered':
        return 'border-l-4';
      case 'filled':
        return 'bg-opacity-100';
      default:
        return 'border';
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  const baseClasses = `
    rounded-lg p-4 transition-all duration-200
    ${config.bgColor}
    ${config.borderColor}
    ${getVariantClasses()}
    ${className}
  `;

  return (
    <div className={baseClasses} role="alert">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${config.titleColor} mb-1`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${config.textColor}`}>
            {children}
          </div>
        </div>
        {dismissible && (
          <div className="ml-3 flex-shrink-0">
            <Button
              variant="tertiary"
              size="sm"
              onClick={handleDismiss}
              className="p-1"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};





