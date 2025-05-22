const SensorData = require('../models/SensorData');
const { predictNeedWatering } = require('../../ml/predict');

exports.addSensorData = async (req, res) => {
    try {
        const { soilMoisture, airTemperature, humidity } = req.body;

        // Simple prediction logic kalau belum ada ML
        const predicted = predictNeedWatering(soilMoisture, airTemperature, humidity);
        const motorStatus = predicted ? 'ON' : 'OFF';

        const newData = new SensorData({
            soilMoisture,
            airTemperature,
            humidity,
            predictedNeedWatering: predicted,
            motorStatus
        });

        await newData.save();
        console.log('Input:', soilMoisture, airTemperature, humidity);
        console.log('Predicted:', predicted);
        res.status(200).json({ message: 'Sensor data saved', data: newData });

    } catch (err) {
        console.error('❌ Error saving data:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.getAllSensorData = async (req, res) => {
    try {
        const allData = await SensorData.find().sort({ createdAt: -1 });
        res.json(allData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};