const Prediction = require('../models/Prediction');
const SensorData = require('../models/SensorData');
const axios = require('axios');

exports.predictIrrigation = async (request, h) => {
  try {
    // Ambil data sensor terbaru
    const latest = await SensorData.findOne().sort({ timeStamp: -1 });

    if (!latest) {
      return h.response({ message: 'No sensor data available' }).code(404);
    }

    const input = {
      Soil_Moisture: latest.soilMoisture,
      Temperature: latest.temperature,
      Air_Humidity: latest.airHumidity,
    };

    // Kirim data ke API Python untuk prediksi
    const response = await axios.post(process.env.PYTHON_API, input);
    const result = response.data.result;

    // Simpan hasil prediksi ke MongoDB (datalog.predictions)
    const prediction = new Prediction({ input, result });
    await prediction.save();

    return h.response({
      message: 'Prediction success',
      input,
      result,
    }).code(200);

  } catch (error) {
    console.error(error);
    return h.response({
      message: 'Prediction failed',
      error: error.message,
    }).code(500);
  }
};