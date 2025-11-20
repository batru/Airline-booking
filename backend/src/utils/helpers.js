// Helper functions

/**
 * Generate unique booking reference
 * Format: [A-Z]{2}[0-9]{6}
 * Example: AB123456
 */
export const generateBookingReference = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const prefix = Array.from({ length: 2 }, () => 
    letters[Math.floor(Math.random() * letters.length)]
  ).join('');
  
  const numbers = Math.floor(100000 + Math.random() * 900000);
  
  return `${prefix}${numbers}`;
};

/**
 * Generate unique payment reference
 * Format: PAY[0-9]{6}
 * Example: PAY123456
 */
export const generatePaymentReference = () => {
  const number = Math.floor(100000 + Math.random() * 900000);
  return `PAY${number}`;
};

/**
 * Calculate flight price with taxes
 * @param {number} basePrice - Base price of the flight
 * @param {number} passengerCount - Number of passengers
 * @returns {number} Total price with taxes
 */
export const calculateTotalPrice = (basePrice, passengerCount = 1) => {
  const taxRate = 0.05; // 5% tax
  const serviceFee = 2000; // Per booking
  
  const subtotal = basePrice * passengerCount;
  const taxes = subtotal * taxRate;
  const total = subtotal + taxes + serviceFee;
  
  return Math.round(total * 100) / 100; // Round to 2 decimals
};

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'NGN') => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 */
export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

