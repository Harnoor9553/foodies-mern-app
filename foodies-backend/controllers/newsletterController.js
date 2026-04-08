// =============================================
// controllers/newsletterController.js
// =============================================

const Subscriber = require("../models/Subscriber");

// -------------------------------------------------------
// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
// -------------------------------------------------------
const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Check for duplicate
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This email is already subscribed!",
      });
    }

    await Subscriber.create({ email });

    res.status(201).json({
      success: true,
      message: "Thank you for subscribing! 🎉",
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Get all subscribers (ADMIN only)
// @route   GET /api/newsletter/subscribers
// @access  Private/Admin
// -------------------------------------------------------
const getAllSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { subscribe, getAllSubscribers };
