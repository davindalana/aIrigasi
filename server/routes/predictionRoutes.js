const { predictIrrigation } = require('../controllers/predictionController');

module.exports = [
    {
        method: 'POST',
        path: '/api/predict',
        handler: predictIrrigation,
    },
];
