const mongoose = require('mongoose');
require('dotenv').config();

async function inspectUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    // Get the users collection
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    
    console.log('--- User Avatars ---');
    users.forEach(u => {
      console.log(`User: ${u.name} (${u.email})`);
      console.log(`Avatar: ${u.avatar}`);
      console.log('---');
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

inspectUsers();
