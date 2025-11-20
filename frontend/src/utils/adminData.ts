import { Booking, DashboardMetrics } from '../types/admin';

// Mock admin credentials
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Mock dashboard metrics
export const mockDashboardMetrics: DashboardMetrics = {
  totalBookings: 3,
  confirmedBookings: 2,
  totalRevenue: 977.64,
  totalPassengers: 3,
  cancellations: 1,
  cancelRate: 33.3
};

// Mock bookings data
export const mockBookings: Booking[] = [
  {
    id: '1',
    reference: 'BKXY4F21',
    passenger: {
      name: 'Abdirahman Mohamed',
      email: 'abdirahman.mohamed@email.com'
    },
    flight: {
      number: 'JA-101',
      route: 'Mogadishu → Nairobi'
    },
    date: '11/15/2025',
    amount: 683.76,
    status: 'confirmed'
  },
  {
    id: '2',
    reference: 'BK9A2C8E',
    passenger: {
      name: 'Fatima Hassan',
      email: 'fatima.hassan@email.com'
    },
    flight: {
      number: 'EA-205',
      route: 'Nairobi → Kismayo'
    },
    date: '11/16/2025',
    amount: 293.88,
    status: 'confirmed'
  },
  {
    id: '3',
    reference: 'BKDF7H3G',
    passenger: {
      name: 'Ahmed Yusuf',
      email: 'ahmed.yusuf@email.com'
    },
    flight: {
      number: 'SA-450',
      route: 'Hargeisa → Mombasa'
    },
    date: '11/14/2025',
    amount: 461.88,
    status: 'cancelled'
  }
];


