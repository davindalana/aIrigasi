// routes/sensorRoutes.js
const Joi = require('@hapi/joi');
const SensorController = require('../controllers/sensorController');

const sensorRoutes = async (server, db) => {
    const sensorController = new SensorController(db);

    // POST /api/sensor-data - Tambah data sensor
    server.route({
        method: 'POST',
        path: '/api/sensor-data',
        options: {
            validate: {
                payload: Joi.object({
                    humidity: Joi.number().min(0).max(100).required(),
                    temperature: Joi.number().min(-50).max(100).required(),
                    ph: Joi.number().min(0).max(14).required(),
                    location: Joi.string().optional(),
                    plantType: Joi.string().optional()
                })
            }
        },
        handler: sensorController.addSensorData.bind(sensorController)
    });

    // GET /api/sensor-data/latest - Data sensor terbaru
    server.route({
        method: 'GET',
        path: '/api/sensor-data/latest',
        handler: sensorController.getLatestData.bind(sensorController)
    });

    // GET /api/sensor-data/history - Data historis
    server.route({
        method: 'GET',
        path: '/api/sensor-data/history',
        options: {
            validate: {
                query: Joi.object({
                    limit: Joi.number().integer().min(1).max(1000).default(50),
                    page: Joi.number().integer().min(1).default(1),
                    startDate: Joi.date().optional(),
                    endDate: Joi.date().optional()
                })
            }
        },
        handler: sensorController.getHistoricalData.bind(sensorController)
    });
};

module.exports = sensorRoutes;