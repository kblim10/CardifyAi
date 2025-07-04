const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use production URI if in production, otherwise development URI
    const mongoURI = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_URI_PROD 
      : process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 30000, // Azure timeout handling
      maxPoolSize: 10, // Optimize for Azure
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // Don't exit in production, retry instead
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB; 