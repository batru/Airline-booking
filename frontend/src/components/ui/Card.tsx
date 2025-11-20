import React from 'react';
import { Loader2 } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gray' | 'outline' | 'elevated';
  hover?: boolean;
  selected?: boolean;
  loading?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  hover = false,
  selected = false,
  loading = false,
  onClick,
  disabled = false
}) => {
  const baseClasses = 'rounded-lg p-6 transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-white shadow-sm',
    gray: 'bg-gray-50 shadow-sm',
    outline: 'bg-white border-2 border-gray-200 shadow-sm',
    elevated: 'bg-white shadow-lg'
  };
  
  const stateClasses = {
    hover: hover && !disabled ? 'hover:shadow-md cursor-pointer' : '',
    selected: selected ? 'ring-2 ring-primary-500 shadow-md' : '',
    disabled: disabled ? 'opacity-50 cursor-not-allowed' : '',
    clickable: onClick && !disabled ? 'cursor-pointer' : ''
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${stateClasses.hover} ${stateClasses.selected} ${stateClasses.disabled} ${stateClasses.clickable} ${className}`;
  
  return (
    <div 
      className={classes}
      onClick={onClick && !disabled ? onClick : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-disabled={disabled}
    >
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
        </div>
      )}
      <div className={loading ? 'opacity-50' : ''}>
        {children}
      </div>
    </div>
  );
};