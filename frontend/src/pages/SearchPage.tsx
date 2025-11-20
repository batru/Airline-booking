import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SearchForm } from '../components/search/SearchForm';
import { TrendingDestinations } from '../components/search/TrendingDestinations';
import { PageLoader } from '../components/ui/Loading';

export const SearchPage: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate initial page load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoader message="Loading SkyBooker..." />;
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
        <Header currentPage="search" />
        <main className="container mx-auto px-4 py-6 sm:py-8 relative z-10">
          <div className="space-y-6 sm:space-y-8">
            <div className="animate-slide-up">
              <SearchForm />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <TrendingDestinations />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

