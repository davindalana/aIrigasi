const RealTimeData = require('../models/RealTimeData');
const BatchData = require('../models/BatchData');
const { predictNeedWatering } = require('../../ml/predict');

exports.processHourlyBatch = async () => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const data = await RealTimeData.find({
      createdAt: { $gte: oneHourAgo }
    });

    if (data.length === 0) {
      console.log('[ℹ️] Tidak ada data dalam 1 jam terakhir.');
      return;
    }

    // Hitung rata-rata
    const sum = data.reduce((acc, cur) => ({
      soilMoisture: acc.soilMoisture + cur.soilMoisture,
      airTemperature: acc.airTemperature + cur.airTemperature,
      humidity: acc.humidity + cur.humidity
    }), { soilMoisture: 0, airTemperature: 0, humidity: 0 });

    const avg = {
      soilMoisture: sum.soilMoisture / data.length,
      airTemperature: sum.airTemperature / data.length,
      humidity: sum.humidity / data.length
    };

    const predicted = predictNeedWatering(avg.soilMoisture, avg.airTemperature, avg.humidity);
    const motorStatus = predicted ? 'ON' : 'OFF';

    const batch = new BatchData({
      averageSoilMoisture: avg.soilMoisture,
      averageAirTemperature: avg.airTemperature,
      averageHumidity: avg.humidity,
      predictedNeedWatering: predicted,
      motorStatus
    });

    await batch.save();
    console.log('[✅ Batch Disimpan]', batch);

  } catch (err) {
    console.error('[❌ Error Batch]', err);
  }
};

exports.getAllBatchData = async (req, res) => {
  try {
    const batch = await BatchData.find().sort({ batchTime: -1 });
    res.json(batch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

