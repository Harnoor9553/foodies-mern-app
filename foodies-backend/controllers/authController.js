// =============================================
// controllers/authController.js - Auth Logic
// =============================================
// Contains the functions for register, login, logout, and get profile.
// Controllers handle the BUSINESS LOGIC for each route.

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// -------------------------------------------------------
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// -------------------------------------------------------
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate: check all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered. Please login instead.",
      });
    }

    // Create the user (password gets hashed automatically via User model pre-save hook)
    const user = await User.create({ name, email, password });

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error); // pass to global error handler
  }
};

// -------------------------------------------------------
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// -------------------------------------------------------
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate: check fields exist
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user by email — we use .select('+password') because
    // our schema hides password by default (select: false)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare the entered password with the hashed password in DB
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Get logged-in user's profile
// @route   GET /api/auth/profile
// @access  Private (requires JWT)
// -------------------------------------------------------
const getProfile = async (req, res, next) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
// -------------------------------------------------------
const updateProfile = async (req, res, next) => {
  try {
    const { name, address, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, address, phone },
      { new: true, runValidators: true } // return the updated doc
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile, updateProfile };
