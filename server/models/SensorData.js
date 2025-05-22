const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    soilMoisture: Number,       // dalam persen (%)
    airTemperature: Number,     // dalam derajat Celsius
    humidity: Number,           // dalam persen (%)
    motorStatus: {
        type: String,
        enum: ['ON', 'OFF'],      // nilai ON atau OFF
        default: 'OFF'
    },
    predictedNeedWatering: Boolean, // hasil dari AI prediksi
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SensorData', sensorDataSchema);