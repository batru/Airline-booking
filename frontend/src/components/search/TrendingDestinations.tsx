import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { mockDestinations } from '../../utils/constants';

// Function to get destination images based on city name
const getDestinationImage = (city: string): string => {
  const imageMap: { [key: string]: string } = {
    'Nairobi': 'https://images.unsplash.com/photo-1484318571209-661cf29a69c3?w=800&auto=format&fit=crop', // Green landscape with winding river
    'Mombasa': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop', // Ocean wave with dramatic sunset
    'Mogadishu': 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&auto=format&fit=crop', // Person with backpack by mountain lake
'Hargeisa': 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&auto=format&fit=crop' 

};
  
  return imageMap[city] || 'https://images.unsplash.com/photo-1488646950254-3d592ad4a74f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
};

export const TrendingDestinations: React.FC = () => {
  return (
    <div className="mt-8 sm:mt-12 lg:mt-16">
      <Card className="p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-responsive-xl font-bold text-gray-900 mb-2 sm:mb-3">Trending Destinations</h2>
          <p className="text-gray-600 text-responsive-sm">Discover amazing places for your next adventure</p>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mb-4 sm:mb-6 lg:mb-8">
          <button className="p-2 sm:p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 shadow-md">
            <ArrowLeft className="text-gray-600" size={16} />
          </button>
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-primary-900 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
          <button className="p-2 sm:p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 shadow-md">
            <ArrowRight className="text-gray-600" size={16} />
          </button>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {mockDestinations.map((destination) => (
            <div
              key={destination.id}
              className="relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
            >
              {/* Destination Image */}
              <div className="h-40 sm:h-48 relative overflow-hidden">
                <img
                  src={getDestinationImage(destination.city)}
                  alt={`${destination.city}, ${destination.country}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              {/* Price Tag */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-primary-900 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                ${destination.price}
              </div>
              
              {/* Destination Info */}
              <div className="p-3 sm:p-4 lg:p-5">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                  {destination.city}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">
                  {destination.country}
                </p>
                <div className="mt-1 sm:mt-2 text-xs text-gray-500">
                  Starting from
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Text */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-gray-500 text-xs sm:text-sm">
            Book now and save up to 30% on selected destinations
          </p>
        </div>
      </Card>
    </div>
  );
};
