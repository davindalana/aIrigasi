// server.js
const Hapi = require('@hapi/hapi');
const database = require('./config/database');
const serverConfig = require('./config/server');
const registerRoutes = require('./routes');
const logger = require('./utils/logger');

require('dotenv').config();

const init = async () => {
    try {
        // Koneksi ke database
        const db = await database.connect();
        
        // Inisialisasi server
        const server = Hapi.server(serverConfig);

        // Register routes
        await registerRoutes(server, db);

        // Error handling
        server.ext('onPreResponse', (request, h) => {
            const response = request.response;
            
            if (response.isBoom) {
                logger.error('Server error', {
                    error: response.message,
                    stack: response.stack,
                    path: request.path,
                    method: request.method
                });
            }
            
            return h.continue;
        });

        // Start server
        await server.start();
        logger.info(`🚀 Server running on ${server.info.uri}`);
        
        return server;

    } catch (error) {
        logger.error('Failed to start server', error);
        process.exit(1);
    }
};

// Handle process termination
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled rejection', err);
    process.exit(1);
});

process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    await database.close();
    process.exit(0);
});

// Start server
init();