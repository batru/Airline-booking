import React, { useState } from 'react';
import { FilterState } from '../../types';
import { airlines, stopsOptions, cabinClasses } from '../../utils/constants';

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
  flightCount: number;
}

export const Filters: React.FC<FiltersProps> = ({ onFilterChange, flightCount }) => {
  const [filters, setFilters] = useState<FilterState>({
    airlines: [],
    stops: [],
    cabinClass: 'Economy'
  });

  const handleAirlineChange = (airline: string) => {
    const newAirlines = filters.airlines.includes(airline)
      ? filters.airlines.filter(a => a !== airline)
      : [...filters.airlines, airline];
    
    const newFilters = { ...filters, airlines: newAirlines };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStopChange = (stop: string) => {
    const newStops = filters.stops.includes(stop)
      ? filters.stops.filter(s => s !== stop)
      : [...filters.stops, stop];
    
    const newFilters = { ...filters, stops: newStops };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCabinClassChange = (cabinClass: string) => {
    const newFilters = { ...filters, cabinClass };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Filters</h3>
        <p className="text-xs sm:text-sm text-gray-600">{flightCount} flights</p>
      </div>

      {/* Airlines */}
      <div className="mb-4 sm:mb-6">
        <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Airlines</h4>
        <div className="space-y-1 sm:space-y-2">
          {airlines.map((airline) => (
            <label key={airline} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.airlines.includes(airline)}
                onChange={() => handleAirlineChange(airline)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-xs sm:text-sm text-gray-700">{airline}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stops */}
      <div className="mb-4 sm:mb-6">
        <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Stops</h4>
        <div className="space-y-1 sm:space-y-2">
          {stopsOptions.map((stop) => (
            <label key={stop} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.stops.includes(stop)}
                onChange={() => handleStopChange(stop)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-xs sm:text-sm text-gray-700">{stop}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cabin Class */}
      <div className="mb-4 sm:mb-6">
        <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Cabin Class</h4>
        <div className="space-y-1 sm:space-y-2">
          {cabinClasses.map((cabinClass) => (
            <label key={cabinClass} className="flex items-center space-x-2">
              <input
                type="radio"
                name="cabinClass"
                value={cabinClass}
                checked={filters.cabinClass === cabinClass}
                onChange={() => handleCabinClassChange(cabinClass)}
                className="border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-xs sm:text-sm text-gray-700">{cabinClass}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

