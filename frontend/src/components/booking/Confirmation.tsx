import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Plane } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { BookingConfirmation } from '../../types';

interface ConfirmationProps {
  booking: BookingConfirmation;
  onDownloadTicket: () => void;
  onBookAnother: () => void;
}

export const Confirmation: React.FC<ConfirmationProps> = ({
  booking,
  onDownloadTicket,
  onBookAnother
}) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Confirmation Message */}
      <Card className="bg-green-50 border-green-200 border-2">
        <div className="text-center">
          <CheckCircle className="mx-auto text-green-600 mb-3 sm:mb-4" size={40} />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Your flight has been successfully booked</p>
          <div className="bg-white rounded-lg p-3 sm:p-4 inline-block">
            <p className="text-xs sm:text-sm text-gray-600">Booking Reference</p>
            <p className="text-lg sm:text-xl font-bold text-primary-900">{booking.reference}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Flight Details */}
        <Card>
          <div className="flex items-center space-x-2 mb-3 sm:mb-4">
            <Plane className="text-primary-900" size={18} />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Flight Details</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="font-medium text-gray-900">{booking.flight.airline}</p>
              <p className="text-sm text-gray-600">Flight {booking.flight.flightNumber}</p>
            </div>
            
            <div className="flex justify-between">
              <div>
                <p className="font-medium text-gray-900">{booking.flight.departure.time}</p>
                <p className="text-sm text-gray-600">{booking.flight.departure.airport}</p>
                <p className="text-sm text-gray-600">{booking.flight.departure.city}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{booking.flight.arrival.time}</p>
                <p className="text-sm text-gray-600">{booking.flight.arrival.airport}</p>
                <p className="text-sm text-gray-600">{booking.flight.arrival.city}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Passenger Information */}
        <Card>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Passenger Information</h3>
          
          <div className="space-y-2">
            <p className="font-medium text-gray-900">
              {booking.passenger.firstName} {booking.passenger.lastName}
            </p>
            <p className="text-sm text-gray-600">{booking.passenger.email}</p>
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
              Passenger 1
            </span>
          </div>
        </Card>

        {/* Payment Summary */}
        <Card>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Payment Summary</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Ticket Price (1x ${booking.flight.price})</span>
              <span className="text-gray-900">${booking.flight.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxes & Fees</span>
              <span className="text-gray-900">${booking.payment.taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Fee</span>
              <span className="text-gray-900">${booking.payment.serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total</span>
              <span>${booking.payment.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
        <Button
          onClick={onDownloadTicket}
          className="w-full sm:w-auto"
          leftIcon={<Download size={16} />}
        >
          Download Ticket
        </Button>
        
        <Button
          onClick={onBookAnother}
          className="w-full sm:w-auto"
          leftIcon={<Plane size={16} />}
        >
          Book Another Flight
        </Button>
      </div>

      {/* Confirmation Message */}
      <div className="text-center bg-white/90 backdrop-blur-sm rounded-lg p-4 mx-4 sm:mx-0">
        <p className="text-gray-800 font-medium text-sm sm:text-base">
          A confirmation email has been sent to <span className="text-primary-900 font-semibold">{booking.passenger.email}</span>
        </p>
      </div>
    </div>
  );
};

