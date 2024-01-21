const Admin = require('../models/Admin')

const jwt = require("jsonwebtoken");

const secret = process.env.SECRET;

const authAdmin = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({
            status: 'denied',
            message: 'Acesso negado!',
        })
    }

    try {

        const verified = jwt.verify(token, secret);

        req.user = await Admin.findOne({where: verified.id });

        next()

    } catch(err) {
        return res.status(401).json({
            status: 'denied',
            message: 'Token inválido!',
        });
    }
}

module.exports = authAdmin;