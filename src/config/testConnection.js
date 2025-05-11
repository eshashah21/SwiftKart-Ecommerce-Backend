const mongoose = require('mongoose');
const { connectDb } = require('./db'); // Adjust path as needed

const testConnection = async () => {
  try {
    await connectDb();
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  } finally {
    mongoose.connection.close();
  }
};

testConnection();