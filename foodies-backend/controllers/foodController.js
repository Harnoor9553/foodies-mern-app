// =============================================
// controllers/foodController.js - Food Items Logic
// =============================================

const FoodItem = require("../models/FoodItem");

// -------------------------------------------------------
// @desc    Get all food items (with optional filters)
// @route   GET /api/food
// @access  Public
// -------------------------------------------------------
const getAllFoodItems = async (req, res, next) => {
  try {
    // Filtering: GET /api/food?category=Pizza
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    // Only show available items to public
    filter.isAvailable = true;

    const foodItems = await FoodItem.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foodItems.length,
      data: foodItems,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Get single food item by ID
// @route   GET /api/food/:id
// @access  Public
// -------------------------------------------------------
const getFoodItemById = async (req, res, next) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);

    if (!foodItem) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    res.status(200).json({ success: true, data: foodItem });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Add new food item (ADMIN only)
// @route   POST /api/food
// @access  Private/Admin
// -------------------------------------------------------
const addFoodItem = async (req, res, next) => {
  try {
    const { name, description, price, category, image } = req.body;

    const foodItem = await FoodItem.create({
      name,
      description,
      price,
      category,
      image: image || "default-food.jpg",
    });

    res.status(201).json({
      success: true,
      message: "Food item added successfully",
      data: foodItem,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Update food item (ADMIN only)
// @route   PUT /api/food/:id
// @access  Private/Admin
// -------------------------------------------------------
const updateFoodItem = async (req, res, next) => {
  try {
    const foodItem = await FoodItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!foodItem) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Food item updated",
      data: foodItem,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Delete food item (ADMIN only)
// @route   DELETE /api/food/:id
// @access  Private/Admin
// -------------------------------------------------------
const deleteFoodItem = async (req, res, next) => {
  try {
    const foodItem = await FoodItem.findByIdAndDelete(req.params.id);

    if (!foodItem) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Food item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFoodItems,
  getFoodItemById,
  addFoodItem,
  updateFoodItem,
  deleteFoodItem,
};
