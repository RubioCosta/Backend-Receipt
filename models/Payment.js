const { DataTypes } = require('sequelize');

const User = require('./User')

const db = require('../db/conn');

const Payment = db.define('Payment', {
    monthOfPayment: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^[0-9]{2}\/[0-9]{4}$/
        },
        require: true
    },
    month_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        require: true
    }
});

Payment.belongsTo(User, { as: 'User' });
User.hasMany(Payment);

module.exports = Payment;