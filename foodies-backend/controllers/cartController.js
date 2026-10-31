// =============================================
// controllers/cartController.js - Cart Logic
// =============================================

const Cart = require("../models/Cart");
const FoodItem = require("../models/FoodItem");

// =============================================
// GET USER CART
// GET /api/cart
// =============================================
const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id
    }).populate(
      "items.foodItem",
      "name image price category isAvailable"
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          items: [],
          totalPrice: 0
        }
      });
    }

    res.status(200).json({
      success: true,
      data: cart
    });

  } catch (error) {
    next(error);
  }
};

// =============================================
// ADD ITEM TO CART
// POST /api/cart
// =============================================
const addToCart = async (req, res, next) => {
  try {
    const { foodItemId, quantity = 1 } = req.body;
    const qty = Number(quantity);

    // Validate food item ID
    if (!foodItemId) {
      return res.status(400).json({
        success: false,
        message: "Food item ID is required"
      });
    }

    // Validate quantity
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer"
      });
    }

    // Check whether food item exists
    const foodItem = await FoodItem.findById(foodItemId);

    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: "Food item not found"
      });
    }

    if (!foodItem.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Food item is currently unavailable"
      });
    }

    const userId = req.user._id;

    // Create cart if it doesn't exist
    await Cart.findOneAndUpdate(
      { user: userId },
      {
        $setOnInsert: {
          user: userId,
          items: [],
          totalPrice: 0
        }
      },
      {
        upsert: true,
        new: true
      }
    );

    // Check whether item already exists
    let cart = await Cart.findOneAndUpdate(
      {
        user: userId,
        "items.foodItem": foodItemId
      },
      {
        $inc: {
          "items.$.quantity": qty,
          totalPrice: foodItem.price * qty
        }
      },
      {
        new: true
      }
    );

    // Add a new item if it doesn't exist
    if (!cart) {
      cart = await Cart.findOneAndUpdate(
        {
          user: userId,
          "items.foodItem": { $ne: foodItemId }
        },
        {
          $push: {
            items: {
              foodItem: foodItemId,
              quantity: qty,
              price: foodItem.price
            }
          },
          $inc: {
            totalPrice: foodItem.price * qty
          }
        },
        {
          new: true
        }
      );
    }

    // Handle a concurrent request that added the same item
    if (!cart) {
      cart = await Cart.findOneAndUpdate(
        {
          user: userId,
          "items.foodItem": foodItemId
        },
        {
          $inc: {
            "items.$.quantity": qty,
            totalPrice: foodItem.price * qty
          }
        },
        {
          new: true
        }
      );
    }

    if (!cart) {
      throw new Error("Unable to update cart. Please try again.");
    }

    // Return populated cart
    const populatedCart = await Cart.findById(cart._id).populate(
      "items.foodItem",
      "name image price category isAvailable"
    );

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: populatedCart
    });

  } catch (error) {
    next(error);
  }
};

// =============================================
// UPDATE CART ITEM QUANTITY
// PUT /api/cart/:foodItemId
// =============================================
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { foodItemId } = req.params;
    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1"
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const item = cart.items.find(
      (item) => item.foodItem.toString() === foodItemId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart"
      });
    }

    // Calculate the difference in quantity
    const difference = qty - item.quantity;

    await Cart.updateOne(
      {
        _id: cart._id,
        "items.foodItem": foodItemId
      },
      {
        $set: {
          "items.$.quantity": qty
        },
        $inc: {
          totalPrice: item.price * difference
        }
      }
    );

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.foodItem",
      "name image price"
    );

    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: updatedCart
    });

  } catch (error) {
    next(error);
  }
};

// =============================================
// REMOVE ITEM FROM CART
// DELETE /api/cart/:foodItemId
// =============================================
const removeFromCart = async (req, res, next) => {
  try {
    const { foodItemId } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const item = cart.items.find(
      (item) => item.foodItem.toString() === foodItemId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart"
      });
    }

    // Remove item and adjust total atomically
    await Cart.updateOne(
      { _id: cart._id },
      {
        $pull: {
          items: { foodItem: foodItemId }
        },
        $inc: {
          totalPrice: -(item.price * item.quantity)
        }
      }
    );

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.foodItem",
      "name image price"
    );

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: updatedCart
    });

  } catch (error) {
    next(error);
  }
};

// =============================================
// CLEAR ENTIRE CART
// DELETE /api/cart/clear
// =============================================
const clearCart = async (req, res, next) => {
  try {
    await Cart.updateOne(
      { user: req.user._id },
      {
        $set: {
          items: [],
          totalPrice: 0
        }
      }
    );

    res.status(200).json({
      success: true,
      message: "Cart cleared"
    });

  } catch (error) {
    next(error);
  }
};

// =============================================
// EXPORT CONTROLLERS
// =============================================
module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
