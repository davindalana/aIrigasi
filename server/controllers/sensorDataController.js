const RealTimeData = require('../models/RealTimeData');
const { predictNeedWatering } = require('../../ml/predict');

exports.addSensorData = async (request, h) => {
    try {
        const { soilMoisture, airTemperature, humidity } = request.payload;

        const predicted = predictNeedWatering(soilMoisture, airTemperature, humidity);
        const motorStatus = predicted ? 'ON' : 'OFF';

        const newData = new RealTimeData({
            soilMoisture,
            airTemperature,
            humidity,
            predictedNeedWatering: predicted,
            motorStatus
        });

        await newData.save();

        console.log('[✅ Data Tersimpan] -', newData);

        return h.response({
            message: 'Sensor data saved (Real-time)',
            data: newData
        }).code(201);

    } catch (err) {
        console.error('❌ Error saving real-time data:', err);
        return h.response({ error: err.message }).code(500);
    }
};

exports.getAllSensorData = async (request, h) => {
    try {
        const allData = await RealTimeData.find().sort({ createdAt: -1 });
        return h.response(allData).code(200);
    } catch (err) {
        return h.response({ error: err.message }).code(500);
    }
};

exports.getLatestRealTime = async (req, res) => {
    try {
        const latest = await RealTimeData.find().sort({ createdAt: -1 }).limit(1);
        if (!latest.length) return res.status(404).json({ message: 'No data' });
        res.json(latest[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.manualSensorInput = async (request, h) => {
    try {
        const { soilMoisture, airTemperature, humidity, mode } = request.payload;

        if (mode === 'batch') {
            await bufferSensorData(soilMoisture, airTemperature, humidity);
            return h.response({ message: 'Data disimpan untuk batch processing.' }).code(200);
        } else {
            // Mode realtime
            const prediction = await predictNeedWatering(soilMoisture, airTemperature, humidity);
            const motorStatus = prediction ? 'ON' : 'OFF';

            const data = new RealTimeData({
                soilMoisture,
                airTemperature,
                humidity,
                predictedNeedWatering: prediction,
                motorStatus
            });

            await data.save();

            return h.response({ message: 'Data realtime tersimpan', data }).code(200);
        }
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Gagal menyimpan data sensor' }).code(500);
    }
};


