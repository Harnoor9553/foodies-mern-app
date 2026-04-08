// =============================================
// routes/cartRoutes.js
// =============================================
// Base path: /api/cart
// All cart routes require authentication

const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

// All routes below are protected
router.use(protect);

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:foodItemId", updateCartItem);
router.delete("/clear", clearCart);        // must come BEFORE /:foodItemId
router.delete("/:foodItemId", removeFromCart);

module.exports = router;
