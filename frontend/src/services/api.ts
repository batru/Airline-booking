// API Configuration
// Using Vite proxy - requests to /api/* will be forwarded to backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Normalize baseURL to not have trailing slash
      const baseURL = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
      // Normalize endpoint to always start with /
      const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      const url = `${baseURL}${normalizedEndpoint}`;
      console.log('🌐 API Request:', url);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Bookings API
  async createBooking(bookingData: any) {
    return this.request('bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getBookingByReference(reference: string) {
    return this.request(`bookings/${reference}`);
  }

  async cancelBooking(reference: string) {
    return this.request(`bookings/${reference}`, {
      method: 'DELETE',
    });
  }

  // Payments API
  async initializePayment(paymentData: any) {
    return this.request('payments/initialize', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async verifyPayment(paymentReference: string) {
    return this.request(`payments/verify/${paymentReference}`);
  }

  async getPublicKey() {
    return this.request('payments/public-key');
  }

  // Admin API
  async adminLogin(credentials: { email: string; password: string }) {
    const response = await this.request('auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data?.token) {
      localStorage.setItem('admin_token', response.data.token);
    }
    
    return response;
  }

  async getAllBookings(params?: { status?: string; page?: number; limit?: number; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const query = queryParams.toString();
    return this.request(`admin/bookings${query ? `?${query}` : ''}`, {
      headers: this.getAuthHeaders(),
    });
  }

  async getBookingById(id: number) {
    return this.request(`admin/bookings/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  async updateBookingStatus(id: number, status: string) {
    return this.request(`admin/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      headers: this.getAuthHeaders(),
    });
  }

  async getAnalytics(period?: string) {
    const query = period ? `?period=${period}` : '';
    return this.request(`admin/analytics${query}`, {
      headers: this.getAuthHeaders(),
    });
  }

  async getDashboardStats() {
    return this.request('admin/stats', {
      headers: this.getAuthHeaders(),
    });
  }

  // Check authentication
  private getAuthHeaders() {
    const token = localStorage.getItem('admin_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  
  // Logout
  logout() {
    localStorage.removeItem('admin_token');
  }
  
  // Check if logged in
  isAuthenticated() {
    return !!localStorage.getItem('admin_token');
  }
}

export const apiService = new ApiService();
export default apiService;

