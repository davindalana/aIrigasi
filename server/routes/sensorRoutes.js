const { getAllSensorData, addSensorData } = require('../controllers/sensorController');

module.exports = [
    {
        method: 'GET',
        path: '/api/sensors',
        handler: getAllSensorData,
    },
    {
        method: 'POST',
        path: '/api/sensors',
        handler: addSensorData,
    },
];
