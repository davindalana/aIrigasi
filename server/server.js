const Hapi = require('@hapi/hapi');
require('dotenv').config();
const connectDB = require('./config/database');

const init = async () => {
    const port = process.env.PORT;
    const host = process.env.HOST || '0.0.0.0'; // Gunakan '0.0.0.0' untuk host di lingkungan cloud

    const server = Hapi.server({
        port: port,
        host: host,
        routes: {
            cors: {
                origin: ['*'], // **PENTING:** Untuk produksi, ganti '*' dengan domain frontend Anda (misalnya: 'https://your-frontend.com')
                headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
                credentials: true
            },
            // **PENAMBAHAN PENTING UNTUK MEMASTIKAN PARSING JSON YANG BENAR**
            payload: {
                allow: 'application/json', // Izinkan hanya payload JSON
                parse: true,               // Pastikan Hapi mem-parsing payload
                output: 'data'             // Pastikan output payload adalah objek data (bukan buffer)
            }
        }
    });

    // Koneksi ke MongoDB
    await connectDB();

    // Registrasi routes Anda
    // Pastikan file 'routes/index.js' Anda mengekspor plugin Hapi yang benar
    await server.register(require('./routes'));

    // Health check route
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return {
                message: 'Irrigation System API',
                status: 'running',
                timestamp: new Date().toISOString()
            };
        }
    });

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
    console.log(`Configured PORT: ${port}, Configured HOST: ${host}`);
};

// Penanganan error untuk Promise yang tidak tertangani
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection (akan keluar):', err); // Ubah log agar lebih jelas
    process.exit(1); // Keluar dari proses karena error fatal
});

// Panggil fungsi inisialisasi server
init();