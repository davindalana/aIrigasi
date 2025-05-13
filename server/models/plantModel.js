const mongoose = require('mongoose');

const plantDataSchema = new mongoose.Schema({
    moisture: {
        type: Number,
        required: true,
    },
    temperature: {
        type: Number,
        required: true,
    },
    pH: {
        type: Number,
        required: true,
    },
    needsWatering: {
        type: Boolean,
        required: true,
    },
    plantType: {
        type: String,
        required: true,
    },
    confidence: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('PlantData', plantDataSchema);