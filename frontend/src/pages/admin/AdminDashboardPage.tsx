import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, LineChart, XCircle, X, AlertTriangle, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { apiService } from '../../services/api';
import { Booking } from '../../types/admin';

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
    totalPassengers: 0,
    cancellations: 0,
    cancelRate: 0
  });
  const [activeFilter, setActiveFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Input field value
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch bookings and metrics from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Check authentication
        const token = localStorage.getItem('admin_token');
        if (!token) {
          navigate('/admin/login');
          return;
        }

        // Fetch bookings with pagination and search
        const bookingsResponse = await apiService.getAllBookings({
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery.trim() || undefined // Pass search query to backend
        });
        if (bookingsResponse.success && bookingsResponse.data) {
          // Store pagination info from backend
          if (bookingsResponse.data.pagination) {
            setPaginationInfo({
              totalPages: bookingsResponse.data.pagination.totalPages,
              totalItems: bookingsResponse.data.pagination.totalItems,
              currentPage: bookingsResponse.data.pagination.currentPage,
              itemsPerPage: bookingsResponse.data.pagination.itemsPerPage
            });
          }

          // Transform bookings
          if (bookingsResponse.data.bookings) {
            const transformedBookings = bookingsResponse.data.bookings.map((b: any) => ({
              id: b.id.toString(),
              reference: b.bookingReference,
              passenger: {
                name: b.passengers?.[0]?.firstName + ' ' + b.passengers?.[0]?.lastName || 'N/A',
                email: b.passengers?.[0]?.email || 'N/A'
              },
              flight: {
                number: b.flightSnapShot?.outbound?.flight_number || 'N/A',
                route: `${b.flightSnapShot?.outbound?.origin_code || 'N/A'} → ${b.flightSnapShot?.outbound?.destination_code || 'N/A'}`
              },
              date: new Date().toLocaleDateString(),
              amount: b.totalAmount || 0,
              status: b.bookingStatus
            }));
            setBookings(transformedBookings);
          }
        }

        // Fetch analytics for metrics
        const analyticsResponse = await apiService.getDashboardStats();
        if (analyticsResponse.success && analyticsResponse.data) {
          setMetrics(analyticsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate, currentPage, searchQuery]); // Re-fetch when page or search changes

  const handleSearch = () => {
    setSearchQuery(searchInput); // Apply search when button clicked
    setCurrentPage(1); // Reset to page 1
  };

  const handleClearSearch = () => {
    setSearchInput(''); // Clear input field
    setSearchQuery(''); // Clear search
    setCurrentPage(1); // Reset to page 1
  };

  useEffect(() => {
    // Reset to page 1 when filter changes
    setCurrentPage(1);
  }, [activeFilter]);

  useEffect(() => {
    // Client-side filtering for status only (search is handled by backend)
    let filtered = bookings;
    
    // Apply status filter (client-side since backend pagination handles search)
    if (activeFilter === 'confirmed') {
      filtered = bookings.filter(booking => booking.status === 'confirmed');
    } else if (activeFilter === 'cancelled') {
      filtered = bookings.filter(booking => booking.status === 'cancelled');
    }
    
    setFilteredBookings(filtered);
  }, [bookings, activeFilter]);

  // Use backend pagination data if available
  const [paginationInfo, setPaginationInfo] = useState({
    totalPages: 0,
    totalItems: 0,
    currentPage: 1,
    itemsPerPage: 10
  });

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setBookingToCancel(booking);
      setShowCancelModal(true);
    }
  };

  const confirmCancelBooking = async () => {
    if (bookingToCancel) {
      try {
        const response = await apiService.updateBookingStatus(parseInt(bookingToCancel.id), 'cancelled');
        if (response.success) {
          // Update local state
          setBookings(prev => 
            prev.map(booking => 
              booking.id === bookingToCancel.id 
                ? { ...booking, status: 'cancelled' as const }
                : booking
            )
          );
        }
      } catch (error) {
        console.error('Error cancelling booking:', error);
      } finally {
        setShowCancelModal(false);
        setBookingToCancel(null);
      }
    }
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setBookingToCancel(null);
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showCancelModal) {
        closeCancelModal();
      }
    };

    if (showCancelModal) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [showCancelModal]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('adminLoggedIn');
    apiService.logout();
    navigate('/admin/login');
  };

  const getFilterCounts = () => {
    // Get counts based on current search results
    let baseBookings = bookings;
    
    // Apply search filter if there's a search query
    if (searchQuery.trim()) {
      baseBookings = bookings.filter(booking => 
        booking.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.passenger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.passenger.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.flight.number.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    const all = baseBookings.length;
    const confirmed = baseBookings.filter(b => b.status === 'confirmed').length;
    const cancelled = baseBookings.filter(b => b.status === 'cancelled').length;
    return { all, confirmed, cancelled };
  };

  const counts = getFilterCounts();

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')`
        }}
      />
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <Header currentPage="admin" />
        
        {/* Dashboard Content */}
        <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8 relative z-10 max-w-7xl overflow-hidden">
        {/* Dashboard Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          {/* Total Bookings */}
          <Card>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-xs sm:text-sm font-medium text-gray-600">Total Bookings</h3>
              <Users className="text-primary-900" size={16} />
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
              {metrics.totalBookings}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              {metrics.confirmedBookings} confirmed
            </p>
          </Card>

          {/* Total Revenue */}
          <Card>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</h3>
              <DollarSign className="text-primary-900" size={16} />
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
              ${metrics.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              From confirmed bookings
            </p>
          </Card>

          {/* Total Passengers */}
          <Card>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-xs sm:text-sm font-medium text-gray-600">Total Passengers</h3>
              <LineChart className="text-primary-900" size={16} />
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
              {metrics.totalPassengers}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Active passengers
            </p>
          </Card>

          {/* Cancellations */}
          <Card>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-xs sm:text-sm font-medium text-gray-600">Cancellations</h3>
              <XCircle className="text-primary-900" size={16} />
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
              {metrics.cancellations}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              {metrics.cancelRate}% cancel rate
            </p>
          </Card>
        </div>

        {/* Booking Management Section */}
        <Card>
          <div className="mb-3 sm:mb-4 lg:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Booking Management</h2>
            <p className="text-gray-600 text-xs sm:text-sm lg:text-base">View and manage flight bookings</p>
          </div>

          {/* Search Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by booking reference..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base bg-white"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="px-6"
                leftIcon={<Search size={16} />}
              >
                Search
              </Button>
              {searchQuery && (
                <Button
                  variant="secondary"
                  onClick={handleClearSearch}
                  className="px-6"
                >
                  Clear
                </Button>
              )}
            </div>
            {searchQuery && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-blue-800">
                    <strong>Search:</strong> "{searchQuery}"
                  </p>
                  <button
                    onClick={handleClearSearch}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear search
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4 lg:mb-6 overflow-x-auto">
            {[
              { key: 'all', label: `All (${counts.all})` },
              { key: 'confirmed', label: `Confirmed (${counts.confirmed})` },
              { key: 'cancelled', label: `Cancelled (${counts.cancelled})` }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key as any)}
                className={`px-2 py-1 sm:px-3 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeFilter === filter.key
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Bookings Table - Desktop */}
          <div className="hidden lg:block">
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search size={48} className="mx-auto" />
                </div>
                <p className="text-lg text-gray-600 mb-2">
                  {searchQuery ? 'No bookings found matching your search' : 'No bookings found'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                  >
                    Clear search to see all bookings
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-semibold text-gray-900 text-sm">Reference</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-900 text-sm">Passenger</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-900 text-sm">Flight</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-900 text-sm">Route</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-900 text-sm">Date</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-900 text-sm">Amount</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-900 text-sm">Status</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-900 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium text-gray-900 text-sm">{booking.reference}</td>
                    <td className="py-3 px-3">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{booking.passenger.name}</div>
                        <div className="text-xs text-gray-600">{booking.passenger.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-900 text-sm">{booking.flight.number}</td>
                    <td className="py-3 px-3 text-gray-900 text-sm">{booking.flight.route}</td>
                    <td className="py-3 px-3 text-gray-900 text-sm">{booking.date}</td>
                    <td className="py-3 px-3 font-medium text-gray-900 text-sm">${booking.amount.toFixed(2)}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed'
                          ? 'bg-primary-900 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {booking.status === 'confirmed' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                          className="bg-red-500 text-white hover:bg-red-600 text-xs px-2 py-1"
                        >
                          Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                  ))}
                </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bookings Cards - Mobile */}
          <div className="lg:hidden space-y-3 overflow-hidden">
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <Search size={32} className="mx-auto" />
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {searchQuery ? 'No bookings found matching your search' : 'No bookings found'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-primary-600 hover:text-primary-800 font-medium"
                  >
                    Clear search to see all bookings
                  </button>
                )}
              </div>
            ) : (
              bookings.map((booking) => (
              <div key={booking.id} className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200 w-full overflow-hidden">
                <div className="flex justify-between items-start mb-2 sm:mb-3">
                  <div>
                    <div className="font-medium text-gray-900 text-xs sm:text-sm">{booking.reference}</div>
                    <div className="text-xs text-gray-600">{booking.flight.number}</div>
                  </div>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed'
                      ? 'bg-primary-900 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-3">
                  <div className="overflow-hidden">
                    <div className="font-medium text-gray-900 text-xs sm:text-sm truncate">{booking.passenger.name}</div>
                    <div className="text-xs text-gray-600 truncate">{booking.passenger.email}</div>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-900 truncate">{booking.flight.route}</div>
                  <div className="text-xs sm:text-sm text-gray-900">{booking.date}</div>
                  <div className="font-medium text-gray-900 text-sm">${booking.amount.toFixed(2)}</div>
                </div>
                
                {booking.status === 'confirmed' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleCancelBooking(booking.id)}
                    className="w-full bg-red-500 text-white hover:bg-red-600 text-xs sm:text-sm py-2"
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            ))
            )}
          </div>

          {/* Pagination Controls */}
          {paginationInfo.totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, paginationInfo.totalItems)} of {paginationInfo.totalItems} bookings
              </div>
              
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <Button
                  variant="secondary"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm"
                >
                  Previous
                </Button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: paginationInfo.totalPages }, (_, i) => {
                    const page = i + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === paginationInfo.totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-3 py-1 text-sm rounded ${
                            currentPage === page
                              ? 'bg-primary-900 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 3 || page === currentPage + 3) {
                      return <span key={page} className="px-2">...</span>;
                    }
                    return null;
                  })}
                </div>

                {/* Next Button */}
                <Button
                  variant="secondary"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === paginationInfo.totalPages}
                  className="px-3 py-1 text-sm"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Logout Button */}
        <div className="mt-6 sm:mt-8 text-center">
          <Button
            variant="secondary"
            onClick={handleLogout}
            className="flex items-center space-x-2 mx-auto text-sm sm:text-base px-4 py-2"
          >
            <X size={14} />
            <span>Logout</span>
          </Button>
        </div>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && bookingToCancel && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden"
          onClick={closeCancelModal}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <div className="flex-shrink-0">
                  <AlertTriangle className="text-red-500" size={20} />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Confirm Cancellation
                </h3>
              </div>

              {/* Modal Body */}
              <div className="mb-4 sm:mb-6">
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                  Are you sure you want to cancel this booking? This action cannot be undone.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 overflow-hidden">
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Booking Reference:</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">{bookingToCancel.reference}</span>
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Passenger:</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">{bookingToCancel.passenger.name}</span>
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Flight:</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">{bookingToCancel.flight.route}</span>
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Amount:</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-900">${bookingToCancel.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  variant="secondary"
                  onClick={closeCancelModal}
                  className="w-full sm:w-auto order-2 sm:order-1 text-xs sm:text-sm py-2"
                >
                  Keep Booking
                </Button>
                <Button
                  onClick={confirmCancelBooking}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 order-1 sm:order-2 text-xs sm:text-sm py-2"
                >
                  Yes, Cancel Booking
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;