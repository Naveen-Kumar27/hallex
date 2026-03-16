const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/Hallex/halleyx-dashboard/server/.env' });

const Order = require('d:/Hallex/halleyx-dashboard/server/src/models/Order');

async function debugOrders() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const allOrders = await Order.find({});
    console.log(`Total orders in DB: ${allOrders.length}`);
    allOrders.forEach(o => {
      console.log(`- ${o.customer.firstName} ${o.customer.lastName} | CreatedBy: ${o.orderInfo.createdBy}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debugOrders();
