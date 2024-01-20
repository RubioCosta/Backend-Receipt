const { DataTypes } = require('sequelize');

const db = require('../db/conn');

const Admin = require('./Admin')

const User = db.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    },
    school: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    },
    mother_name: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    },
    telephone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    },
    month_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        require: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        require: false,
        allowNull: false
    }
});

User.belongsTo(Admin);
Admin.hasMany(User);

module.exports = User;