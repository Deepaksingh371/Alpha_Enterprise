// Run once to create the first admin account: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding.');
      process.exit(1);
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log(`Admin already exists for ${email}. Nothing to do.`);
      process.exit(0);
    }

    await Admin.create({ email, password, name: 'Admin' });
    console.log(`Admin account created for ${email}. You can now log in from /admin/login.`);
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
})();
