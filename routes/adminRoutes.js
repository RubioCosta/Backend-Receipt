const express = require('express');
const router = express.Router();

// Controllers
const AdminController = require('../controllers/AdminController');

router.post('/login', AdminController.login)
router.post('/register', AdminController.register)

module.exports = router