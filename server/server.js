const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/plants', require('./routes/plantRoutes'));
app.use('/api/predictions', require('./routes/predictionRoutes'));

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to AIrigasi API');
});

// MongoDB Connection
mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/airigasi')
    .then(() => {
        console.log('MongoDB connected successfully');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
