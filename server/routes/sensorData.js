const express = require('express');
const router = express.Router();
const controller = require('../controllers/sensorDataController');

console.log('controller:', controller);
console.log('addSensorData:', controller.addSensorData);
console.log('getAllSensorData:', controller.getAllSensorData);

router.post('/', controller.addSensorData);
router.get('/', controller.getAllSensorData);

module.exports = router;