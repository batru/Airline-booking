import React from 'react';
import { Stepper } from '../ui/Stepper';

interface BookingStepperProps {
  currentStep: number;
  className?: string;
}

export const BookingStepper: React.FC<BookingStepperProps> = ({ 
  currentStep, 
  className = '' 
}) => {
  const steps = ['Passenger Details', 'Payment', 'Confirmation'];

  return (
    <Stepper
      currentStep={currentStep}
      steps={steps}
      className={className}
    />
  );
};


