// controllers/predictionController.js
const mlService = require('../utils/mlService');
const Prediction = require('../models/Prediction');
const logger = require('../utils/logger');

class PredictionController {
    constructor(db) {
        this.db = db;
    }

    async makePrediction(request, h) {
        try {
            // Validasi input
            const { humidity, temperature, ph } = request.payload;
            
            if (!await mlService.isModelReady()) {
                return h.response({
                    success: false,
                    error: 'Model tidak tersedia',
                    message: 'Silakan latih model terlebih dahulu'
                }).code(503);
            }

            // Lakukan prediksi
            const predictionResult = await mlService.predict({
                humidity,
                temperature,
                ph
            });

            const response = {
                success: true,
                data: {
                    input: { humidity, temperature, ph },
                    prediction: predictionResult.prediction,
                    confidence: predictionResult.confidence,
                    needsWatering: predictionResult.prediction === 1,
                    message: predictionResult.prediction === 1 ? 
                        'Tanaman memerlukan penyiraman' : 
                        'Tanaman tidak memerlukan penyiraman',
                    recommendation: this.getRecommendation(predictionResult, { humidity, temperature, ph })
                }
            };

            logger.info('Prediction made', { 
                input: { humidity, temperature, ph },
                result: predictionResult.prediction 
            });

            return response;

        } catch (error) {
            logger.error('Error in makePrediction', error);
            return h.response({
                success: false,
                error: 'Prediction failed',
                message: error.message
            }).code(500);
        }
    }

    async getPredictionStats(request, h) {
        try {
            const { startDate, endDate } = request.query;
            
            const stats = await Prediction.getStatistics(this.db, { startDate, endDate });
            
            return {
                success: true,
                data: stats[0] || {
                    totalPredictions: 0,
                    wateringNeeded: 0,
                    averageConfidence: 0
                }
            };

        } catch (error) {
            logger.error('Error in getPredictionStats', error);
            return h.response({
                success: false,
                error: 'Internal server error'
            }).code(500);
        }
    }

    getRecommendation(prediction, input) {
        const { humidity, temperature, ph } = input;
        let recommendations = [];

        if (prediction.prediction === 1) {
            recommendations.push('Lakukan penyiraman segera');
            
            if (humidity < 30) {
                recommendations.push('Kelembaban sangat rendah, tingkatkan frekuensi penyiraman');
            }
            
            if (temperature > 30) {
                recommendations.push('Suhu tinggi terdeteksi, pantau tanaman lebih sering');
            }
        } else {
            recommendations.push('Tanaman dalam kondisi baik, tidak perlu penyiraman');
            
            if (humidity > 80) {
                recommendations.push('Kelembaban tinggi, pastikan drainase baik');
            }
        }

        if (ph < 6 || ph > 8) {
            recommendations.push(`pH tanah ${ph.toFixed(1)} tidak optimal, pertimbangkan penyesuaian pH`);
        }

        return recommendations;
    }
}

module.exports = PredictionController;