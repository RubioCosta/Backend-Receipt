const express = require('express');
const router = express.Router();

// Controllers
const PaymentController = require('../controllers/PaymentController')

// Middlewares
const authAdmin = require('../middlewares/authAdmin');

router.post('/', authAdmin, PaymentController.checkPayment);
router.get('/:adminId', authAdmin, PaymentController.dataDashboard);

module.exports = router;