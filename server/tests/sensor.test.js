// tests/sensor.test.js
const { expect } = require('@jest/globals');
const Hapi = require('@hapi/hapi');

describe('Sensor API Tests', () => {
    let server;

    beforeAll(async () => {
        // Setup test server
        server = Hapi.server({
            port: 3001,
            host: 'localhost'
        });
        
        // Register routes for testing
        // ... setup routes
    });

    afterAll(async () => {
        await server.stop();
    });

    test('POST /api/sensor-data should create sensor data', async () => {
        const payload = {
            humidity: 45.5,
            temperature: 25.3,
            ph: 6.8
        };

        const response = await server.inject({
            method: 'POST',
            url: '/api/sensor-data',
            payload
        });

        expect(response.statusCode).toBe(201);
        expect(response.result.success).toBe(true);
        expect(response.result.data.sensorData).toBeDefined();
        expect(response.result.data.prediction).toBeDefined();
    });

    test('GET /api/sensor-data/latest should return latest data', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/api/sensor-data/latest'
        });

        expect(response.statusCode).toBe(200);
        expect(response.result.success).toBe(true);
        expect(response.result.data.sensorData).toBeDefined();
    });
});