const { Op } = require('sequelize');

const User = require('../models/User');
const Admin = require('../models/Admin');
const Payment = require('../models/Payment');

module.exports = class UserController {

    static async receiptGenerate(req, res) {

        const AdminId = req.params.adminId

        if (!AdminId) {
            return res.status(400).json({
                status: 'error',
                message: "Informe todos os dados para prosseguir!"
            });
        }

        try {

            let usersData = await User.findAll({
                where: { 
                    AdminId,
                    status: true
                },
            });

            res.status(200).json({
                status: 'success',
                message: 'Operation completed successfully',
                data: usersData
            });

        } catch(err) {
            res.status(500).json({
                status: 'error',
                message: err.message
            });
        }

    }

    static async searchUser(req, res) {

        const { searchName, date } = req.query

        const monthFilter = date.slice(0,2);
        const yearFilter = date.slice(3,7);

        const AdminId = req.params.adminId

        if (!searchName || !date || !AdminId) {
            return res.status(400).json({
                status: 'error',
                message: "Informe todos os dados para prosseguir!"
            });
        }

        try {

            let usersData = await User.findAll({
                where: { 
                    AdminId,
                    name: {
                        [Op.like]: `%${searchName}%`
                    }
                },
                include: [
                    {
                        model: Payment,
                        where: { 
                            monthOfPayment: date
                        },
                        required: false
                    },
                ]
            });
           
            const usersPaymentsStatus = usersData.map((user) => {
                const isPayment = user.Payments.length > 0

                const userData = user.get({plain: true});

                const createdAtString = user.createdAt.toISOString();

                let year = createdAtString.slice(0, 4);
                let month = createdAtString.slice(6,7);

                if (month < 10) {
                    month = "0" + month
                }

                userData.month = month
                userData.year = year
                userData.isPayment = isPayment

                return userData
            }).filter((user) => {
                return (monthFilter >= user.month) && (yearFilter >= user.year);
            });

            res.status(200).json({
                status: 'success',
                message: 'Operation completed successfully',
                data: usersPaymentsStatus
            });

        } catch(err) {

            res.status(500).json({
                status: 'error',
                message: err.message
            });

        }

    }

    static async showAllUser(req, res) {

        const { date } = req.query

        const monthFilter = date.slice(0,2);
        const yearFilter = date.slice(3,7);

        const AdminId = req.params.adminId;

        try {

            let usersData = await User.findAll({
                where: { AdminId },
                include: [
                    {
                        model: Payment,
                        where: { 
                            monthOfPayment: date
                        },
                        required: false
                    },
                ]
            });

            const usersPaymentsStatus = usersData.map((user) => {
                const isPayment = user.Payments.length > 0

                const userData = user.get({plain: true});

                const createdAtString = user.createdAt.toISOString();

                let year = createdAtString.slice(0, 4);
                let month = createdAtString.slice(6,7);

                if (month < 10) {
                    month = "0" + month
                }

                userData.month = month
                userData.year = year
                userData.isPayment = isPayment

                return userData
            }).filter((user) => {
                return (monthFilter >= user.month) && (yearFilter >= user.year);
            }).sort((a, b) => {
                
                if (a.isPayment && !b.isPayment) return 1;
                if (!a.isPayment && b.isPayment) return -1;
                return 0;
            });

            res.status(200).json({
                status: 'success',
                message: 'Operation completed successfully',
                data: usersPaymentsStatus
            });

        } catch(err) {

            res.status(500).json({
                status: 'error',
                message: err.message
            });

        }
    }

    static async createUser(req, res) {

        const { name, school, mother_name, telephone_number, month_value } = req.body

        const AdminId = req.params.adminId

        if (!name || !school || !mother_name || !telephone_number || !month_value || !AdminId) {
            return res.status(400).json({
                status: 'error',
                message: "Informe todos os dados para prosseguir!"
            });
        }    

        const userData = {
            name,
            school,
            mother_name,
            telephone_number,
            month_value,
            AdminId
        }

        try {

            const admin = await Admin.findOne( { where: { id: AdminId } } )

            if (!admin) {
                return res.status(400).json({
                    status: 'failed',
                    message: "Usuário Admin não identificado!"
                });
            }

            await User.create(userData);

            return res.status(200).json({
                status: 'success',
                message: 'Usuário cadastrado com sucesso!'
            });

        } catch(err) {

            return res.status(500).json({
                status: 'error',
                message: err.message
            });

        }

    }

}