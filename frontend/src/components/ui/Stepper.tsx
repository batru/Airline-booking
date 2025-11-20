import React from 'react';

interface StepperProps {
  currentStep: number;
  steps: string[];
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  steps,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-center space-x-4 sm:space-x-6 lg:space-x-8 ${className}`}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        const isInactive = stepNumber > currentStep;
        
        return (
          <div key={step} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
              isActive
                ? 'bg-primary-900 text-white'
                : isCompleted
                ? 'bg-white text-primary-900 border-2 border-primary-900'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {isCompleted ? '✓' : stepNumber}
            </div>
            <span className={`text-xs sm:text-sm font-medium text-center ${
              isActive
                ? 'text-primary-900'
                : isCompleted
                ? 'text-primary-900'
                : 'text-gray-400'
            }`}>
              <span className="hidden sm:inline">{step}</span>
              <span className="sm:hidden">{step.split(' ')[0]}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
};

