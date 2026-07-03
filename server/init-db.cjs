const sequelize = require('./config/database.cjs');
const { DataTypes } = require('sequelize');
require('./models/index.cjs'); // associations

async function initDB() {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful');

    // Sync all models with alter:true to automatically update schema
    await sequelize.sync({ alter: true });
    console.log('Database synced with alter:true');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

module.exports = initDB;
