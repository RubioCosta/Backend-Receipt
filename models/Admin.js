const { DataTypes } = require('sequelize');

const db = require('../db/conn');

const Admin = db.define('Admin', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    }
});


module.exports = Admin;