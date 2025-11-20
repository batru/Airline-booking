import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Lock } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { PaymentData, Flight, Passenger, PaymentSummary } from '../../types';

interface PaymentFormProps {
  flight: Flight;
  passenger: Passenger;
  onNext: (paymentData: PaymentData) => void;
  isLoading?: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ flight, passenger, onNext, isLoading = false }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa'>('card');

  const paymentSummary: PaymentSummary = {
    ticketPrice: flight.price,
    taxes: 29.88,
    serviceFee: 15.00,
    total: flight.price + 29.88 + 15.00
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paymentData: PaymentData = {
      method: paymentMethod
    };
    onNext(paymentData);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Payment Method & M-Pesa */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Payment Method Selection */}
          <Card>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Payment Method</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Secure payment via Paystack</p>
            
            <div className="space-y-3 sm:space-y-4">
              <label className={`flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                paymentMethod === 'card' 
                  ? 'border-primary-900 bg-primary-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                  className="mr-2 sm:mr-3"
                />
                <CreditCard className="mr-2 sm:mr-3 text-gray-600" size={18} />
                <div className="flex-1">
                  <span className="font-medium text-sm sm:text-base">Credit/Debit Card (Paystack)</span>
                  <p className="text-xs text-gray-500 mt-1">Visa, Mastercard, Verve, and more</p>
                </div>
              </label>

              <label className={`flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-colors opacity-50 ${
                paymentMethod === 'mpesa' 
                  ? 'border-primary-900 bg-primary-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mpesa"
                  checked={paymentMethod === 'mpesa'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'mpesa')}
                  className="mr-2 sm:mr-3"
                  disabled
                />
                <Smartphone className="mr-2 sm:mr-3 text-gray-600" size={18} />
                <div className="flex-1">
                  <span className="font-medium text-sm sm:text-base">M-Pesa</span>
                  <p className="text-xs text-gray-500 mt-1">Coming soon</p>
                </div>
              </label>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>🔒 Secure Payment:</strong> You will be redirected to Paystack's secure payment page to complete your transaction.
              </p>
            </div>
          </Card>

          {/* Payment Info */}
          <Card>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center text-gray-700">
                <Lock className="mr-2 text-green-600" size={16} />
                <span>Your payment is secured by Paystack (PCI DSS Level 1)</span>
              </div>
              <div className="flex items-center text-gray-700">
                <CreditCard className="mr-2 text-green-600" size={16} />
                <span>Accepting Visa, Mastercard, Verve, and USSD</span>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="mr-2">📱</span>
                <span>Instant payment confirmation</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">What happens after payment:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li>You'll be redirected to Paystack's secure checkout</li>
                <li>Enter your card details and complete payment</li>
                <li>You'll automatically return to your booking confirmation</li>
                <li>Booking confirmation email will be sent to your email</li>
              </ol>
            </div>
          </Card>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="font-medium text-gray-900">{flight.airline} {flight.flightNumber}</p>
                <p className="text-sm text-gray-600">{flight.departure.city} → {flight.arrival.city}</p>
              </div>
              
              <div>
                <p className="font-medium text-gray-900">1. {passenger.firstName} {passenger.lastName}</p>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ticket Price (1x ${flight.price})</span>
                <span className="text-gray-900">${flight.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxes & Fees</span>
                <span className="text-gray-900">${paymentSummary.taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Fee</span>
                <span className="text-gray-900">${paymentSummary.serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span>${paymentSummary.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 space-y-3">
              <Button
                type="button"
                onClick={handleSubmit}
                className="w-full"
                disabled={isLoading}
                leftIcon={<Lock size={16} />}
              >
                {isLoading ? 'Processing...' : `Continue to Payment — $${paymentSummary.total.toFixed(2)}`}
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/results')}
                className="w-full"
                leftIcon={<span>←</span>}
              >
                Back to Flights
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

