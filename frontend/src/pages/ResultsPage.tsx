import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { FlightCard } from '../components/flights/FlightCard';
import { Filters } from '../components/flights/Filters';
import { SkeletonCard, PageLoader } from '../components/ui/Loading';
import { Alert } from '../components/ui/Alert';
import { mockFlights } from '../utils/constants';
import { SearchData, Flight, FilterState } from '../types';

export const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFlight, setSelectedFlight] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location.state) {
      setSearchData(location.state as SearchData);
      // Simulate API call delay
      setTimeout(() => {
        setFlights(mockFlights);
        setIsLoading(false);
      }, 1500);
    } else {
      // If no search data, redirect to search page
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleSelectFlight = (flightId: string) => {
    setSelectedFlight(flightId);
    const selectedFlight = flights.find(f => f.id === flightId);
    if (selectedFlight) {
      // Add a small delay for better UX
      setTimeout(() => {
        navigate('/booking', { 
          state: { 
            flight: selectedFlight, 
            searchData 
          } 
        });
      }, 300);
    }
  };

  const handleFilterChange = (filters: FilterState) => {
    setIsLoading(true);
    
    // Simulate filter processing delay
    setTimeout(() => {
      let filteredFlights = [...mockFlights];

      // Filter by airlines
      if (filters.airlines.length > 0) {
        filteredFlights = filteredFlights.filter(flight => 
          filters.airlines.includes(flight.airline)
        );
      }

      // Filter by stops
      if (filters.stops.length > 0) {
        filteredFlights = filteredFlights.filter(flight => 
          filters.stops.includes(flight.stops)
        );
      }

      // Filter by cabin class
      if (filters.cabinClass) {
        filteredFlights = filteredFlights.filter(flight => 
          flight.cabinClass === filters.cabinClass
        );
      }

      setFlights(filteredFlights);
      setIsLoading(false);
    }, 500);
  };

  if (!searchData) {
    return <PageLoader message="Loading search results..." />;
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed animate-fade-in"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')`
        }}
      />
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <Header currentPage="results" />
        <main className="container mx-auto px-4 py-6 sm:py-8 relative z-10">
          <div className="mb-4 sm:mb-6 md:mb-8 animate-slide-up">
            <h1 className="text-responsive-2xl font-bold text-white mb-2">Available Flights</h1>
            <p className="text-gray-200 text-responsive-sm">
              {searchData.from} → {searchData.to} • {new Date(searchData.departure).toLocaleDateString()} • {searchData.passengers} passenger(s)
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Flights List */}
            <div className="lg:col-span-3">
              {isLoading ? (
                // Loading skeleton
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonCard key={index} className="animate-pulse" />
                  ))}
                </div>
              ) : flights.length > 0 ? (
                // Flight results with staggered animation
                <div className="space-y-4">
                  {flights.map((flight, index) => (
                    <div
                      key={flight.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <FlightCard
                        flight={flight}
                        onSelect={handleSelectFlight}
                        selected={selectedFlight === flight.id}
                        loading={selectedFlight === flight.id}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                // No results found
                <div className="text-center py-8 sm:py-12 animate-fade-in">
                  <Alert
                    type="info"
                    title="No flights found"
                    className="max-w-md mx-auto"
                  >
                    No flights found matching your criteria. Try adjusting your filters or search dates.
                  </Alert>
                </div>
              )}
            </div>

            {/* Filters */}
            <div className="lg:col-span-1">
              <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <Filters
                  onFilterChange={handleFilterChange}
                  flightCount={flights.length}
                />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};