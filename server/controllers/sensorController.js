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
        const { Soil_Moisture, Temperature, Air_Humidity, device_id } = request.payload;
        console.log(Soil_Moisture, Temperature, Air_Humidity, device_id);  

        if (
            Soil_Moisture === undefined || Soil_Moisture === null ||
            Temperature === undefined || Temperature === null ||
            Air_Humidity === undefined || Air_Humidity === null
        ) {
            return h.response({ message: 'Incomplete sensor data' }).code(400);
        }

        const sensorData = new SensorData({
            Soil_Moisture,
            Temperature,
            Air_Humidity,
            device_id,
            timeStamp: new Date().getTime,  
        });

        await sensorData.save();

        // Destructure the saved document to exclude __v and include timeStamp
        const { __v, ...dataWithoutV } = sensorData._doc; 
        
        return h.response({ message: 'Sensor data saved', data: dataWithoutV }).code(201);
    } catch (error) {
        console.error(error);
        return h.response({ message: 'Failed to save sensor data', error: error.message }).code(500);
    }
};



