const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/Hallex/halleyx-dashboard/server/.env' });

async function checkUsers() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    const users = await conn.connection.db.collection('users').find({}).toArray();
    console.log('Users:', JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkUsers();
