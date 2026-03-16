const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/Hallex/halleyx-dashboard/server/.env' });

const Dashboard = require('d:/Hallex/halleyx-dashboard/server/src/models/Dashboard');

async function renameDashboards() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await Dashboard.updateMany(
      { name: 'AI Generated Analytics' },
      { name: 'Workspan AI Analytics' }
    );
    console.log(`Renamed ${result.modifiedCount} dashboards.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

renameDashboards();
