const { Op, Sequelize } = require('sequelize');

const User = require('../models/User');
const Payment = require('../models/Payment');

module.exports = class PaymentController {

    static async dataDashboard(req, res) {

        const AdminId = req.params.adminId

        if (!AdminId) {
            return res.status(400).json({
                status: 'error',
                message: "Informe todos os dados para prosseguir!"
            });
        }

        try {

            const date = new Date();
            
            let month = date.getMonth() + 1; // Adiciona 1 para obter o mês de 1 a 12
            const year = date.getFullYear();

            if (month < 10) {
                month = '0' + month;
            }

            const dateFormatted = month + "/" + year

            const usersPayment = await Payment.count({
                where: {
                    monthOfPayment: dateFormatted
                }
            });

            const totalUsers = await User.count({
                where: {
                    AdminId,
                    status: true
                }
            });

            const totalValue = await User.sum('month_value', {
                where: {
                  status: true
                }
              });

            const monthsToRetrieve = 7;

            const paymentsData = await Payment.findAll({
                attributes: [
                  'monthOfPayment',
                  [Sequelize.fn('SUM', Sequelize.col('Payment.month_value')), 'totalValue']
                ],
                include: [
                  {
                    model: User,
                    as: 'User',
                    where: { AdminId }
                  }
                ],
                group: ['Payment.monthOfPayment'],
                order: [['monthOfPayment', 'DESC']],
                limit: monthsToRetrieve,
                raw: true
            });

            const paymentsMonth = paymentsData.map((value) => {

                const name = value.monthOfPayment
                const valor = parseInt(value.totalValue)

                const data = {
                    name,
                    valor
                }

                return data

            });

            paymentsMonth.reverse();

            return res.status(200).json({
                status: 'success',
                usersPayment,
                totalUsers,
                paymentsMonth,
                totalValue
            });

        } catch(err) {
            res.status(500).json({
                status: 'error',
                message: err.message
            });
        }

    }

    static async checkPayment(req, res) {
        
        const { userId, date, monthValue  } = req.body;

        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();

        const monthFilter = date.slice(0, 2)
        const yearFilter = date.slice(3, 7)

        if (!(monthFilter >= month) && !(yearFilter >= year)) {
            console.log("aqui")
        }

        try {

            const checkData = {
                monthOfPayment: date,
                month_value: monthValue,
                UserId: userId
            }

            const payment = await Payment.findOne( { where: { UserId: userId, monthOfPayment: date } } )

            if (payment) {
                await Payment.destroy( { where: { UserId: userId, monthOfPayment: date } } );

                return res.status(200).json({
                    status: 'success',
                    message: 'Pagamento removido com sucesso!'
                });
            }

            await Payment.create(checkData)
                
            return res.status(200).json({
                status: 'success',
                message: 'Pagamento registrado com sucesso!'
            });

        } catch(err) {
            return res.status(500).json({
                status: 'error',
                message: err.message
            });
        }

    }

}