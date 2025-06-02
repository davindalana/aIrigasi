// Temporary in-memory buffer
const sensorBuffer = [];

// Tambah data ke buffer
function addToBuffer(sensorData) {
  sensorBuffer.push(sensorData);
  console.log(`📥 Data sensor ditambahkan ke buffer. Total: ${sensorBuffer.length}`);
}

// Ambil dan kosongkan buffer setiap 1 jam (dipanggil oleh CRON)
function getAndClearBuffer() {
  const batch = [...sensorBuffer];
  sensorBuffer.length = 0;
  console.log(`📤 Ambil ${batch.length} data dari buffer dan kosongkan.`);
  return batch;
}

module.exports = {
  addToBuffer,
  getAndClearBuffer
};