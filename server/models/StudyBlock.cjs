const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');

const StudyBlock = sequelize.define('StudyBlock', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('video', 'audio', 'text'),
    allowNull: false
  },
  contentUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  level: {
    type: DataTypes.ENUM('principiante', 'pre-intermedio', 'intermedio', 'avanzado'),
    allowNull: false
  },
  creatorId: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

module.exports = StudyBlock;
