const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');

const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studyBlockId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('assigned', 'viewed', 'replied', 'completed'),
    defaultValue: 'assigned'
  }
});

module.exports = Assignment;
