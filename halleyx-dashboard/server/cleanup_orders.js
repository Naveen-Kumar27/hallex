const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/Hallex/halleyx-dashboard/server/.env' });

const Order = require('d:/Hallex/halleyx-dashboard/server/src/models/Order');

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete orders where customer.firstName starts with "User"
    const result = await Order.deleteMany({
      'customer.firstName': { $regex: /^User/i }
    });

    console.log(`Successfully deleted ${result.deletedCount} static orders.`);
    
    // Also delete orders created by the old mock creators if necessary
    const creatorsResult = await Order.deleteMany({
      'orderInfo.createdBy': { $in: ["Mr. Michael Harris", "Mr. Ryan Cooper", "Ms. Olivia Carter"] }
    });
    console.log(`Successfully deleted ${creatorsResult.deletedCount} orders created by mock users.`);

    process.exit(0);
  } catch (err) {
    console.error('Cleanup failed:', err);
    process.exit(1);
  }
}

cleanup();
