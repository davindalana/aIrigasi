const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    input: {
        Soil_Moisture: Number,
        Temperature: Number,
        Air_Humidity: Number,
    },
    result: String,
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Prediction', predictionSchema);
