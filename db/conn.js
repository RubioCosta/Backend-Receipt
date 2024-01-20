const { Sequelize } = require('sequelize');

require('dotenv').config();

// Variables .ENV
const password = process.env.MYSQLPASSWORD;
const host = process.env.MYSQLHOST;
const mysqlPort = process.env.MYSQLPORT;

const sequelize = new Sequelize('receipt', "root", password, {
    host: host,
    port: mysqlPort,
    dialect: 'mysql'
});

module.exports = sequelize;