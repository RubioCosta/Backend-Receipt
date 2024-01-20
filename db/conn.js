const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('receipt', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;