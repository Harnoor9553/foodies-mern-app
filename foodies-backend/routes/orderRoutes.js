// =============================================
// routes/orderRoutes.js
// =============================================
// Base path: /api/orders

const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// All routes REQUIRE login
router.use(protect);

// User routes
router.post("/", placeOrder);
router.get("/", getMyOrders);
router.get("/:id", getOrderById);
router.put("/:id/cancel", cancelOrder);

// Admin routes
//router.get("/admin/all", adminOnly, getAllOrders);
//router.put("/:id/status", adminOnly, updateOrderStatus);

module.exports = router;
