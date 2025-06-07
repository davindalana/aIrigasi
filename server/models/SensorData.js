const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    Temperature: Number,
    Air_Humidity: Number,
    Soil_Moisture: Number,
    device_id: String,
    timestamp: Date,
}, { collection: 'sensordata' });


module.exports = mongoose.model('SensorData', sensorDataSchema);
