import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BookingStepper } from '../components/booking/BookingStepper';
import { PassengerForm } from '../components/booking/PassengerForm';
import { PaymentForm } from '../components/booking/PaymentForm';
import { Confirmation } from '../components/booking/Confirmation';
import { Flight, Passenger, PaymentData, BookingConfirmation } from '../types';
import { apiService } from '../services/api';
import { Alert } from '../components/ui/Alert';

const BookingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [passenger, setPassenger] = useState<Passenger | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingReference, setBookingReference] = useState<string | null>(null);
  const [actualBookingData, setActualBookingData] = useState<any>(null);
  const [originalTotalAmount, setOriginalTotalAmount] = useState<number>(0);

  const verifyPaymentStatus = async (reference: string) => {
    setIsLoading(true);
    let retries = 0;
    const maxRetries = 10;
    
    try {
      // Poll for booking creation (webhook may take a moment)
      while (retries < maxRetries) {
        console.log(`🔄 Verifying payment... (attempt ${retries + 1}/${maxRetries})`);
        
        // Call verify endpoint to get payment and booking info
        const response = await apiService.verifyPayment(reference);
        
        console.log('📋 Payment verification response:', response);
        
                 if (response.success) {
           // If payment status is success but no booking yet, wait a bit
           if (response.data?.status === 'success' && !response.data?.booking) {
             console.log('⏳ Payment successful, waiting for booking creation...');
             
             if (response.data.message) {
               // Wait 1 second before retrying
               await new Promise(resolve => setTimeout(resolve, 1000));
               retries++;
               continue;
             }
           }
          
          // If we have booking data, proceed
          if (response.data?.booking) {
            const booking = response.data.booking;
            
            console.log('📋 Fetched booking data:', booking);
            
            // Store the actual booking data
            setActualBookingData(booking);
            
            // Set booking reference for display
            setBookingReference(booking.bookingReference);
            
            console.log('✅ Booking confirmed and data fetched');
            break; // Success - exit polling loop
          }
          
                     // If payment status indicates success, try one more time
           if (response.data?.status === 'success') {
             console.log('✅ Payment successful, booking may take a moment...');
             await new Promise(resolve => setTimeout(resolve, 2000));
             retries++;
             continue;
           }
        }
        
        retries++;
        if (retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      // If we exhausted retries and still no booking
      if (retries >= maxRetries && !actualBookingData) {
        console.error('❌ Booking not created after payment verification');
        setError('Payment was successful but booking creation is taking longer than expected. Please refresh or contact support.');
      }
    } catch (err: any) {
      console.error('❌ Failed to verify payment:', err);
      setError(err.message || 'Failed to verify payment status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if this is a return from Paystack payment
    const urlParams = new URLSearchParams(window.location.search);
    const paymentRef = urlParams.get('reference'); // This is the payment reference from Paystack
    
    if (paymentRef) {
      console.log('🔄 Return from Paystack with payment reference:', paymentRef);
      // User is returning from payment - immediately go to step 3
      setCurrentStep(3); // Show confirmation step immediately
      
      // Restore original amounts from localStorage
      const storedPayment = localStorage.getItem('paymentSummary');
      if (storedPayment) {
        const paymentData = JSON.parse(storedPayment);
        setOriginalTotalAmount(paymentData.total);
      }
      
      // Fetch the actual booking data to show dynamic information using payment reference
      verifyPaymentStatus(paymentRef);
      return;
    }

    // Normal booking flow
    if (location.state?.flight) {
      setFlight(location.state.flight);
    } else if (location.state?.passenger) {
      // If we somehow lost flight state but have passenger, try to reconstruct
      setPassenger(location.state.passenger);
    } else {
      // If no flight data, redirect to search page
      navigate('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, navigate]);

  const handlePassengerNext = (passengerData: Passenger) => {
    setPassenger(passengerData);
    setCurrentStep(2);
  };

  const handlePaymentNext = async (payment: PaymentData) => {
    setIsLoading(true);
    setError(null);
    setPaymentData(payment);

    try {
      // Create booking with backend API
      if (!flight || !passenger) {
        throw new Error('Missing flight or passenger data');
      }

      // Format data for backend API
      const totalAmount = flight.price + 29.88 + 15.00; // Total with taxes and fees
      const taxes = 29.88;
      const serviceFee = 15.00;
      
      // Store the original USD amounts for display (in localStorage to persist)
      setOriginalTotalAmount(totalAmount);
      localStorage.setItem('paymentSummary', JSON.stringify({
        ticketPrice: flight.price,
        taxes: taxes,
        serviceFee: serviceFee,
        total: totalAmount
      }));
      
      const bookingPayload = {
        passengers: [{
          title: 'Mr', // You can add this to passenger form
          firstName: passenger.firstName,
          lastName: passenger.lastName,
          email: passenger.email,
          phoneCode: '+1', // Extract from phone
          phoneNumber: passenger.phone,
          country: 'Kenya',
          documentType: passenger.documentType || 'passport',
          documentNumber: passenger.documentNumber || ''
        }],
        flightDetails: {
          totalAmount: totalAmount * 130, // Convert to KES (approximate rate)
          currency: 'KES',
          outbound: {
            flight_number: flight.flightNumber,
            airline_name: flight.airline,
            origin_code: flight.departure.airport,
            origin_name: flight.departure.city,
            destination_code: flight.arrival.airport,
            destination_name: flight.arrival.city,
            departure_time: new Date().toISOString(),
            arrival_time: new Date().toISOString()
          }
        },
        contactInfo: {
          email: passenger.email,
          phoneCode: '+1',
          phoneNumber: passenger.phone
        }
      };

      // Call backend to create booking draft (new payment-first flow)
      const bookingResponse = await apiService.createBooking(bookingPayload);
      
      if (!bookingResponse.success || !bookingResponse.data?.temporaryReference) {
        throw new Error(bookingResponse.error?.message || 'Failed to create booking draft');
      }

      const { temporaryReference } = bookingResponse.data;
      console.log('✅ Booking draft created:', temporaryReference);

      // Now initialize Paystack payment
      // Convert KES to cents (multiply by 100)
      const amountInKES = totalAmount * 130; // Convert USD to KES
      const amountInCents = Math.round(amountInKES * 100);
      
      // Initialize payment and get payment reference
      console.log('💳 Initializing payment with draft reference:', temporaryReference);
      const paymentInitResponse = await apiService.initializePayment({
        draftReference: temporaryReference,
        amount: amountInCents,
        currency: 'KES',
        customer: {
          email: passenger.email,
          first_name: passenger.firstName,
          last_name: passenger.lastName,
          phone: passenger.phone
        },
        callback_url: `${window.location.origin}/booking`
      });
      
      if (paymentInitResponse.success && paymentInitResponse.data?.authorizationUrl) {
        console.log('✅ Payment initialized:', paymentInitResponse.data);
        // Store payment reference for verification later
        localStorage.setItem('paymentReference', paymentInitResponse.data.paymentReference);
        // Redirect to Paystack
        window.location.href = paymentInitResponse.data.authorizationUrl;
      } else {
        throw new Error(paymentInitResponse.error?.message || 'Failed to initialize payment');
      }


    } catch (err: any) {
      console.error('❌ Booking/Payment failed:', err);
      setError(err.message || 'Failed to process booking and payment');
      setIsLoading(false); // Only stop loading on error
    }
  };

  const handleDownloadTicket = () => {
    // In a real app, this would generate and download a PDF ticket
    console.log('Downloading ticket...');
    alert('Ticket download functionality would be implemented here');
  };

  const handleBookAnother = () => {
    navigate('/');
  };

  // Allow rendering without flight if we have booking data (return from Paystack)
  // Show loading state if we're on step 3 but data is being fetched
  if (currentStep === 3 && isLoading && !actualBookingData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we process your booking...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Don't render if no flight data and not on confirmation step
  if (!flight && !actualBookingData && currentStep !== 3) {
    return null;
  }

  // Build booking confirmation data from actual booking or mock data
  const booking: BookingConfirmation | null = (() => {
    // Get stored payment summary from localStorage
    const storedPaymentStr = localStorage.getItem('paymentSummary');
    const storedPayment = storedPaymentStr ? JSON.parse(storedPaymentStr) : null;
    
    // If we have actual booking data from the API, use it
    if (actualBookingData && bookingReference) {
      const flightSnapshot = actualBookingData.flightSnapShot || {};
      const outbound = flightSnapshot.outbound || {};
      const firstPassenger = actualBookingData.passengers?.[0] || {};
      
      return {
        reference: bookingReference,
        flight: {
          id: bookingReference,
          airline: outbound.airline_name || 'Airline',
          flightNumber: outbound.flight_number || 'N/A',
          departure: {
            time: outbound.departure_time ? new Date(outbound.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
            airport: outbound.origin_code || 'N/A',
            city: outbound.origin_name || 'N/A'
          },
          arrival: {
            time: outbound.arrival_time ? new Date(outbound.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
            airport: outbound.destination_code || 'N/A',
            city: outbound.destination_name || 'N/A'
          },
          duration: outbound.duration_minutes ? `${Math.floor(outbound.duration_minutes / 60)}h ${outbound.duration_minutes % 60}m` : 'N/A',
          stops: 'Non-stop',
          price: storedPayment?.ticketPrice || flight?.price || 0,
          seatsAvailable: 0,
          cabinClass: 'Economy'
        },
        passenger: {
          firstName: firstPassenger.firstName || 'N/A',
          lastName: firstPassenger.lastName || 'N/A',
          email: firstPassenger.email || 'N/A',
          phone: firstPassenger.phoneNumber || 'N/A',
          dateOfBirth: firstPassenger.dateOfBirth || 'N/A',
          gender: 'N/A'
        },
        payment: {
          ticketPrice: storedPayment?.ticketPrice || flight?.price || 0,
          taxes: storedPayment?.taxes || 29.88,
          serviceFee: storedPayment?.serviceFee || 15.00,
          total: storedPayment?.total || originalTotalAmount || 0
        }
      };
    }
    
    // Fallback to mock data if we don't have actual booking yet
    if (flight && passenger) {
      return {
        reference: bookingReference || 'LOADING...',
        flight,
        passenger,
        payment: {
          ticketPrice: storedPayment?.ticketPrice || flight.price,
          taxes: storedPayment?.taxes || 29.88,
          serviceFee: storedPayment?.serviceFee || 15.00,
          total: storedPayment?.total || (flight.price + 29.88 + 15.00)
        }
      };
    }
    
    return null;
  })();

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
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <Header currentPage="booking" />
        <main className="container mx-auto px-4 py-6 sm:py-8 relative z-10">
          <div className="mb-8 sm:mb-10">
            <BookingStepper currentStep={currentStep} />
          </div>
          
          {currentStep === 1 && passenger === null && (
            <PassengerForm
              flight={flight}
              onNext={handlePassengerNext}
            />
          )}
          
          {currentStep === 2 && passenger && (
            <div>
              {error && (
                <div className="mb-4">
                  <Alert type="error" title="Booking Failed">
                    {error}
                  </Alert>
                </div>
              )}
              <PaymentForm
                flight={flight}
                passenger={passenger}
                onNext={handlePaymentNext}
                isLoading={isLoading}
              />
            </div>
          )}
          
          {currentStep === 3 && booking && (
            <>
              {isLoading && (
                <div className="max-w-4xl mx-auto text-center py-12">
                  <div className="text-lg text-white mb-4">Loading booking confirmation...</div>
                </div>
              )}
              {!isLoading && (
                <Confirmation
                  booking={booking}
                  onDownloadTicket={handleDownloadTicket}
                  onBookAnother={handleBookAnother}
                />
              )}
            </>
          )}
          
          {isLoading && currentStep !== 3 && (
            <div className="max-w-4xl mx-auto text-center py-12">
              <div className="text-lg text-white mb-4">Processing your booking...</div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default BookingPage;