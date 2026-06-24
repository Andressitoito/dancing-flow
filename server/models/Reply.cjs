const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');

const Reply = sequelize.define('Reply', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  assignmentId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  audioUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('text', 'audio', 'video'),
    defaultValue: 'text'
  },
  isReadByMaster: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isReadByUser: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  parentReplyId: {
    type: DataTypes.UUID,
    allowNull: true
  }
});

module.exports = Reply;
