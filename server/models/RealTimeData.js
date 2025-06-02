const mongoose = require('mongoose');

const realTimeDataSchema = new mongoose.Schema({
    soilMoisture: {
        type: Number,
        required: true
    },
    airTemperature: {
        type: Number,
        required: true
    },
    humidity: {
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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('RealTimeData', realTimeDataSchema);
