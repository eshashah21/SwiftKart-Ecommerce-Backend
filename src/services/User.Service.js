const User = require("../models/User.Model");
const bcrypt = require("bcrypt");
const jwtProvider = require("../config/jwtProvider");

const createUser = async (userData) => {
  try {
    let { firstName, lastName, email, password } = userData;

    // Ensure all required fields are provided
    if (!firstName || !lastName || !email || !password) {
      throw new Error(
        "All fields (firstName, lastName, email, password) are required."
      );
    }

    // Check if user already exists
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      throw new Error("User already exists with this emailId");
    }

    // Hash the password
    password = await bcrypt.hash(password, 8);

    // Create the user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    return user;
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw new Error(error.message);
  }
};

const findUserById = async (userId) => {
  try {
    if (!userId) {
      throw new Error("UserId is required.");
    }

    const user = await User.findById(userId);
    // .populate("address");

    if (!user) {
      throw new Error("User not found with this id: " + userId);
    }

    return user;
  } catch (error) {
    console.error("Error finding user by id:", error.message);
    throw new Error(error.message);
  }
};

const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found with this email: ", email);
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUserProfileByToken = async (token) => {
  try {
    if (!token) {
      throw new Error("Token is required.");
    }

    const userId = jwtProvider.getUserIdFromToken(token);

    if (!userId) {
      throw new Error("Invalid token or userId not found in token.");
    }

    const user = await findUserById(userId);
    return user;
  } catch (error) {
    console.error("Error getting user profile by token:", error.message);
    throw new Error(error.message);
  }
};

const getAllUsers = async () => {
  try {
    const users = await User.find();

    return users;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createUser,
  findUserById,
  findUserByEmail,
  getUserProfileByToken,
  getAllUsers,
};
