import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(256),
    allowNull: false
  },
  role: {
    type: DataTypes.STRING(20),
    defaultValue: 'user',
    allowNull: false,
    validate: {
      isIn: [['user', 'admin']]
    }
  }
}, {
  tableName: 'users',
  timestamps: false
});

export default User;
