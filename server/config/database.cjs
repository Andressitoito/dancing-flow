const { Sequelize } = require('sequelize');
const path = require('path');

const dialect = process.env.DB_DIALECT || 'sqlite';

let sequelize;

if (dialect === 'mariadb' || dialect === 'mysql') {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'dancing_flow',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: dialect,
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../db/database.sqlite'),
    logging: false,
  });
}

module.exports = sequelize;
