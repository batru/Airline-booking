import { Flight, Destination } from '../types';

// Mock flight data
export const mockFlights: Flight[] = [
  {
    id: '1',
    airline: 'Jubba Airways',
    flightNumber: 'JA-205',
    departure: {
      time: '10:15',
      airport: 'NBO',
      city: 'Nairobi'
    },
    arrival: {
      time: '14:00',
      airport: 'KMU',
      city: 'Kismayo'
    },
    duration: '3h 45m',
    stops: 'Non-stop',
    price: 249,
    seatsAvailable: 12,
    cabinClass: 'Economy'
  },
  {
    id: '2',
    airline: 'East African Airways',
    flightNumber: 'EA-205',
    departure: {
      time: '08:30',
      airport: 'NBO',
      city: 'Nairobi'
    },
    arrival: {
      time: '12:15',
      airport: 'KMU',
      city: 'Kismayo'
    },
    duration: '3h 45m',
    stops: 'Non-stop',
    price: 199,
    seatsAvailable: 8,
    cabinClass: 'Economy'
  },
  {
    id: '3',
    airline: 'Safari Air',
    flightNumber: 'SA-205',
    departure: {
      time: '16:45',
      airport: 'NBO',
      city: 'Nairobi'
    },
    arrival: {
      time: '20:30',
      airport: 'KMU',
      city: 'Kismayo'
    },
    duration: '3h 45m',
    stops: 'Non-stop',
    price: 349,
    seatsAvailable: 15,
    cabinClass: 'Economy'
  }
];

// Mock destination data
export const mockDestinations: Destination[] = [
  {
    id: '1',
    city: 'Nairobi',
    country: 'Kenya',
    price: 250,
    image: '/images/nairobi.jpg'
  },
  {
    id: '2',
    city: 'Mombasa',
    country: 'Kenya',
    price: 180,
    image: '/images/mombasa.jpg'
  },
  {
    id: '3',
    city: 'Mogadishu',
    country: 'Somalia',
    price: 220,
    image: '/images/mogadishu.jpg'
  },
  {
    id: '4',
    city: 'Hargeisa',
    country: 'Somalia',
    price: 200,
    image: '/images/hargeisa.jpg'
  }
];

// Airlines list
export const airlines = [
  'Jubba Airways',
  'East African Airways',
  'Safari Air'
];

// Stops options
export const stopsOptions = [
  'Non-stop',
  '1 stop',
  '2+ stops'
];

// Cabin class options
export const cabinClasses = [
  'Economy',
  'Business'
];


