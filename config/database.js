const mongoose = require('mongoose');

// MongoDB connection configuration for Studio Vista
const connectDB = async () => {
  try {
    // Use environment variable or fallback to local MongoDB
    const mongoURI =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/studiovista';

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🍃 MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('\n💡 Make sure to:');
    console.error('   1. Set MONGODB_URI environment variable');
    console.error('   2. Check your MongoDB cluster is running');
    console.error('   3. Verify connection string is correct');
    return false;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🍃 MongoDB disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error.message);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
