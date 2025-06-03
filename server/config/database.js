// config/database.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

class Database {
    constructor() {
        this.client = null;
        this.db = null;
        this.uri = process.env.MONGODB_URI;
    }

    async connect() {
        try {
            this.client = new MongoClient(this.uri);
            await this.client.connect();
            this.db = this.client.db();
            console.log('✅ MongoDB connected successfully');
            return this.db;
        } catch (error) {
            console.error('❌ MongoDB connection error:', error);
            process.exit(1);
        }
    }

    getDb() {
        return this.db;
    }

    async close() {
        if (this.client) {
            await this.client.close();
        }
    }
}

module.exports = new Database();