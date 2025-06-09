const Prediction = require('../models/Prediction');
const SensorData = require('../models/SensorData');
const axios = require('axios');

exports.predictIrrigation = async (request, h) => {
  try {
    // Ambil data sensor terbaru
    const latest = await SensorData.findOne().sort({ timestamp: -1 });

    if (!latest) {
      return h.response({ message: 'No sensor data available' }).code(404);
    }
    console.log(latest)

    const input = {
      Temperature: latest.Temperature,
      Soil_Moisture: latest.Soil_Moisture,
      Air_Humidity: latest.Air_Humidity,
      device_id: latest.device_id,
    };

    console.log(input)

    // Kirim data ke API Python untuk prediksi
    const response = await axios.post(process.env.PYTHON_API, input);
    const result = response.data.Irrigation_Level;
    const message = response.data.Message;

    // Simpan hasil prediksi ke MongoDB (datalog.predictions)
    const prediction = new Prediction({ input, result });
    await prediction.save();

    return h.response({
      message,
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