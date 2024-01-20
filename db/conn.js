const { Sequelize } = require('sequelize');

require('dotenv').config();

// Variables .ENV
const password = process.env.MYSQLPASSWORD;
const host = process.env.MYSQLHOST;
const mysqlPort = process.env.MYSQLPORT;
const mysqlName= process.env.MYSQLNAME;
const mysqlDataBase= process.env.MYSQLDATABASE;

const sequelize = new Sequelize(mysqlDataBase, mysqlName, password, {
    dialect: 'mysql',
    port: mysqlPort,
    host: host,
    dialectOptions: {
        supportBigNumbers: true,
        bigNumberStrings: true,
        options: {
          useUTC: false,
          dateFirst: 1,
          enableArithAbort: true,
          sql_mode: ''
        }
      }
});


module.exports = sequelize;