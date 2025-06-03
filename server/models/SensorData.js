const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    Soil_Moisture: Number,
    Temperature: Number,
    Air_Humidity: Number,
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('SensorData', sensorDataSchema);
