import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  paymentReference: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING(25),
    defaultValue: 'NGN',
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(10),
    defaultValue: 'pending',
    allowNull: false,
    validate: {
      isIn: [['pending', 'success', 'failed', 'cancelled']]
    }
  }
}, {
  tableName: 'payments',
  timestamps: false,
  indexes: [
    {
      fields: ['paymentReference'],
      name: 'idx_payments_reference'
    },
    {
      fields: ['status'],
      name: 'idx_payments_status'
    }
  ]
});

export default Payment;
