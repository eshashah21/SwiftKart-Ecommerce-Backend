const bcrypt = require("bcrypt");
const User = require("./src/models/User.Model");
const mongoose = require('mongoose');
const { connectDb } = require('./src/config/db');

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await connectDb();
    console.log('MongoDB connected successfully');

    const hashedPassword = await bcrypt.hash('admin_password', 10); // Replace 'admin_password' with your password
    const adminUser = new User({
      email: 'admin_email@example.com', // Replace with the admin email
      password: hashedPassword,
      role: 'ROLE_ADMIN',
      firstName: 'Admin', // Replace with appropriate first name
      lastName: 'User' // Replace with appropriate last name
    });
    await adminUser.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close(); // Ensure the connection is closed
  }
};

createAdminUser();
// node createAdminUser.js  