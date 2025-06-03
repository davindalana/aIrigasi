// routes/index.js
const sensorRoutes = require('./sensorRoutes');
const predictionRoutes = require('./predictionRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const registerRoutes = async (server, db) => {
    // Register semua routes
    await sensorRoutes(server, db);
    await predictionRoutes(server, db);
    await dashboardRoutes(server, db);

    // Health check route
    server.route({
        method: 'GET',
        path: '/health',
        handler: (request, h) => {
            return {
                status: 'OK',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                environment: process.env.NODE_ENV || 'development'
            };
        }
    });

    // API info route
    server.route({
        method: 'GET',
        path: '/api',
        handler: (request, h) => {
            return {
                name: 'AIrigasi Backend API',
                version: '1.0.0',
                description: 'Smart Irrigation System with Machine Learning',
                endpoints: {
                    health: '/health',
                    sensor: '/api/sensor-data',
                    prediction: '/api/predict',
                    dashboard: '/api/dashboard'
                }
            };
        }
    });
};

module.exports = registerRoutes;