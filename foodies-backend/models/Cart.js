// =============================================
// models/Cart.js - Cart Schema
// =============================================
// Each user has ONE cart document.
// The cart holds an array of food items with quantities.

const mongoose = require("mongoose");

// Sub-schema for each item inside the cart
const cartItemSchema = new mongoose.Schema({
  foodItem: {
    type: mongoose.Schema.Types.ObjectId, // reference to FoodItem collection
    ref: "FoodItem",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
    default: 1,
  },
  price: {
    type: Number, // store price at time of adding (in case price changes later)
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one cart per user
    },
    items: [cartItemSchema], // array of cart items
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// -------------------------------------------------------
// METHOD: Calculate total price before saving
// -------------------------------------------------------
cartSchema.methods.calculateTotal = function () {
  this.totalPrice = this.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
  // Round to 2 decimal places
  this.totalPrice = Math.round(this.totalPrice * 100) / 100;
};

module.exports = mongoose.model("Cart", cartSchema);
