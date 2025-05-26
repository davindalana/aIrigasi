// server/models/plantDataModel.js
const mongoose = require('mongoose');

const plantDataSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    soilMoisture: {
        type: Number,
        required: true
    },
    airTemperature: {
        type: Number,
        required: true
    },
    humidity: { // Kelembaban udara
        type: Number,
        required: true
    },
    dummyPrediction: { // Kolom untuk prediksi dummy kita
        type: String,
        required: true
    },
    isWatering: { // Opsional, jika ingin menyimpan status penyiraman
        type: Boolean,
        default: false
    }
});

// Kita bisa menamai modelnya 'PlantData' yang akan menjadi koleksi 'plantdatas' di MongoDB
module.exports = mongoose.model('PlantData', plantDataSchema);