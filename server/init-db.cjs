const sequelize = require('./config/database.cjs');
const { DataTypes } = require('sequelize');
require('./models/index.cjs'); // associations

async function initDB() {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful');

    const queryInterface = sequelize.getQueryInterface();

    // Check for Users table and add missing columns
    try {
      const usersTable = await queryInterface.describeTable('Users');
      if (!usersTable.isPro) {
        console.log('Adding isPro to Users...');
        await queryInterface.addColumn('Users', 'isPro', {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        });
      }
      if (!usersTable.level) {
        console.log('Adding level to Users...');
        await queryInterface.addColumn('Users', 'level', {
          type: DataTypes.ENUM('principiante', 'pre-intermedio', 'intermedio', 'avanzado'),
          allowNull: true
        });
      }
    } catch (e) {
      console.log('Users table does not exist yet.');
    }

    // Check for Questionnaires table and add new columns
    try {
      const qTable = await queryInterface.describeTable('Questionnaires');
      const newCols = [
        { name: 'experienceLevel', type: DataTypes.STRING },
        { name: 'preferredStyles', type: DataTypes.STRING },
        { name: 'weeklyDedication', type: DataTypes.STRING },
        { name: 'physicalLimitations', type: DataTypes.TEXT }
      ];

      for (const col of newCols) {
        if (!qTable[col.name]) {
          console.log(`Adding ${col.name} to Questionnaires...`);
          await queryInterface.addColumn('Questionnaires', col.name, {
            type: col.type,
            allowNull: true
          });
        }
      }
    } catch (e) {
      console.log('Questionnaires table does not exist yet.');
    }

    // Sync all models WITHOUT alter:true to avoid foreign key issues on SQLite
    await sequelize.sync();
    console.log('Database synced');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

module.exports = initDB;
