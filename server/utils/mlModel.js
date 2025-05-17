// utils/mlModel.js - Utilitas untuk komunikasi dengan model ML Python

const { PythonShell } = require('python-shell');
const path = require('path');

/**
 * Memprediksi kebutuhan penyiraman berdasarkan data sensor
 * @param {Object} sensorData - Data dari sensor (kelembaban tanah, suhu, pH)
 * @returns {Promise<Object>} - Hasil prediksi
 */
exports.predictWatering = async (sensorData) => {
    try {
        // Siapkan opsi untuk menjalankan Python script
        const options = {
            mode: 'json',
            pythonPath: process.env.PYTHON_PATH || 'python', // Path ke Python executable
            scriptPath: path.join(__dirname, '../../ml'), // Path ke folder ML
            args: [
                JSON.stringify({
                    soilMoisture: sensorData.soilMoisture,
                    temperature: sensorData.temperature,
                    pH: sensorData.pH
                })
            ]
        };

        // Jalankan script Python untuk prediksi
        return new Promise((resolve, reject) => {
            PythonShell.run('predict.py', options, (err, results) => {
                if (err) {
                    console.error('Error saat menjalankan model ML:', err);
                    reject(err);
                }

                // Parse hasil prediksi
                const prediction = results && results[0] ? results[0] : { needsWatering: false, confidence: 0 };
                resolve(prediction);
            });
        });
    } catch (error) {
        console.error('Error pada ML model utility:', error);
        throw error;
    }
};

/**
 * Melatih ulang model ML dengan dataset baru
 * @returns {Promise<Object>} - Status pelatihan model
 */
exports.retrainModel = async () => {
    try {
        const options = {
            mode: 'json',
            pythonPath: process.env.PYTHON_PATH || 'python',
            scriptPath: path.join(__dirname, '../../ml')
        };

        return new Promise((resolve, reject) => {
            PythonShell.run('train_model.py', options, (err, results) => {
                if (err) {
                    console.error('Error saat melatih ulang model ML:', err);
                    reject(err);
                }

                const training = results && results[0] ? results[0] : { success: false, message: 'Gagal melatih model' };
                resolve(training);
            });
        });
    } catch (error) {
        console.error('Error pada ML retraining utility:', error);
        throw error;
    }
};
