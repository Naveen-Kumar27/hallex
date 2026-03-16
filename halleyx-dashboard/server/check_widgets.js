const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/Hallex/halleyx-dashboard/server/.env' });

const Widget = require('d:/Hallex/halleyx-dashboard/server/src/models/Widget');

async function checkWidgets() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const widgets = await Widget.find({});
    widgets.forEach(w => {
      console.log(`Widget: ${w.title} | Type: ${w.type}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkWidgets();
