const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/Hallex/halleyx-dashboard/server/.env' });

async function checkAll() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    const db = conn.connection.db;
    const collections = await db.listCollections().toArray();
    for (let col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`Collection: ${col.name}, Count: ${count}`);
        if (count > 0 && col.name === 'orders') {
            const docs = await db.collection(col.name).find({}).limit(5).toArray();
            console.log('Sample Docs:', JSON.stringify(docs, null, 2));
        }
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkAll();
