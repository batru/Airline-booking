import React from 'react';
import { Clock, Plane, MapPin } from 'lucide-react';
import { Flight } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface FlightCardProps {
  flight: Flight;
  onSelect: (flightId: string) => void;
  selected?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

export const FlightCard: React.FC<FlightCardProps> = ({ 
  flight, 
  onSelect, 
  selected = false, 
  loading = false, 
  disabled = false 
}) => {
  return (
    <Card
      selected={selected}
      loading={loading}
      disabled={disabled}
      hover={!disabled}
      onClick={disabled ? undefined : () => onSelect(flight.id)}
      className="mb-4"
    >
      {/* Mobile Layout */}
      <div className="block sm:hidden">
        {/* Airline Info */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{flight.airline}</h3>
            <p className="text-xs text-gray-600">{flight.flightNumber}</p>
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mt-1">
              {flight.cabinClass}
            </span>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-primary-900">${flight.price}</div>
            <div className="text-xs text-blue-600 flex items-center gap-1">
              <MapPin size={12} />
              {flight.seatsAvailable} seats
            </div>
          </div>
        </div>

        {/* Flight Times */}
        <div className="flex justify-between items-center mb-3">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{flight.departure.time}</div>
            <div className="text-xs text-gray-600">{flight.departure.airport}</div>
            <div className="text-xs text-gray-500">{flight.departure.city}</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
              <Clock size={12} />
              {flight.duration}
            </div>
            <div className="w-8 h-px bg-gray-300 my-1"></div>
            <div className="text-xs text-gray-500">{flight.stops}</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{flight.arrival.time}</div>
            <div className="text-xs text-gray-600">{flight.arrival.airport}</div>
            <div className="text-xs text-gray-500">{flight.arrival.city}</div>
          </div>
        </div>

        {/* Select Button */}
        <Button
          onClick={() => onSelect(flight.id)}
          disabled={disabled}
          loading={loading}
          className="w-full"
          size="sm"
        >
          {selected ? 'Selected' : 'Select Flight'}
        </Button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center justify-between">
        {/* Left Section - Airline & Flight Info */}
        <div className="flex items-center space-x-6 flex-1">
          {/* Airline Info */}
          <div className="min-w-[120px]">
            <h3 className="font-semibold text-gray-900 text-sm">{flight.airline}</h3>
            <p className="text-xs text-gray-600">{flight.flightNumber}</p>
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mt-1">
              {flight.cabinClass}
            </span>
          </div>

          {/* Departure */}
          <div className="text-center min-w-[80px]">
            <div className="text-xl font-bold text-gray-900">{flight.departure.time}</div>
            <div className="text-xs text-gray-600 font-medium">{flight.departure.airport}</div>
            <div className="text-xs text-gray-500">{flight.departure.city}</div>
            <div className="text-xs text-blue-600 mt-1 flex items-center justify-center gap-1">
              <MapPin size={10} />
              {flight.seatsAvailable} seats
            </div>
          </div>

          {/* Duration & Stops */}
          <div className="flex flex-col items-center min-w-[100px]">
            <div className="text-sm text-gray-500 font-medium flex items-center gap-1">
              <Clock size={12} />
              {flight.duration}
            </div>
            <div className="w-12 h-px bg-gray-300 my-1"></div>
            <div className="text-xs text-gray-500">{flight.stops}</div>
          </div>

          {/* Arrival */}
          <div className="text-center min-w-[80px]">
            <div className="text-xl font-bold text-gray-900">{flight.arrival.time}</div>
            <div className="text-xs text-gray-600 font-medium">{flight.arrival.airport}</div>
            <div className="text-xs text-gray-500">{flight.arrival.city}</div>
          </div>
        </div>

        {/* Right Section - Price & Button */}
        <div className="text-right flex flex-col items-end space-y-2">
          <div className="text-2xl font-bold text-primary-900">${flight.price}</div>
          <Button
            onClick={() => onSelect(flight.id)}
            disabled={disabled}
            loading={loading}
            size="sm"
            variant={selected ? 'secondary' : 'primary'}
          >
            {selected ? 'Selected' : 'Select'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
