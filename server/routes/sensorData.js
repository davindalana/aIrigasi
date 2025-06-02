const controller = require('../controllers/sensorDataController');

module.exports = async () => {
  return [
    {
      method: 'POST',
      path: '/api/sensor',
      handler: controller.addSensorData
    },
    {
      method: 'GET',
      path: '/api/sensor',
      handler: controller.getAllSensorData
    }
  ];
};