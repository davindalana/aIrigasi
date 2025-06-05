const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    timeStamp: Date,
    airHumidity: Number,
    temperature: Number,
    soilMoisture: Number,
}, { collection: 'sensordata' });


module.exports = mongoose.model('SensorData', sensorDataSchema);
