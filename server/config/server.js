// config/server.js
const serverConfig = {
    port: process.env.PORT || 8000,
    host: process.env.HOST || 'localhost',
    routes: {
        cors: {
            origin: process.env.ALLOWED_ORIGINS ?
                process.env.ALLOWED_ORIGINS.split(',') : ['*'],
            headers: ['Accept', 'Content-Type', 'Authorization'],
            additionalHeaders: ['X-Requested-With']
        },
        validate: {
            failAction: async (request, h, err) => {
                console.error('Validation error:', err);
                throw err;
            }
        }
    }
};

module.exports = serverConfig;  