// =============================================
// routes/foodRoutes.js
// =============================================
// Base path: /api/food

const express = require("express");
const router = express.Router();
const {
  getAllFoodItems,
  getFoodItemById,
  addFoodItem,
  updateFoodItem,
  deleteFoodItem,
} = require("../controllers/foodController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllFoodItems);
router.get("/:id", getFoodItemById);

// Admin-only routes
router.post("/", protect, adminOnly, addFoodItem);
router.put("/:id", protect, adminOnly, updateFoodItem);
router.delete("/:id", protect, adminOnly, deleteFoodItem);

module.exports = router;
