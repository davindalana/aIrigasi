// controllers/predictionController.js - Controller untuk menangani prediksi penyiraman

const SensorData = require('../models/SensorData');
const mlModel = require('../utils/mlModel');

/**
 * @desc    Mendapatkan prediksi penyiraman berdasarkan data sensor terbaru
 * @route   GET /api/sensor/predict/:plantName
 * @access  Private
 */
exports.getPrediction = async (req, res) => {
    try {
        const { plantName } = req.params;

        // Dapatkan data sensor terbaru untuk tanaman tertentu
        const latestSensorData = await SensorData.findOne({
            user: req.user.id,
            plantName
        }).sort({ date: -1 });

        if (!latestSensorData) {
            return res.status(404).json({
                message: 'Tidak ada data sensor untuk tanaman ini. Silakan tambahkan data sensor terlebih dahulu.'
            });
        }

        // Data sudah memiliki prediksi yang disimpan
        if (latestSensorData.needsWatering !== undefined) {
            return res.json({
                needsWatering: latestSensorData.needsWatering,
                confidence: latestSensorData.wateringPredictionConfidence,
                sensorData: {
                    soilMoisture: latestSensorData.soilMoisture,
                    temperature: latestSensorData.temperature,
                    pH: latestSensorData.pH,
                    date: latestSensorData.date
                }
            });
        }

        // Jika tidak ada prediksi yang disimpan, lakukan prediksi baru
        const prediction = await mlModel.predictWatering({
            soilMoisture: latestSensorData.soilMoisture,
            temperature: latestSensorData.temperature,
            pH: latestSensorData.pH
        });

        // Update data sensor dengan hasil prediksi
        latestSensorData.needsWatering = prediction.needsWatering;
        latestSensorData.wateringPredictionConfidence = prediction.confidence;
        await latestSensorData.save();

        return res.json({
            needsWatering: prediction.needsWatering,
            confidence: prediction.confidence,
            sensorData: {
                soilMoisture: latestSensorData.soilMoisture,
                temperature: latestSensorData.temperature,
                pH: latestSensorData.pH,
                date: latestSensorData.date
            }
        });

    } catch (error) {
        console.error('Error saat mendapatkan prediksi:', error.message);
        res.status(500).json({ message: 'Gagal mendapatkan prediksi penyiraman' });
    }
};

/**
 * @desc    Melatih ulang model dengan data baru
 * @route   POST /api/sensor/retrain
 * @access  Private (Admin only in a production environment)
 */
exports.retrainModel = async (req, res) => {
    try {
        // Dalam lingkungan produksi, tambahkan middleware untuk memeriksa peran admin

        const result = await mlModel.retrainModel();

        if (result.success) {
            res.json({
                message: 'Model berhasil dilatih ulang',
                details: result
            });
        } else {
            res.status(500).json({
                message: 'Gagal melatih ulang model',
                details: result
            });
        }

    } catch (error) {
        console.error('Error saat melatih ulang model:', error.message);
        res.status(500).json({ message: 'Gagal melatih ulang model ML' });
    }
};

/**
 * @desc    Mendapatkan statistik prediksi
 * @route   GET /api/sensor/stats/:plantName
 * @access  Private
 */
exports.getPredictionStats = async (req, res) => {
    try {
        const { plantName } = req.params;
        const { days = 30 } = req.query; // Default 30 hari terakhir

        // Hitung batas waktu
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - parseInt(days));

        // Dapatkan data sensor dalam rentang waktu
        const sensorData = await SensorData.find({
            user: req.user.id,
            plantName,
            date: { $gte: startDate, $lte: endDate }
        });

        // Hitung statistik
        const stats = {
            totalReadings: sensorData.length,
            needsWatering: sensorData.filter(data => data.needsWatering).length,
            averageSoilMoisture: 0,
            averageTemperature: 0,
            averagePH: 0
        };

        // Hitung rata-rata
        if (sensorData.length > 0) {
            stats.averageSoilMoisture = sensorData.reduce((sum, data) => sum + data.soilMoisture, 0) / sensorData.length;
            stats.averageTemperature = sensorData.reduce((sum, data) => sum + data.temperature, 0) / sensorData.length;
            stats.averagePH = sensorData.reduce((sum, data) => sum + data.pH, 0) / sensorData.length;
        }

        res.json(stats);

    } catch (error) {
        console.error('Error saat mendapatkan statistik prediksi:', error.message);
        res.status(500).json({ message: 'Gagal mendapatkan statistik prediksi' });
    }
};
