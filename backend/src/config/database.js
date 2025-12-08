import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/linguafrika';
    
    if (!MONGODB_URI || MONGODB_URI === 'mongodb://localhost:27017/linguafrika') {
      console.warn('⚠️ Using default MongoDB URI. Set MONGODB_URI environment variable for production.');
    }
    
    const conn = await mongoose.connect(MONGODB_URI, {
      // Connection options for better reliability
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error('Full error:', error);
    // Don't exit immediately - let the server handle it
    throw error;
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB error:', error);
});

// Handle process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});


