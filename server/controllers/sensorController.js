// controllers/sensorController.js
const SensorData = require('../models/SensorData');
const Prediction = require('../models/Prediction');
const mlService = require('../utils/mlService');
const logger = require('../utils/logger');

class SensorController {
    constructor(db) {
        this.db = db;
    }

    async addSensorData(request, h) {
        try {
            // Validasi dan simpan data sensor
            const sensorData = await SensorData.create(this.db, request.payload);
            logger.info('New sensor data added', { id: sensorData._id });

            // Lakukan prediksi
            const predictionInput = {
                humidity: sensorData.humidity,
                temperature: sensorData.temperature,
                ph: sensorData.ph
            };

            const predictionResult = await mlService.predict(predictionInput);
            
            // Simpan hasil prediksi
            const predictionData = {
                sensorDataId: sensorData._id.toString(),
                prediction: predictionResult.prediction,
                confidence: predictionResult.confidence,
                needsWatering: predictionResult.prediction === 1,
                modelVersion: '1.0.0'
            };

            const prediction = await Prediction.create(this.db, predictionData);
            logger.info('Prediction completed', { predictionId: prediction._id });

            return h.response({
                success: true,
                data: {
                    sensorData,
                    prediction
                },
                message: 'Data berhasil disimpan dan diprediksi'
            }).code(201);

        } catch (error) {
            logger.error('Error in addSensorData', error);
            return h.response({
                success: false,
                error: 'Internal server error',
                message: error.message
            }).code(500);
        }
    }

    async getLatestData(request, h) {
        try {
            const latestSensorData = await SensorData.findLatest(this.db, 1);
            
            if (latestSensorData.length === 0) {
                return h.response({
                    success: false,
                    message: 'Tidak ada data sensor ditemukan'
                }).code(404);
            }

            const sensorData = latestSensorData[0];
            const prediction = await Prediction.findBySensorId(this.db, sensorData._id.toString());

            return {
                success: true,
                data: {
                    sensorData,
                    prediction
                }
            };

        } catch (error) {
            logger.error('Error in getLatestData', error);
            return h.response({
                success: false,
                error: 'Internal server error'
            }).code(500);
        }
    }

    async getHistoricalData(request, h) {
        try {
            const { limit = 50, page = 1, startDate, endDate } = request.query;
            const skip = (page - 1) * limit;

            const sensorData = await SensorData.findByDateRange(
                this.db, 
                startDate, 
                endDate, 
                { limit, skip }
            );

            // Ambil prediksi yang sesuai
            const sensorIds = sensorData.map(data => data._id.toString());
            const predictions = await this.db.collection('predictions')
                .find({ sensorDataId: { $in: sensorIds } })
                .toArray();

            // Gabungkan data
            const combinedData = sensorData.map(sensor => {
                const prediction = predictions.find(p => 
                    p.sensorDataId === sensor._id.toString()
                );
                return {
                    sensorData: sensor,
                    prediction: prediction || null
                };
            });

            // Hitung total untuk pagination
            const totalCount = await this.db.collection('sensorData').countDocuments();

            return {
                success: true,
                data: combinedData,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalItems: totalCount,
                    itemsPerPage: limit
                }
            };

        } catch (error) {
            logger.error('Error in getHistoricalData', error);
            return h.response({
                success: false,
                error: 'Internal server error'
            }).code(500);
        }
    }
}

module.exports = SensorController;