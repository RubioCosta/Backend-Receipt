require('dotenv').config();

const Admin = require('../models/Admin');

const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const secret = process.env.SECRET

module.exports = class AdminController {

    // Gerar Token User
    static generateToke(id){
            return jwt.sign({id}, secret, {expiresIn: "7d"});
    }

    static async login(req, res) {

        const { email, password } = req.body

        try {

            const user = await Admin.findOne({ where: { email } })

            if (!user) {
                return res.status(400).json({
                    status: 'error',
                    message: 'E-mail ou senha inválido!'
                });
            }

            const passwordMatch = bcrypt.compareSync(password, user.password);

            if (!passwordMatch) {
                return res.status(400).json({
                    status: 'error',
                    message: 'E-mail ou senha inválido!'
                });
            }

            const cookieUser = {
                id: user.id,
                email,
                token: AdminController.generateToke(user.id)
            }

            return res.status(200).json({
                status: 'success',
                message: 'Logado com sucesso!',
                data: cookieUser,
            });
 
        } catch(err) {
            return res.status(500).json({
                status: 'error',
                message: err.message
            });
        }

    }

    static async register(req, res) {

        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                status: 'failed',
                message: "Informe todos os dados para prosseguir!"
            });
        }

        try {

            if (password !== confirmPassword) {
                return res.status(400).json({
                    status: 'error',
                    message: 'As senhas não são compatíveis!'
                });
            }

            const checkIfAdminExists = await Admin.findOne({ where: { email } })

            if (checkIfAdminExists) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Usuário informado já está cadastrado!'
                });
            }

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword  = bcrypt.hashSync(password, salt);

            const user = {
                name,
                email,
                password: hashedPassword 
            }

            const userResponse = await Admin.create( user )

            const userData = {
                id: userResponse.id,
                email: userResponse.email,
                name: userResponse.name,
                createdAt: userResponse.createdAt
            }

            return res.status(200).json({
                status: 'success',
                message: 'Cadastrado com sucesso!',
                data: userData,
            });

        } catch(err) {
            return res.status(500).json({
                status: 'error',
                message: err.message
            });
        } 

    }

}