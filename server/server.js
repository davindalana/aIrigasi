const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
require('dotenv').config();

const init = async () => {
    // Inisialisasi server Hapi
    const server = Hapi.server({
        port: process.env.PORT || 3000,
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
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/irrigation_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }

    // Register routes
    await server.register([
        {
            plugin: require('./routes/sensorRoutes'),
            options: {}
        },
        {
            plugin: require('./routes/predictionRoutes'),
            options: {}
        }
    ]);

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