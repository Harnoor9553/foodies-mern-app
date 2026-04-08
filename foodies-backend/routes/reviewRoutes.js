// =============================================
// routes/reviewRoutes.js
// =============================================
// Base path: /api/reviews

const express = require("express");
const router = express.Router();
const {
  getAllReviews,
  getFoodItemReviews,
  addReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

// Public
router.get("/", getAllReviews);
router.get("/food/:foodItemId", getFoodItemReviews);

// Private
router.post("/", protect, addReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;
