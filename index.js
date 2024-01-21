require('dotenv').config();

const session = require('express-session');
const express = require('express');
const conn = require('./db/conn');
const cors = require('cors');

const app = express();

// Variables .ENV
const port = process.env.PORT;

// Models
const Payment = require('./models/Payment')
const User = require('./models/User');
const Admin = require('./models/Admin')

// Routes
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
const paymentRoutes = require('./routes/paymentRoutes')

// Middlewares
app.use(cors());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes)

app.get("*", (req, res) => {
    res.status(500).json({ 
        error: "Internal Server Error!", 
        message: "Something went wrong on the server." 
    });
});

conn.sync().then(() => {
    app.listen(port);
}).catch((err) => console.log(err));