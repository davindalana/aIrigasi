const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    timeStamp: { type: Date, default: Date.now },
    airHumidity: Number,
    temperature: Number,
    soilMoisture: Number,
}, { collection: 'sensordata' });


module.exports = mongoose.model('SensorData', sensorDataSchema);
