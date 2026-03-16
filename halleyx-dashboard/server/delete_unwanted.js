const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('./src/models/Order');

async function deleteUnwantedOrders() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Show current state
    const total = await Order.countDocuments();
    console.log(`\n📊 Total orders before cleanup: ${total}`);

    // List all orders to inspect
    const allOrders = await Order.find({}, {
      'customer.firstName': 1,
      'customer.lastName': 1,
      'orderInfo.createdBy': 1,
      'orderInfo.product': 1
    });

    console.log('\n--- Existing Orders ---');
    allOrders.forEach((o, i) => {
      console.log(`  ${i + 1}. ${o.customer.firstName} ${o.customer.lastName} | by: ${o.orderInfo.createdBy} | ${o.orderInfo.product}`);
    });

    // Delete ALL orders that are NOT created by 'Naveen' 
    // (keep only Naveen's real orders, wipe all mock/seeded/unwanted ones)
    const toDelete = await Order.deleteMany({
      'orderInfo.createdBy': { $ne: 'Naveen' }
    });
    console.log(`\n🗑️  Deleted ${toDelete.deletedCount} unwanted/mock orders`);

    const remaining = await Order.countDocuments();
    console.log(`📊 Orders remaining (Naveen's only): ${remaining}`);

    await mongoose.disconnect();
    console.log('🔌 Done.\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

deleteUnwantedOrders();
