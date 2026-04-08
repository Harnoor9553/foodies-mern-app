// =============================================
// models/Review.js - Review/Testimonial Schema
// =============================================

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foodItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodItem",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// -------------------------------------------------------
// Prevent a user from reviewing the same item twice
// -------------------------------------------------------
reviewSchema.index({ user: 1, foodItem: 1 }, { unique: true });

// -------------------------------------------------------
// STATIC METHOD: Update food item's average rating
// -------------------------------------------------------
// Called after a new review is added or deleted
reviewSchema.statics.updateFoodRating = async function (foodItemId) {
  const FoodItem = require("./FoodItem");

  // Calculate average rating using MongoDB aggregation
  const result = await this.aggregate([
    { $match: { foodItem: foodItemId } },
    {
      $group: {
        _id: "$foodItem",
        avgRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await FoodItem.findByIdAndUpdate(foodItemId, {
      rating: Math.round(result[0].avgRating * 10) / 10,
      numReviews: result[0].numReviews,
    });
  } else {
    // No reviews left — reset rating
    await FoodItem.findByIdAndUpdate(foodItemId, { rating: 0, numReviews: 0 });
  }
};

// Auto-update rating after save
reviewSchema.post("save", function () {
  this.constructor.updateFoodRating(this.foodItem);
});

// Auto-update rating after delete
reviewSchema.post("remove", function () {
  this.constructor.updateFoodRating(this.foodItem);
});

module.exports = mongoose.model("Review", reviewSchema);
