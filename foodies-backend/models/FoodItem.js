// =============================================
// models/FoodItem.js - Food Item Schema
// =============================================

const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [300, "Description cannot exceed 300 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      // Add or modify categories based on your menu
      enum: ["Burgers", "Pizza", "Pasta", "Salads", "Drinks", "Desserts", "Sides", "Other"],
    },
    image: {
      type: String,
      default: "default-food.jpg", // fallback image
    },
    isAvailable: {
      type: Boolean,
      default: true, // food items are available by default
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FoodItem", foodItemSchema);
