const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// 1. Load the .env.local file from the project root
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// 2. Use ONLY the URI from your environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['owner', 'manager'], required: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  console.log('Attempting to connect to MongoDB...');
  
  // Set connection timeout to 10s so you don't wait 30s if it fails
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  
  console.log('✅ Connected to MongoDB');

  const users = [
    {
      email: 'ian@inventory.com',
      password: 'Incorrect123.',
      role: 'owner',
    },
    {
      email: 'tinez@inventory.com',
      password: '0987654321',
      role: 'manager',
    },
  ];

  for (const u of users) {
    const existing = await User.findOne({ email: u.email.toLowerCase() });
    if (existing) {
      console.log(`ℹ️ User ${u.email} already exists, skipping.`);
      continue;
    }
    const hashed = await bcrypt.hash(u.password, 10);
    await User.create({ email: u.email, password: hashed, role: u.role });
    console.log(`🚀 Created ${u.role}: ${u.email}`);
  }

  await mongoose.disconnect();
  console.log('✨ Done. Users seeded.');
}

seed().catch((err) => {
  console.error('❌ Seed Error:', err.message);
  process.exit(1);
});