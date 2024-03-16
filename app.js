const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

require('./database');


// Routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const transactionRoutes = require('./routes/transactions');
app.use('/transactions', transactionRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
