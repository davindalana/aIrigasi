const SensorData = require('../models/SensorData');
const { addToBuffer } = require('./sensorBatchController');

exports.addSensorData = async (request, h) => {
    try {
        const { suhu, kelembapan, phTanah, curahHujan } = request.payload;

        // Simpan ke buffer, bukan langsung ke MongoDB
        addToBuffer({ suhu, kelembapan, phTanah, curahHujan });
        console.log('📥 Data diterima dan dimasukkan ke buffer:', request.payload);

        return h.response({ message: 'Data sensor diterima dan akan diproses dalam batch 1 jam' }).code(200);

    } catch (err) {
        console.error('❌ Error menerima data sensor:', err);
        return h.response({ error: err.message }).code(500);
    }
};

exports.getAllSensorData = async (request, h) => {
    try {
        const allData = await SensorData.find().sort({ createdAt: -1 });
        return h.response(allData).code(200);
    } catch (err) {
        return h.response({ error: err.message }).code(500);
    }
};