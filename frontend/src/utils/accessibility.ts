// Accessibility utility functions

export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getAriaDescribedBy = (...ids: (string | undefined)[]): string | undefined => {
  const validIds = ids.filter(Boolean);
  return validIds.length > 0 ? validIds.join(' ') : undefined;
};

export const getAriaLabelledBy = (...ids: (string | undefined)[]): string | undefined => {
  const validIds = ids.filter(Boolean);
  return validIds.length > 0 ? validIds.join(' ') : undefined;
};

// Common ARIA labels for airline booking system
export const ariaLabels = {
  searchForm: 'Flight search form',
  searchButton: 'Search for flights',
  flightCard: 'Flight option',
  selectFlight: 'Select this flight',
  selectedFlight: 'Selected flight',
  loadingFlights: 'Loading flight results',
  noFlightsFound: 'No flights found matching your search criteria',
  filterFlights: 'Filter flight results',
  clearFilters: 'Clear all filters',
  sortFlights: 'Sort flight results',
  bookingForm: 'Passenger booking form',
  paymentForm: 'Payment information form',
  confirmBooking: 'Confirm and complete booking',
  cancelBooking: 'Cancel booking',
  closeModal: 'Close modal',
  openModal: 'Open modal',
  nextStep: 'Go to next step',
  previousStep: 'Go to previous step',
  swapDestinations: 'Swap departure and destination airports',
  addPassenger: 'Add another passenger',
  removePassenger: 'Remove passenger',
  expandDetails: 'Expand flight details',
  collapseDetails: 'Collapse flight details'
};

// Screen reader announcements
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Focus management
export const focusElement = (element: HTMLElement | null) => {
  if (element) {
    element.focus();
  }
};

export const focusFirstFocusable = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusableElements.length > 0) {
    (focusableElements[0] as HTMLElement).focus();
  }
};

export const focusLastFocusable = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusableElements.length > 0) {
    (focusableElements[focusableElements.length - 1] as HTMLElement).focus();
  }
};

// Keyboard navigation helpers
export const handleKeyDown = (
  event: React.KeyboardEvent,
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void,
  onArrowLeft?: () => void,
  onArrowRight?: () => void
) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      onEnter?.();
      break;
    case 'Escape':
      event.preventDefault();
      onEscape?.();
      break;
    case 'ArrowUp':
      event.preventDefault();
      onArrowUp?.();
      break;
    case 'ArrowDown':
      event.preventDefault();
      onArrowDown?.();
      break;
    case 'ArrowLeft':
      event.preventDefault();
      onArrowLeft?.();
      break;
    case 'ArrowRight':
      event.preventDefault();
      onArrowRight?.();
      break;
  }
};

// Form validation accessibility
export const getValidationMessage = (error: string | undefined): string => {
  return error || '';
};

export const getFieldAriaDescribedBy = (
  fieldId: string,
  error?: string,
  helperText?: string
): string | undefined => {
  const ids: string[] = [];
  
  if (error) {
    ids.push(`${fieldId}-error`);
  }
  
  if (helperText) {
    ids.push(`${fieldId}-helper`);
  }
  
  return ids.length > 0 ? ids.join(' ') : undefined;
};

// Loading state accessibility
export const getLoadingAriaLabel = (context: string): string => {
  return `Loading ${context}. Please wait.`;
};

// Status announcements
export const announceStatus = (status: 'success' | 'error' | 'info' | 'warning', message: string) => {
  const statusMessages = {
    success: `Success: ${message}`,
    error: `Error: ${message}`,
    info: `Information: ${message}`,
    warning: `Warning: ${message}`
  };
  
  announceToScreenReader(statusMessages[status], 'assertive');
};

// Skip links for keyboard navigation
export const createSkipLink = (targetId: string, label: string): JSX.Element => {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-900 text-white px-4 py-2 rounded z-50"
      onClick={(e) => {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
          target.focus();
          target.scrollIntoView();
        }
      }}
    >
      {label}
    </a>
  );
};





