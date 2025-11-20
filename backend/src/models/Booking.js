import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Payment from './Payment.js';

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  bookingReference: {
    type: DataTypes.STRING(25),
    allowNull: false,
    unique: true
  },
  bookingStatus: {
    type: DataTypes.STRING(10),
    defaultValue: 'pending',
    allowNull: false,
    validate: {
      isIn: [['pending', 'confirmed', 'cancelled', 'completed']]
    }
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING(10),
    defaultValue: 'NGN',
    allowNull: false
  },
  paymentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'payments',
      key: 'id'
    }
  },
  flightSnapShot: {
    type: DataTypes.JSONB,
    allowNull: false
  }
}, {
  tableName: 'bookings',
  timestamps: false,
  indexes: [
    {
      fields: ['bookingReference'],
      name: 'idx_bookings_reference'
    },
    {
      fields: ['bookingStatus'],
      name: 'idx_bookings_status'
    },
    {
      fields: ['paymentId'],
      name: 'idx_bookings_payment'
    }
  ]
});

// Associations are defined in associations.js

export default Booking;
