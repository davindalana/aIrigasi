// controllers/sensorDataController.js - Controller untuk menangani data sensor

const SensorData = require('../models/SensorData');
const mlModel = require('../utils/mlModel');

/**
 * @desc    Mendapatkan semua data sensor milik pengguna
 * @route   GET /api/sensor
 * @access  Private
 */
exports.getSensorData = async (req, res) => {
    try {
        const sensorData = await SensorData.find({ user: req.user.id }).sort({ date: -1 });

        res.json(sensorData);
    } catch (error) {
        console.error('Error saat mengambil data sensor:', error.message);
        res.status(500).json({ message: 'Gagal mengambil data sensor' });
    }
};

/**
 * @desc    Mendapatkan data sensor berdasarkan ID
 * @route   GET /api/sensor/:id
 * @access  Private
 */
exports.getSensorDataById = async (req, res) => {
    try {
        const sensorData = await SensorData.findById(req.params.id);

        // Cek apakah data ditemukan
        if (!sensorData) {
            return res.status(404).json({ message: 'Data sensor tidak ditemukan' });
        }

        // Cek kepemilikan data
        if (sensorData.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Akses ditolak' });
        }

        res.json(sensorData);
    } catch (error) {
        console.error('Error saat mengambil data sensor:', error.message);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Data sensor tidak ditemukan' });
        }

        res.status(500).json({ message: 'Gagal mengambil data sensor' });
    }
};

/**
 * @desc    Menambahkan data sensor baru dan melakukan prediksi penyiraman
 * @route   POST /api/sensor
 * @access  Private
 */
exports.addSensorData = async (req, res) => {
    try {
        const { plantName, soilMoisture, temperature, pH } = req.body;

        // Validasi input
        if (!plantName || !soilMoisture || !temperature || !pH) {
            return res.status(400).json({ message: 'Semua data sensor diperlukan' });
        }

        // Buat objek data sensor baru
        const newSensorData = new SensorData({
            user: req.user.id,
            plantName,
            soilMoisture,
            temperature,
            pH
        });

        try {
            // Jalankan prediksi dengan model ML
            const prediction = await mlModel.predictWatering({
                soilMoisture,
                temperature,
                pH
            });

            // Tambahkan hasil prediksi ke data sensor
            newSensorData.needsWatering = prediction.needsWatering;
            newSensorData.wateringPredictionConfidence = prediction.confidence;

        } catch (predictionError) {
            console.error('Error saat melakukan prediksi:', predictionError);
            // Lanjutkan meskipun prediksi gagal
        }

        // Simpan data sensor ke database
        const sensorData = await newSensorData.save();

        res.status(201).json(sensorData);
    } catch (error) {
        console.error('Error saat menambahkan data sensor:', error.message);
        res.status(500).json({ message: 'Gagal menambahkan data sensor' });
    }
};

/**
 * @desc    Mendapatkan data historis untuk analisis trend
 * @route   GET /api/sensor/history/:plantName
 * @access  Private
 */
exports.getSensorHistory = async (req, res) => {
    try {
        const { plantName } = req.params;
        const { days = 7 } = req.query; // Default 7 hari terakhir

        // Hitung batas waktu
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - parseInt(days));

        // Cari data dalam rentang waktu
        const sensorHistory = await SensorData.find({
            user: req.user.id,
            plantName,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });

        res.json(sensorHistory);
    } catch (error) {
        console.error('Error saat mengambil data historis:', error.message);
        res.status(500).json({ message: 'Gagal mengambil data historis sensor' });
    }
};

/**
 * @desc    Menghapus data sensor
 * @route   DELETE /api/sensor/:id
 * @access  Private
 */
exports.deleteSensorData = async (req, res) => {
    try {
        const sensorData = await SensorData.findById(req.params.id);

        // Cek apakah data ditemukan
        if (!sensorData) {
            return res.status(404).json({ message: 'Data sensor tidak ditemukan' });
        }

        // Cek kepemilikan data
        if (sensorData.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Akses ditolak' });
        }

        // Hapus data
        await sensorData.remove();

        res.json({ message: 'Data sensor berhasil dihapus' });
    } catch (error) {
        console.error('Error saat menghapus data sensor:', error.message);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Data sensor tidak ditemukan' });
        }

        res.status(500).json({ message: 'Gagal menghapus data sensor' });
    }
};
