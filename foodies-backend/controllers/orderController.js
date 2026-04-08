// =============================================
// controllers/orderController.js - Order Logic
// =============================================

const Order = require("../models/Order");
const Cart = require("../models/Cart");

// -------------------------------------------------------
// @desc    Place a new order (checkout from cart)
// @route   POST /api/orders
// @access  Private
// -------------------------------------------------------
const placeOrder = async (req, res, next) => {
  try {
    const { deliveryAddress, paymentMethod = "Cash on Delivery", notes } = req.body;

    // Validate delivery address
    if (
      !deliveryAddress ||
      !deliveryAddress.street ||
      !deliveryAddress.city ||
      !deliveryAddress.pincode ||
      !deliveryAddress.phone
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide complete delivery address (street, city, pincode, phone)",
      });
    }

    // Get user's current cart
// TEMP: use frontend data instead of DB cart
const cart = {
  items: req.body.items,
  totalPrice: req.body.totalPrice
};
    // Build the order items array — take a snapshot of current prices
    const orderItems = cart.items.map((item) => ({
      foodItem: item.foodItem._id,
      name: item.foodItem.name,
      price: item.price, // price at the time of adding to cart
      quantity: item.quantity,
      image: item.foodItem.image,
    }));

    // Create the order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      deliveryAddress,
      totalPrice: cart.totalPrice,
      paymentMethod,
      notes: notes || "",
    });

    // Clear the cart after placing order
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully! 🎉",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Get all orders for the logged-in user
// @route   GET /api/orders
// @access  Private
// -------------------------------------------------------
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
// -------------------------------------------------------
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Make sure the user owns this order (or is admin)
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to view this order" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
// -------------------------------------------------------
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Only owner can cancel
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Can only cancel if still Pending
    if (order.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel an order with status: ${order.status}`,
      });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ success: true, message: "Order cancelled", data: order });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Update order status (ADMIN only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
// -------------------------------------------------------
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(status === "Delivered" && { isDelivered: true, deliveredAt: Date.now() }),
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Order status updated", data: order });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Get ALL orders (ADMIN only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
// -------------------------------------------------------
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
};
