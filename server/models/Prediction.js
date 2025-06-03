// models/Prediction.js
const Joi = require('@hapi/joi');

class Prediction {
    static getValidationSchema() {
        return Joi.object({
            sensorDataId: Joi.string().required(),
            prediction: Joi.number().valid(0, 1).required(),
            confidence: Joi.number().min(0).max(1).optional(),
            needsWatering: Joi.boolean().required(),
            modelVersion: Joi.string().optional(),
            timestamp: Joi.date().default(Date.now)
        });
    }

    static async create(db, data) {
        const collection = db.collection('predictions');
        const validatedData = await this.getValidationSchema().validateAsync(data);
        
        const prediction = {
            ...validatedData,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await collection.insertOne(prediction);
        return { ...prediction, _id: result.insertedId };
    }

    static async findBySensorId(db, sensorDataId) {
        const collection = db.collection('predictions');
        return await collection.findOne({ sensorDataId });
    }

    static async getStatistics(db, dateRange = {}) {
        const collection = db.collection('predictions');
        const { startDate, endDate } = dateRange;
        
        const matchQuery = {};
        if (startDate || endDate) {
            matchQuery.timestamp = {};
            if (startDate) matchQuery.timestamp.$gte = new Date(startDate);
            if (endDate) matchQuery.timestamp.$lte = new Date(endDate);
        }

        return await collection.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: null,
                    totalPredictions: { $sum: 1 },
                    wateringNeeded: { $sum: { $cond: ['$needsWatering', 1, 0] } },
                    averageConfidence: { $avg: '$confidence' }
                }
            }
        ]).toArray();
    }
}

module.exports = Prediction;