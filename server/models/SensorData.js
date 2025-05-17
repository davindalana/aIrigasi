// models/SensorData.js - Model untuk data sensor tanaman

const mongoose = require('mongoose');

const SensorDataSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    plantName: {
        type: String,
        required: true
    },
    soilMoisture: {
        type: Number,
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    pH: {
        type: Number,
        required: true
    },
    needsWatering: {
        type: Boolean,
        default: false
    },
    wateringPredictionConfidence: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('sensorData', SensorDataSchema);