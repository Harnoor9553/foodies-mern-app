
const Order = require("../models/Order");
const Cart = require("../models/Cart");


const placeOrder = async (req, res, next) => {
  try {
    const {
      deliveryAddress,
      paymentMethod = "Cash on Delivery",
      notes
    } = req.body;

    // 1. Validate delivery address
    if (
      !deliveryAddress ||
      !deliveryAddress.street ||
      !deliveryAddress.city ||
      !deliveryAddress.pincode ||
      !deliveryAddress.phone
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide complete delivery address"
      });
    }

    // 2. Fetch the logged-in user's cart
    const cart = await Cart.findOne({
      user: req.user._id
    }).populate("items.foodItem", "name image price isAvailable");

    // 3. Check whether cart exists and has items
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty"
      });
    }

    // 4. Prepare order items
    const orderItems = cart.items.map((item) => {
      if (!item.foodItem || !item.foodItem.isAvailable) {
        throw new Error("A food item in your cart is unavailable");
      }

      return {
        foodItem: item.foodItem._id,
        name: item.foodItem.name,
        price: item.price,
        quantity: item.quantity,
        image: item.foodItem.image
      };
    });

    // 5. Calculate total on the backend
    const totalPrice = orderItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    // 6. Create order in MongoDB
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      deliveryAddress,
      totalPrice,
      paymentMethod,
      notes: notes || ""
    });

    // 7. Clear cart after successful order creation
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    // 8. Send response
    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: order
    });

  } catch (error) {
    next(error);
  }
};



const getMyOrders = async (req, res, next) => {
  try {
   const orders = await Order.aggregate([
    {
        $match: {
            user: req.user._id
        }
    },
    {
        $addFields: {
            statusOrder: {
                $cond: [
                    { $eq: ["$status", "Delivered"] },
                    0,
                    1
                ]
            }
        }
    },
    {
        $sort: {
            statusOrder: 1,
            createdAt: -1
        }
    },
    {
        $project: {
            statusOrder: 0
        }
    }
]);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

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
