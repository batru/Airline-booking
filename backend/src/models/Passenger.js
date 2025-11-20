import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Passenger = sequelize.define('Passenger', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isIn: [['Mr', 'Mrs', 'Ms', 'Miss', 'Dr']]
    }
  },
  firstName: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  country: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: true
  },
  documentType: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  documentNumber: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  documentExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  phoneCode: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  phoneNumber: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: 'passengers',
  timestamps: false
});

export default Passenger;

