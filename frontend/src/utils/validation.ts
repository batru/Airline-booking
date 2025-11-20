// Import React for the hook
import React from 'react';

// Validation utility functions
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateField = (value: string, rules: ValidationRule): ValidationResult => {
  // Required validation
  if (rules.required && (!value || value.trim() === '')) {
    return {
      isValid: false,
      error: rules.message || 'This field is required'
    };
  }

  // Skip other validations if value is empty and not required
  if (!value || value.trim() === '') {
    return { isValid: true };
  }

  // Min length validation
  if (rules.minLength && value.length < rules.minLength) {
    return {
      isValid: false,
      error: rules.message || `Must be at least ${rules.minLength} characters`
    };
  }

  // Max length validation
  if (rules.maxLength && value.length > rules.maxLength) {
    return {
      isValid: false,
      error: rules.message || `Must be no more than ${rules.maxLength} characters`
    };
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value)) {
    return {
      isValid: false,
      error: rules.message || 'Invalid format'
    };
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      return {
        isValid: false,
        error: customError
      };
    }
  }

  return { isValid: true };
};

// Common validation patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  passport: /^[A-Z]{1,2}[0-9]{6,9}$/,
  flightNumber: /^[A-Z]{2,3}[0-9]{3,4}$/,
  airportCode: /^[A-Z]{3}$/
};

// Common validation rules
export const rules = {
  required: (message?: string): ValidationRule => ({
    required: true,
    message: message || 'This field is required'
  }),
  
  email: (message?: string): ValidationRule => ({
    required: true,
    pattern: patterns.email,
    message: message || 'Please enter a valid email address'
  }),
  
  phone: (message?: string): ValidationRule => ({
    required: true,
    pattern: patterns.phone,
    message: message || 'Please enter a valid phone number'
  }),
  
  minLength: (length: number, message?: string): ValidationRule => ({
    minLength: length,
    message: message || `Must be at least ${length} characters`
  }),
  
  maxLength: (length: number, message?: string): ValidationRule => ({
    maxLength: length,
    message: message || `Must be no more than ${length} characters`
  }),
  
  passport: (message?: string): ValidationRule => ({
    required: true,
    pattern: patterns.passport,
    message: message || 'Please enter a valid passport number'
  }),
  
  airportCode: (message?: string): ValidationRule => ({
    required: true,
    pattern: patterns.airportCode,
    message: message || 'Please enter a valid 3-letter airport code'
  }),
  
  flightNumber: (message?: string): ValidationRule => ({
    required: true,
    pattern: patterns.flightNumber,
    message: message || 'Please enter a valid flight number'
  })
};

// Form validation hook
export const useFormValidation = (initialValues: Record<string, string>) => {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  const validateFieldByName = (name: string, value: string, rules: ValidationRule) => {
    const result = validateField(value, rules);
    if (!result.isValid) {
      setErrors(prev => ({ ...prev, [name]: result.error! }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    return result.isValid;
  };

  const validateForm = (validationRules: Record<string, ValidationRule>) => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    Object.keys(validationRules).forEach(name => {
      const result = validateField(values[name] || '', validationRules[name]);
      if (!result.isValid) {
        newErrors[name] = result.error!;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const setValue = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const setTouchedField = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched: setTouchedField,
    validateField: validateFieldByName,
    validateForm,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};
