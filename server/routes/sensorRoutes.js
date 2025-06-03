const { getAllSensorData } = require('../controllers/sensorController');

module.exports = [
    {
        method: 'GET',
        path: '/api/sensors',
        handler: getAllSensorData,
    },
];
