// =============================================
// controllers/cartController.js - Cart Logic
// =============================================

const Cart = require("../models/Cart");
const FoodItem = require("../models/FoodItem");

// -------------------------------------------------------
// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
// -------------------------------------------------------
const getCart = async (req, res, next) => {
  try {
    // populate() replaces the foodItem ID with the actual food document
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.foodItem",
      "name image price category isAvailable"
    );

    if (!cart) {
      // Return empty cart if user hasn't added anything yet
      return res.status(200).json({
        success: true,
        data: { items: [], totalPrice: 0 },
      });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Add item to cart (or increase quantity if exists)
// @route   POST /api/cart
// @access  Private
// -------------------------------------------------------
const addToCart = async (req, res, next) => {
  try {
    const { foodItemId, quantity = 1 } = req.body;

    if (!foodItemId) {
      return res.status(400).json({ success: false, message: "Food item ID is required" });
    }

    // Check if the food item actually exists
    const foodItem = await FoodItem.findById(foodItemId);
    if (!foodItem) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }
    if (!foodItem.isAvailable) {
      return res.status(400).json({ success: false, message: "Food item is currently unavailable" });
    }

    // Find or create the user's cart
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // First time adding to cart — create a new cart document
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if this food item is already in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.foodItem.toString() === foodItemId
    );

    if (existingItemIndex > -1) {
      // Item exists → increase quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // New item → push to items array
      cart.items.push({
        foodItem: foodItemId,
        quantity,
        price: foodItem.price,
      });
    }

    // Recalculate total
    cart.calculateTotal();
    await cart.save();

    // Return populated cart
    const populatedCart = await Cart.findById(cart._id).populate(
      "items.foodItem",
      "name image price"
    );

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Update item quantity in cart
// @route   PUT /api/cart/:foodItemId
// @access  Private
// -------------------------------------------------------
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { foodItemId } = req.params;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.foodItem.toString() === foodItemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.calculateTotal();
    await cart.save();

    res.status(200).json({ success: true, message: "Cart updated", data: cart });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Remove item from cart
// @route   DELETE /api/cart/:foodItemId
// @access  Private
// -------------------------------------------------------
const removeFromCart = async (req, res, next) => {
  try {
    const { foodItemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Filter out the item to remove
    cart.items = cart.items.filter(
      (item) => item.foodItem.toString() !== foodItemId
    );

    cart.calculateTotal();
    await cart.save();

    res.status(200).json({ success: true, message: "Item removed from cart", data: cart });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Clear the entire cart
// @route   DELETE /api/cart
// @access  Private
// -------------------------------------------------------
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
    }

    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
