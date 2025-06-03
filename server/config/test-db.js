// test-db.js
const db = require('./database');

async function testConnection() {
  try {
    await db.connect();
    console.log('✅ Test connection success');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test connection failed:', error);
    process.exit(1);
  }
}

testConnection();
