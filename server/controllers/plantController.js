// server/controllers/plantController.js
const PlantData = require('../models/plantDataModel'); // Impor model Mongoose kita

// Fungsi untuk menangani input data sensor
exports.handleSensorInput = async (request, h) => { // Tambahkan async karena ada operasi DB
    const payload = request.payload || {};
    const { soilMoisture, airTemperature, humidity } = payload;

    console.log("Menerima data sensor (Hapi - MongoDB):");
    console.log(" - Kelembaban Tanah:", soilMoisture);
    console.log(" - Suhu Udara:", airTemperature);
    console.log(" - Kelembaban Udara:", humidity);

    // Validasi input sederhana
    if (soilMoisture === undefined || airTemperature === undefined || humidity === undefined) {
        return h.response({ message: "Input tidak lengkap. soilMoisture, airTemperature, dan humidity wajib diisi." }).code(400);
    }

    // Buat prediksi dummy
    const dummyPredictionText = (parseFloat(soilMoisture) < 50) ? "Dummy: Perlu Siram" : "Dummy: Cukup Air";

    try {
        const newPlantReading = new PlantData({
            soilMoisture,
            airTemperature,
            humidity,
            dummyPrediction: dummyPredictionText
            // isWatering akan default ke false sesuai skema
        });

        const savedData = await newPlantReading.save(); // Simpan ke MongoDB

        return h.response({
            message: "Data sensor diterima dan disimpan ke MongoDB dengan prediksi dummy.",
            savedData
        }).code(201);

    } catch (error) {
        console.error("Error saat menyimpan ke MongoDB:", error);
        return h.response({ message: "Gagal menyimpan data sensor.", error: error.message }).code(500);
    }
};

// Fungsi untuk mendapatkan status tanaman terakhir dari MongoDB
exports.getPlantStatus = async (request, h) => { // Tambahkan async
    try {
        // Ambil data terbaru berdasarkan timestamp descending, limit 1
        const latestStatus = await PlantData.findOne().sort({ timestamp: -1 });

        if (!latestStatus) {
            // Jika tidak ada data di DB, kembalikan status default
            return h.response({
                message: "Belum ada data sensor tersimpan.",
                lastTimestamp: null,
                soilMoisture: 0,
                airTemperature: 0,
                humidity: 0,
                currentPrediction: "Belum ada data",
                isWatering: false
            }).code(404);
        }

        // Kembalikan data terbaru dari DB
        return h.response({
            lastTimestamp: latestStatus.timestamp,
            soilMoisture: latestStatus.soilMoisture,
            airTemperature: latestStatus.airTemperature,
            humidity: latestStatus.humidity,
            currentPrediction: latestStatus.dummyPrediction, // Gunakan dummyPrediction
            isWatering: latestStatus.isWatering
        }).code(200);

    } catch (error) {
        console.error("Error saat mengambil data dari MongoDB:", error);
        return h.response({ message: "Gagal mengambil status tanaman.", error: error.message }).code(500);
    }
};

// (Opsional) Fungsi untuk memicu penyiraman
// Untuk saat ini, ini hanya akan memodifikasi data 'isWatering' pada record terakhir di DB
exports.triggerWatering = async (request, h) => { // Tambahkan async
    const { action } = request.payload; // "start" atau "stop"

    try {
        const latestEntry = await PlantData.findOne().sort({ timestamp: -1 });

        if (!latestEntry) {
            return h.response({ message: "Tidak ada data tanaman untuk diubah status penyiramannya." }).code(404);
        }

        let newWateringStatus;
        let responseMessage;

        if (action === "start") {
            newWateringStatus = true;
            responseMessage = "Status penyiraman 'dimulai' telah disimpan ke DB.";
            console.log("Aksi (Hapi - MongoDB): Memulai penyiraman");
        } else if (action === "stop") {
            newWateringStatus = false;
            responseMessage = "Status penyiraman 'dihentikan' telah disimpan ke DB.";
            console.log("Aksi (Hapi - MongoDB): Menghentikan penyiraman");
        } else {
            return h.response({ message: "Aksi tidak valid. Gunakan 'start' atau 'stop'." }).code(400);
        }

        latestEntry.isWatering = newWateringStatus;
        await latestEntry.save();

        return h.response({ message: responseMessage, wateringStatus: newWateringStatus }).code(200);

    } catch (error) {
        console.error("Error saat update status penyiraman:", error);
        return h.response({ message: "Gagal update status penyiraman.", error: error.message }).code(500);
    }
};