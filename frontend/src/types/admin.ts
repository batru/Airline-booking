// Admin Types
export interface AdminUser {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'super_admin';
}

export interface Booking {
  id: string;
  reference: string;
  passenger: {
    name: string;
    email: string;
  };
  flight: {
    number: string;
    route: string;
  };
  date: string;
  amount: number;
  status: 'confirmed' | 'cancelled';
}

export interface DashboardMetrics {
  totalBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  totalPassengers: number;
  cancellations: number;
  cancelRate: number;
}

export interface AdminLoginCredentials {
  username: string;
  password: string;
}


