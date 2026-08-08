const sequelize = require('./config/database.cjs');
const { DataTypes } = require('sequelize');
require('./models/index.cjs'); // associations

async function initDB() {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful');

    const dialect = sequelize.getDialect();
    if (dialect === 'mariadb' || dialect === 'mysql') {
      console.log(`Performing robust data migration for ENUMs on ${dialect}...`);
      try {
        // 1. Temporarily change column to TEXT to allow any value during migration
        await sequelize.query("ALTER TABLE Users MODIFY COLUMN gender TEXT");

        // 2. Map old values to new valid ones
        await sequelize.query("UPDATE Users SET gender = 'otro' WHERE gender NOT IN ('male', 'female', 'otro') OR gender IS NULL");
        console.log('Existing gender values migrated to valid options');

        // 3. Change column back to the new ENUM definition
        await sequelize.query("ALTER TABLE Users MODIFY COLUMN gender ENUM('male', 'female', 'otro') DEFAULT 'otro'");
        console.log('Users.gender ENUM updated manually to: male, female, otro');
      } catch (e) {
        console.warn('MariaDB/MySQL migration skipped or failed (might be first run):', e.message);
      }
    }

    // Sync all models with alter:true to automatically update schema
    await sequelize.sync({ alter: true });
    console.log('Database synced with alter:true');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

module.exports = initDB;
