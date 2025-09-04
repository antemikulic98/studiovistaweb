require('dotenv').config({ path: '.env.local' });
const { connectDB, disconnectDB } = require('../config/database');
const User = require('../models/User');

// User creation script for Studio Vista - MongoDB version
async function createUsers() {
  // Connect to MongoDB first
  const connected = await connectDB();
  if (!connected) {
    console.error('❌ Failed to connect to MongoDB. Exiting...');
    process.exit(1);
  }
  const users = [
    {
      email: 'ante@studiovista.hr',
      password: 'njonjotruba#',
      name: 'Ante',
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
    {
      email: 'boris@studiovista.hr',
      password: 'njonjotruba#',
      name: 'Boris',
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
  ];

  console.log('🇭🇷 Studio Vista - Creating users in MongoDB...\n');

  const createdUsers = [];

  for (const userData of users) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists - skipping`);
        continue;
      }

      // Create new user (password will be automatically hashed)
      const newUser = await User.createUser(userData);
      createdUsers.push(newUser);

      console.log(`✅ Created user: ${userData.email}`);
      console.log(`   Name: ${userData.name}`);
      console.log(`   Role: ${userData.role}`);
      console.log(`   ID: ${newUser._id}`);
      console.log(`   Created at: ${newUser.createdAt}\n`);
    } catch (error) {
      console.error(`❌ Error creating user ${userData.email}:`, error.message);
    }
  }

  // Disconnect from MongoDB
  await disconnectDB();

  if (createdUsers.length > 0) {
    console.log('🎉 User creation completed successfully!');
    console.log(`📊 Created ${createdUsers.length} users in MongoDB cluster\n`);
    console.log('📋 Login credentials:');
    console.log('='.repeat(40));
    users.forEach((user) => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log('-'.repeat(40));
    });
  } else {
    console.log('ℹ️  No new users were created (all users already exist)');
  }
}

// Run the script
createUsers().catch((error) => {
  console.error('\n❌ Script failed:', error.message);
  console.error('\n💡 Make sure to:');
  console.error('   1. Set your MONGODB_URI environment variable');
  console.error('   2. Check your MongoDB cluster is running');
  console.error('   3. Verify network access to your cluster');
  process.exit(1);
});
