const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/Hallex/halleyx-dashboard/server/.env' });

const Order = require('d:/Hallex/halleyx-dashboard/server/src/models/Order');

async function purgeAllExceptNaveen() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete everything where createdBy is NOT 'Naveen'
    // OR where firstName starts with 'User' (just in case)
    const result = await Order.deleteMany({
      $or: [
        { 'orderInfo.createdBy': { $ne: 'Naveen' } },
        { 'customer.firstName': { $regex: /^User/i } }
      ]
    });

    console.log(`Successfully purged ${result.deletedCount} orders.`);
    process.exit(0);
  } catch (err) {
    console.error('Purge failed:', err);
    process.exit(1);
  }
}

purgeAllExceptNaveen();
