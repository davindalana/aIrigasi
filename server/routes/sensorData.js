const sensorDataController = require('../controllers/sensorDataController');
const sensorBatchController = require('../controllers/sensorBatchController');

module.exports = async () => [
  {
    method: 'GET',
    path: '/realtime',
    handler: sensorDataController.getLatestRealTime
  },
  {
    method: 'GET',
    path: '/batch',
    handler: sensorBatchController.getAllBatchData
  },
  {
    method: 'POST',
    path: '/sensor',
    handler: sensorDataController.manualSensorInput
  }
];
