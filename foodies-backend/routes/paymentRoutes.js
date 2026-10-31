
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createPaymentOrder,
    verifyPayment
} = require("../controllers/paymentController");

// All payment routes require authentication
router.use(protect);

// Create Razorpay payment order
router.post("/create-order", createPaymentOrder);

// Verify Razorpay payment
router.post("/verify", verifyPayment);

module.exports = router;
