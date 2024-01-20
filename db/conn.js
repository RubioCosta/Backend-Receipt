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
    host: host
});


module.exports = sequelize;