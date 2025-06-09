const Hapi = require('@hapi/hapi');
require('dotenv').config();
const connectDB = require('./config/database');

const init = async () => {
    const port = process.env.PORT;
    // INI YANG PALING PENTING: Ubah host menjadi '0.0.0.0' untuk lingkungan produksi
    const host = process.env.HOST || '0.0.0.0';

    const server = Hapi.server({
        port: port,
        host: host, // Pastikan ini disetel ke '0.0.0.0'
        routes: {
            cors: {
                origin: ['*'], // Ingat untuk mengubah ini ke domain spesifik di produksi!
                headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
                credentials: true
            }
        }
    });

    await connectDB();
    await server.register(require('./routes'));

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
    // Gunakan server.info.uri, yang seharusnya mencerminkan binding yang benar
    console.log(`Server running on ${server.info.uri}`);
    // Tambahkan log tambahan untuk debugging jika diperlukan
    console.log(`Configured PORT: ${port}, Configured HOST: ${host}`);
};

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

init();