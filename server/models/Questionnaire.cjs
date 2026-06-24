const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');

const Questionnaire = sequelize.define('Questionnaire', {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  whyStarted: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  objectives: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  hardestPart: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fears: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  recordingPreference: {
    type: DataTypes.ENUM('alone', 'couple', 'shy', 'show', 'training_teacher'),
    allowNull: true
  },
  personalFeeling: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // New questions
  experienceLevel: {
    type: DataTypes.STRING,
    allowNull: true
  },
  preferredStyles: {
    type: DataTypes.STRING,
    allowNull: true
  },
  weeklyDedication: {
    type: DataTypes.STRING,
    allowNull: true
  },
  physicalLimitations: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  completionPercentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  testimonial: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  testimonialStars: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  }
});

module.exports = Questionnaire;
