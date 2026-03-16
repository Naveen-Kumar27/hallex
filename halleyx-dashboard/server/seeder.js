const axios = require('axios');

// Realistic Mock Data for a Premium Analytics Experience
const seedOrders = async () => {
  const products = [
    "Enterprise Fiber 2Gbps",
    "Global SD-WAN Bridge",
    "Neural Network Gateway",
    "Cloud VPC - Unlimited",
    "Secure VoIP Matrix",
    "Quantum Signal Hub",
    "Edge Compute Node X1",
    "Managed Security Shield"
  ];

  const firstNames = [
    "Alexander", "Isabella", "Benjamin", "Charlotte", "Sebastian", 
    "Sophia", "Gabriel", "Amelia", "Julian", "Evelyn", 
    "Theodore", "Harper", "Dominic", "Luna"
  ];

  const lastNames = [
    "Vance", "Sterling", "Kensington", "Blackwood", "Chen", 
    "Rodriguez", "Hawthorne", "Mercer", "Sinclair", "Foster", 
    "Holloway", "Rhodes", "Bishop"
  ];

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

    // Spread dates over the last 120 days for richer charts
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 120));

    generatedOrders.push({
      customer: {
        firstName: firstName,
        lastName: lastName,
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

  console.log('--- Initializing Global Data Pulse ---');
  try {
     for (const order of generatedOrders) {
        await axios.post('http://localhost:5000/api/orders', order);
     }
     console.log('✅ Success: Global Analytics Mesh seeded with 60 high-fidelity records.');
  } catch (err) {
      console.error('❌ Data Burst Failed:', err.message);
  }
}

seedOrders();
