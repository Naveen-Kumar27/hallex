const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/Hallex/halleyx-dashboard/server/.env' });

const Order = require('d:/Hallex/halleyx-dashboard/server/src/models/Order');

async function listOrders() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const orders = await Order.find({}, { 'customer.firstName': 1, 'orderInfo.createdBy': 1 }).limit(10);
    console.log('Sample Orders:', JSON.stringify(orders, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listOrders();
