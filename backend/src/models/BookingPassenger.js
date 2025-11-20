import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Booking from './Booking.js';
import Passenger from './Passenger.js';

const BookingPassenger = sequelize.define('BookingPassenger', {
  bookingId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'bookings',
      key: 'id'
    }
  },
  passengerId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'passengers',
      key: 'id'
    }
  }
}, {
  tableName: 'booking_passengers',
  timestamps: false
});

// Define associations will be set in index.js after model loading

export default BookingPassenger;

