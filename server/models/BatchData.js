const mongoose = require('mongoose');

const batchDataSchema = new mongoose.Schema({
    averageSoilMoisture: {
        type: Number,
        required: true
    },
    averageAirTemperature: {
        type: Number,
        required: true
    },
    averageHumidity: {
        type: Number,
        required: true
    },
    predictedNeedWatering: {
        type: Boolean,
        required: true
    },
    motorStatus: {
        type: String,
        enum: ['ON', 'OFF'],
        required: true
    },
    processedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BatchData', batchDataSchema);
