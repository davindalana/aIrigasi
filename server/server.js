// server.js - File utama untuk menjalankan server backend AIrigasi

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Define Routes
app.use('/api/sensor', require('./routes/sensorRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Selamat datang di API AIrigasi!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Terjadi kesalahan pada server!' });
});

// Define PORT
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
