const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/Hallex/halleyx-dashboard/server/.env' });

async function listDBs() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    const admin = new mongoose.mongo.Admin(conn.connection.db);
    const dbs = await admin.listDatabases();
    console.log('Databases:', JSON.stringify(dbs.databases.map(d => d.name), null, 2));
    
    // Check if 'halleyx_dashboard' has orders collection
    const db = conn.connection.useDb('halleyx_dashboard');
    const collections = await db.db.listCollections().toArray();
    console.log('Collections in halleyx_dashboard:', collections.map(c => c.name));
    
    if (collections.some(c => c.name === 'orders')) {
        const count = await db.collection('orders').countDocuments();
        console.log(`Orders count: ${count}`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listDBs();
