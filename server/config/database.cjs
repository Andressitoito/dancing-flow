const { Sequelize } = require('sequelize');
const path = require('path');

// To switch to MariaDB, uncomment the following and comment the SQLite part:
/*
const sequelize = new Sequelize('dancing_flow', 'user', 'password', {
  host: 'localhost',
  dialect: 'mariadb',
  logging: false,
});
*/

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../db/database.sqlite'),
  logging: false,
});

module.exports = sequelize;
