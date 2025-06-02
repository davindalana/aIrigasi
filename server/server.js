require('dotenv').config();
const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
const sensorRoutes = require('./routes/sensorData');
const cron = require('node-cron');
const axios = require('axios');
const { getAndClearBuffer } = require('./controllers/sensorBatchController');

const RealTimeData = require('./models/RealTimeData');
const BatchData = require('./models/BatchData');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with'],
        additionalExposedHeaders: [],
        maxAge: 60,
        credentials: true
      }
    }
  });

  // Register routes
  const sensorRouteDefinitions = await sensorRoutes();
  server.route(sensorRouteDefinitions);

  // Logging
  server.events.on('request', (request, event, tags) => {
    if (tags.received) {
      console.log(`${request.method.toUpperCase()} ${request.url.pathname}`);
    }
  });

  // 404 handler
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;

    if (response.isBoom && response.output.statusCode === 404) {
      return h.response({ message: 'Route not found' }).code(404);
    }

    return h.continue;
  });

  // MongoDB connection
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  }

  await server.start();
  console.log('🚀 Server running on:', server.info.uri);

  // CRON JOB: Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    const batch = getAndClearBuffer();
    if (batch.length === 0) {
      console.log('⏱ Tidak ada data sensor pada batch jam ini.');
      return;
    }

    const avg = batch.reduce((acc, curr) => {
      acc.suhu += curr.suhu;
      acc.kelembapan += curr.kelembapan;
      acc.phTanah += curr.phTanah;
      acc.curahHujan += curr.curahHujan;
      return acc;
    }, { suhu: 0, kelembapan: 0, phTanah: 0, curahHujan: 0 });

    const total = batch.length;
    const features = [
      avg.suhu / total,
      avg.kelembapan / total,
      avg.phTanah / total,
      avg.curahHujan / total
    ];

    try {
      const res = await axios.post('http://localhost:8000/predict', {
        features
      });

      const perluSiram = res.data.perlu_siram;

      await BatchData.create({
        suhu: features[0],
        kelembapan: features[1],
        phTanah: features[2],
        curahHujan: features[3],
        perlu_siram: perluSiram,
        waktu: new Date()
      });

      console.log(`✅ Batch prediksi disimpan: ${perluSiram ? 'Perlu Siram' : 'Tidak Perlu Siram'}`);
    } catch (err) {
      console.error('❌ Gagal prediksi:', err.message);
    }
  });
};

init();
