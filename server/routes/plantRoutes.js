// server/routes/plantRoutes.js
const plantController = require('../controllers/plantController');

module.exports = [
    {
        method: 'POST',
        path: '/api/sensor-input', // Path rute
        handler: plantController.handleSensorInput // Fungsi handler
    },
    {
        method: 'GET',
        path: '/api/plant-status',
        handler: plantController.getPlantStatus
    },
    {
        method: 'POST',
        path: '/api/water-plant/trigger',
        handler: plantController.triggerWatering
    }
];