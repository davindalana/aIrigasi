// models/SensorData.js
const Joi = require('@hapi/joi');

class SensorData {
    static getValidationSchema() {
        return Joi.object({
            humidity: Joi.number().min(0).max(100).required(),
            temperature: Joi.number().min(-50).max(100).required(),
            ph: Joi.number().min(0).max(14).required(),
            location: Joi.string().optional(),
            plantType: Joi.string().optional(),
            timestamp: Joi.date().default(Date.now),
            metadata: Joi.object().optional()
        });
    }

    static async create(db, data) {
        const collection = db.collection('sensorData');
        const validatedData = await this.getValidationSchema().validateAsync(data);
        
        const sensorData = {
            ...validatedData,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await collection.insertOne(sensorData);
        return { ...sensorData, _id: result.insertedId };
    }

    static async findLatest(db, limit = 1) {
        const collection = db.collection('sensorData');
        return await collection
            .find({})
            .sort({ timestamp: -1 })
            .limit(limit)
            .toArray();
    }

    static async findByDateRange(db, startDate, endDate, options = {}) {
        const collection = db.collection('sensorData');
        const { limit = 50, skip = 0 } = options;
        
        const query = {};
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        return await collection
            .find(query)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();
    }
}

module.exports = SensorData;