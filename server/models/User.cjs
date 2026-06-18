const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('student', 'master', 'moderator'),
    defaultValue: 'student'
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other', 'unidentified'),
    defaultValue: 'unidentified'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  level: {
    type: DataTypes.ENUM('principiante', 'pre-intermedio', 'intermedio', 'avanzado'),
    allowNull: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = User;
