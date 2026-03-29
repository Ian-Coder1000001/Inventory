const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://iansheezy1:Incorrect123.@cluster0.4lnihds.mongodb.net/?appName=Cluster0';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['owner', 'manager'], required: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

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
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      console.log(`User ${u.email} already exists, skipping.`);
      continue;
    }
    const hashed = await bcrypt.hash(u.password, 10);
    await User.create({ email: u.email, password: hashed, role: u.role });
    console.log(`Created ${u.role}: ${u.email}`);
  }

  await mongoose.disconnect();
  console.log('Done. Users seeded.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});