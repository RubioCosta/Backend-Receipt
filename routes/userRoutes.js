const express = require('express');
const router = express.Router();

// Controllers
const UserController = require('../controllers/UserController')

// Middlewares
const authAdmin = require('../middlewares/authAdmin');

router.get('/search/:adminId', authAdmin, UserController.searchUser);
router.get('/receipt/:adminId', authAdmin, UserController.receiptGenerate);
router.get('/:adminId', authAdmin, UserController.showAllUser);
router.post('/:adminId', authAdmin, UserController.createUser);

module.exports = router;