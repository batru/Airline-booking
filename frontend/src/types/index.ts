// Search Types
export interface SearchData {
  from: string;
  to: string;
  departure: string;
  return?: string;
  passengers: number;
  tripType: 'round' | 'oneway' | 'multi';
}

// Flight Types
export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    time: string;
    airport: string;
    city: string;
  };
  arrival: {
    time: string;
    airport: string;
    city: string;
  };
  duration: string;
  stops: string;
  price: number;
  seatsAvailable: number;
  cabinClass: string;
}

// Passenger Types
export interface Passenger {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  documentType?: 'passport' | 'id';
  documentNumber?: string;
}

// Payment Types
export interface PaymentData {
  method: 'card' | 'mpesa';
  cardDetails?: CardDetails;
  mpesaNumber?: string;
}

export interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

// Booking Types
export interface BookingConfirmation {
  reference: string;
  flight: Flight;
  passenger: Passenger;
  payment: PaymentSummary;
}

export interface PaymentSummary {
  ticketPrice: number;
  taxes: number;
  serviceFee: number;
  total: number;
}

// Filter Types
export interface FilterState {
  airlines: string[];
  stops: string[];
  cabinClass: string;
}

// Destination Types
export interface Destination {
  id: string;
  city: string;
  country: string;
  price: number;
  image: string;
}