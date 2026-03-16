const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('./src/models/Order');

async function cleanAndSeed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Step 1: Clean old mock data
    const r1 = await Order.deleteMany({ 'customer.firstName': { $regex: /^User/i } });
    console.log(`🗑️  Deleted ${r1.deletedCount} "User*" placeholder orders`);

    const r2 = await Order.deleteMany({
      'orderInfo.createdBy': { $in: ['Mr. Michael Harris', 'Mr. Ryan Cooper', 'Ms. Olivia Carter'] }
    });
    console.log(`🗑️  Deleted ${r2.deletedCount} mock-creator orders`);

    const countAfterClean = await Order.countDocuments();
    console.log(`📊 Orders remaining after cleanup: ${countAfterClean}`);

    // Step 2: Seed fresh data
    const products = [
      "Enterprise Fiber 2Gbps", "Global SD-WAN Bridge", "Neural Network Gateway",
      "Cloud VPC - Unlimited", "Secure VoIP Matrix", "Quantum Signal Hub",
      "Edge Compute Node X1", "Managed Security Shield"
    ];
    const firstNames = ["Alexander", "Isabella", "Benjamin", "Charlotte", "Sebastian", "Sophia", "Gabriel", "Amelia", "Julian", "Evelyn", "Theodore", "Harper", "Dominic", "Luna"];
    const lastNames = ["Vance", "Sterling", "Kensington", "Blackwood", "Chen", "Rodriguez", "Hawthorne", "Mercer", "Sinclair", "Foster", "Holloway", "Rhodes", "Bishop"];
    const cities = [
      { name: 'New York', country: 'USA' },
      { name: 'London', country: 'UK' },
      { name: 'Singapore', country: 'Singapore' },
      { name: 'Dubai', country: 'UAE' },
      { name: 'Berlin', country: 'Germany' },
      { name: 'Tokyo', country: 'Japan' },
      { name: 'Toronto', country: 'Canada' }
    ];
    const statuses = ["Pending", "In Progress", "Completed"];
    const creators = ["Naveen", "Halleyx AI", "System Admin", "Regional Director"];

    const generatedOrders = [];
    for (let i = 0; i < 60; i++) {
      const qty = Math.floor(Math.random() * 8) + 1;
      const price = Math.floor(Math.random() * 1500) + 250;
      const cityObj = cities[Math.floor(Math.random() * cities.length)];
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 120));

      generatedOrders.push({
        customer: {
          firstName, lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@corporate.ai`,
          phoneNumber: `+1-800-SYN-${Math.floor(1000 + Math.random() * 9000)}`,
          streetAddress: `${500 + i} Innovation Way`,
          city: cityObj.name,
          stateProvince: 'Global District',
          country: cityObj.country
        },
        orderInfo: {
          product: products[Math.floor(Math.random() * products.length)],
          quantity: qty,
          unitPrice: price,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          createdBy: creators[Math.floor(Math.random() * creators.length)],
          orderDate: orderDate.toISOString()
        }
      });
    }

    await Order.insertMany(generatedOrders);
    const finalCount = await Order.countDocuments();
    console.log(`✅ Seeded 60 premium enterprise orders`);
    console.log(`📊 Total orders in database: ${finalCount}`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  }
}

cleanAndSeed();
