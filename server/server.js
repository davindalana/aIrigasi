const Hapi = require('@hapi/hapi');
require('dotenv').config();
const connectDB = require('./config/database'); // Pastikan path ini sesuai dengan struktur folder Anda

const init = async () => {
    // Inisialisasi server Hapi
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST || 'localhost',
        routes: {
            cors: {
                origin: ['*'], // Untuk development, production harus lebih specific
                headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
                credentials: true
            }
        }
    });

    // Koneksi ke MongoDB
    await connectDB();

    // Register routes
    await server.register(require('./routes')); // <== cukup index.js saja

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
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();