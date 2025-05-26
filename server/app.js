// server/app.js
'use strict';

require('dotenv').config();

const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
const plantRoutes = require('./routes/plantRoutes');

// Gunakan variabel dari process.env
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

const init = async () => {
    if (!MONGODB_URI) { // Tambahkan pemeriksaan jika MONGODB_URI tidak ada
        console.error('Error: MONGODB_URI tidak ditemukan. Pastikan file .env sudah benar dan variabel sudah diatur.');
        process.exit(1);
    }
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Berhasil terhubung ke MongoDB Atlas!');
    } catch (err) {
        console.error('Koneksi MongoDB gagal:', err.message);
        process.exit(1);
    }

    const server = Hapi.server({
        port: PORT, // Gunakan PORT dari process.env
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
                headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
                credentials: true
            }
        }
    });

    // ... (sisa kode server.route, server.start, dll. tetap sama) ...

    server.route(plantRoutes);

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Selamat datang di API AIrigasi (Hapi) dengan MongoDB!';
        }
    });

    await server.start();
    console.log(`Server AIrigasi Backend (Hapi) berjalan di: http://localhost:${PORT}`); // Gunakan PORT
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();