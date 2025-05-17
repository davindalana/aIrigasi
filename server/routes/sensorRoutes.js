// routes/sensorRoutes.js - Routes untuk API data sensor dan prediksi

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const sensorController = require('../controllers/sensorDataController');
const predictionController = require('../controllers/predictionController');

// Routes untuk data sensor
router.get('/', protect, sensorController.getSensorData);
router.get('/:id', protect, sensorController.getSensorDataById);
router.post('/', protect, sensorController.addSensorData);
router.delete('/:id', protect, sensorController.deleteSensorData);

// Perhatikan urutan route - route spesifik harus didahulukan
router.get('/history/:plantName', protect, sensorController.getSensorHistory);
router.get('/predict/:plantName', protect, predictionController.getPrediction);
router.get('/stats/:plantName', protect, predictionController.getPredictionStats);

// Routes untuk prediksi
router.post('/retrain', protect, predictionController.retrainModel);

module.exports = router;