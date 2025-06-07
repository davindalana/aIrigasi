// models/Prediction.js
const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  input: {
    Soil_Moisture: Number,
    Temperature: Number,
    Air_Humidity: Number,
  },
  result: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  collection: 'predictions' // 👈 ini memastikan namanya 'predictions'
});

module.exports = mongoose.model('Prediction', predictionSchema);