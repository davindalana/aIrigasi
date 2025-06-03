// utils/mlService.js
const { spawn } = require('child_process');
const path = require('path');

class MLService {
    constructor() {
        this.modelPath = path.join(__dirname, '..', 'ml');
        this.pythonPath = process.env.PYTHON_PATH || 'python';
    }

    async predict(sensorData) {
        return new Promise((resolve, reject) => {
            const scriptPath = path.join(this.modelPath, 'predict.py');
            const pythonProcess = spawn(this.pythonPath, [scriptPath]);
            
            let result = '';
            let error = '';
            
            // Timeout untuk mencegah hanging
            const timeout = setTimeout(() => {
                pythonProcess.kill();
                reject(new Error('Prediction timeout'));
            }, 30000); // 30 detik timeout

            // Kirim data ke Python script
            pythonProcess.stdin.write(JSON.stringify(sensorData));
            pythonProcess.stdin.end();
            
            // Kumpulkan output
            pythonProcess.stdout.on('data', (data) => {
                result += data.toString();
            });
            
            pythonProcess.stderr.on('data', (data) => {
                error += data.toString();
            });
            
            pythonProcess.on('close', (code) => {
                clearTimeout(timeout);
                
                if (code === 0) {
                    try {
                        const prediction = JSON.parse(result.trim());
                        resolve(prediction);
                    } catch (parseError) {
                        reject(new Error(`Failed to parse prediction: ${parseError.message}`));
                    }
                } else {
                    reject(new Error(`Python script failed (code ${code}): ${error}`));
                }
            });
            
            pythonProcess.on('error', (err) => {
                clearTimeout(timeout);
                reject(new Error(`Failed to start Python process: ${err.message}`));
            });
        });
    }

    async isModelReady() {
        const modelFile = path.join(this.modelPath, 'model.joblib');
        const fs = require('fs');
        return fs.existsSync(modelFile);
    }
}

module.exports = new MLService();