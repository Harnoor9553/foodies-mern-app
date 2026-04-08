// =============================================
// models/User.js - User Schema (MongoDB Model)
// =============================================
// Defines what a "User" document looks like in MongoDB.

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // removes extra spaces
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // no two users can have the same email
      lowercase: true, // store emails in lowercase always
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // by default, don't return password in queries
    },
    role: {
      type: String,
      enum: ["user", "admin"], // only these two values are allowed
      default: "user",
    },
    address: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

// -------------------------------------------------------
// MIDDLEWARE: Hash password BEFORE saving to database
// -------------------------------------------------------
// This runs automatically when you call user.save()
userSchema.pre("save", async function (next) {
  // Only hash if password was changed (not on other updates like name)
  if (!this.isModified("password")) return next();

  // bcrypt salt rounds = 12 means stronger hashing (10-12 is recommended)
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// -------------------------------------------------------
// METHOD: Compare entered password with hashed password
// -------------------------------------------------------
// We add this method so we can do: user.comparePassword(enteredPassword)
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
