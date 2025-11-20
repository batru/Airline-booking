import Booking from './Booking.js';
import Passenger from './Passenger.js';
import Payment from './Payment.js';
import BookingPassenger from './BookingPassenger.js';

// Define model associations
Booking.belongsTo(Payment, { foreignKey: 'paymentId', as: 'payment' });

Booking.belongsToMany(Passenger, { 
  through: BookingPassenger, 
  foreignKey: 'bookingId',
  otherKey: 'passengerId',
  as: 'passengers'
});

Passenger.belongsToMany(Booking, { 
  through: BookingPassenger, 
  foreignKey: 'passengerId',
  otherKey: 'bookingId',
  as: 'bookings'
});

export { Booking, Passenger, Payment, BookingPassenger };

