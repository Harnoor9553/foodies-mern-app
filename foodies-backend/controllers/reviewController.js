// =============================================
// controllers/reviewController.js - Review Logic
// =============================================

const Review = require("../models/Review");
const FoodItem = require("../models/FoodItem");

// -------------------------------------------------------
// @desc    Get all reviews (for testimonials section)
// @route   GET /api/reviews
// @access  Public
// -------------------------------------------------------
const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({})
      .populate("user", "name")
      .populate("foodItem", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Get all reviews for a specific food item
// @route   GET /api/reviews/food/:foodItemId
// @access  Public
// -------------------------------------------------------
const getFoodItemReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ foodItem: req.params.foodItemId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
// -------------------------------------------------------
const addReview = async (req, res, next) => {
  try {
    const { foodItemId, rating, comment } = req.body;

    if (!foodItemId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide foodItemId, rating, and comment",
      });
    }

    // Check food item exists
    const foodItem = await FoodItem.findById(foodItemId);
    if (!foodItem) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    // Check for duplicate (one review per user per food item)
    const existingReview = await Review.findOne({
      user: req.user._id,
      foodItem: foodItemId,
    });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this item",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      foodItem: foodItemId,
      rating,
      comment,
    });

    const populatedReview = await Review.findById(review._id).populate("user", "name");

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Delete a review (owner or admin)
// @route   DELETE /api/reviews/:id
// @access  Private
// -------------------------------------------------------
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await review.remove();

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllReviews, getFoodItemReviews, addReview, deleteReview };
