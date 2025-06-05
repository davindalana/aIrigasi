const SensorData = require('../models/SensorData');

exports.getAllSensorData = async (request, h) => {
    try {
        const data = await SensorData.find().sort({ timeStamp: -1 }).limit(100);
        return h.response(data).code(200);
    } catch (error) {
        console.error("Error fetching data:", error); // <- Tambahkan ini
        return h.response({ message: 'Failed to get sensor data', error }).code(500);
    }
};
