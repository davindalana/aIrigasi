const sensorRoutes = require('./sensorRoutes');
const predictionRoutes = require('./predictionRoutes');

module.exports = {
    name: 'routes',
    version: '1.0.0',
    register: async function (server, options) {
        server.route(sensorRoutes);
        server.route(predictionRoutes);
    },
};
