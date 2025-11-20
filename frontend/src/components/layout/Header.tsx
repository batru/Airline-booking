import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentPage?: 'search' | 'results' | 'booking' | 'admin';
}

export const Header: React.FC<HeaderProps> = ({ currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="h-16 sm:h-20 bg-stone-100 shadow-sm relative z-40">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-900 rounded-full flex items-center justify-center">
            <span className="text-white text-sm sm:text-lg font-bold">S</span>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">SkyBooker</h1>
            <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Airline Association</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link 
            to="/" 
            className={`text-gray-700 hover:text-primary-900 transition-colors ${
              currentPage === 'search' ? 'text-primary-900 font-semibold' : ''
            }`}
          >
            Flights
          </Link>
          <Link 
            to="/contact" 
            className="text-gray-700 hover:text-primary-900 transition-colors"
          >
            Contact Us
          </Link>
        </nav>

        {/* Desktop Admin Login */}
        <Link 
          to={currentPage === 'admin' ? '/' : '/admin/login'} 
          className="hidden sm:flex bg-primary-900 text-white px-3 py-2 rounded-lg hover:bg-primary-800 transition-colors items-center space-x-1 text-sm"
        >
          <User size={14} />
          <span>{currentPage === 'admin' ? 'BACK TO SITE' : 'ADMIN LOGIN'}</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg relative z-50">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Navigation */}
            <nav className="space-y-3">
              <Link 
                to="/" 
                className={`block py-2 text-gray-700 hover:text-primary-900 transition-colors ${
                  currentPage === 'search' ? 'text-primary-900 font-semibold' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Flights
              </Link>
              <Link 
                to="/contact" 
                className="block py-2 text-gray-700 hover:text-primary-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </nav>

            {/* Mobile Admin Login */}
            <Link 
              to={currentPage === 'admin' ? '/' : '/admin/login'} 
              className="flex items-center space-x-2 bg-primary-900 text-white px-4 py-3 rounded-lg hover:bg-primary-800 transition-colors text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User size={16} />
              <span>{currentPage === 'admin' ? 'BACK TO SITE' : 'ADMIN LOGIN'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};