const SensorData = require('../models/SensorData');

exports.getAllSensorData = async (request, h) => {
    try {
        const data = await SensorData.find()
            .sort({ timestamp: -1 })
            .limit(100)
            .select('-__v'); 

        // Optional: jika kamu ingin menghilangkan _id juga:
        const cleanData = data.map(({ _doc }) => {
            const { _id, __v, ...rest } = _doc;
            return rest;
        });

        return h.response(cleanData).code(200);
    } catch (error) {
        console.error("Error fetching data:", error); // <- Tambahkan ini
        return h.response({ message: 'Failed to get sensor data', error }).code(500);
    }
};

exports.addSensorData = async (request, h) => {
    try {
        console.log('Payload:', request.payload);
        const { soilMoisture, temperature, airHumidity } = request.payload;

        if (
            soilMoisture === undefined || soilMoisture === null ||
            temperature === undefined || temperature === null ||
            airHumidity === undefined || airHumidity === null
        ) {
            return h.response({ message: 'Incomplete sensor data' }).code(400);
        }


        const sensorData = new SensorData({
            soilMoisture,
            temperature,
            airHumidity,
            timeStamp: new Date(),  
        });

        await sensorData.save();

        return h.response({ message: 'Sensor data saved', data: sensorData }).code(201);
    } catch (error) {
        console.error(error);
        return h.response({ message: 'Failed to save sensor data', error: error.message }).code(500);
    }
};

