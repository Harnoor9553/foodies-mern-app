// =============================================
// seed.js — Populate DB with Sample Data
// =============================================
// Run once to fill your database:
//   node seed.js
// To clear and re-seed:
//   node seed.js --fresh

require("dotenv").config();
const mongoose = require("mongoose");
const FoodItem = require("./models/FoodItem");
const User = require("./models/User");
const connectDB = require("./config/db");

const sampleFoods = [
  {
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with melted cheddar, lettuce, tomato, and our secret sauce",
    price: 199,
    category: "Burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
  },
  {
    name: "Margherita Pizza",
    description: "Fresh mozzarella, tomato sauce, and basil on a crispy thin crust",
    price: 299,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
  },
  {
    name: "Spaghetti Carbonara",
    description: "Creamy pasta with crispy pancetta, egg, and Parmesan cheese",
    price: 249,
    category: "Pasta",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400",
  },
  {
    name: "Caesar Salad",
    description: "Romaine lettuce, croutons, and Caesar dressing with Parmesan shavings",
    price: 179,
    category: "Salads",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
  },
  {
    name: "Mango Smoothie",
    description: "Fresh mango blended with yogurt and a touch of honey",
    price: 99,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400",
  },
  {
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a gooey molten center, served with vanilla ice cream",
    price: 149,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
  },
  {
    name: "Crispy Fries",
    description: "Golden-crisp french fries seasoned with sea salt and herbs",
    price: 89,
    category: "Sides",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400",
  },
  {
    name: "BBQ Chicken Burger",
    description: "Grilled chicken with smoky BBQ sauce, coleslaw, and pickles",
    price: 229,
    category: "Burgers",
    image: "https://images.unsplash.com/photo-1525164286253-04e68b9d94c6?w=400",
  },
];

const seedDB = async () => {
  await connectDB();

  try {
    // Clear existing food items
    await FoodItem.deleteMany({});
    console.log("🗑️  Cleared existing food items");

    // Insert sample food items
    const inserted = await FoodItem.insertMany(sampleFoods);
    console.log(`✅ Inserted ${inserted.length} food items`);

    // Create a sample admin user (only if not exists)
    const adminExists = await User.findOne({ email: "admin@food.com" });
    if (!adminExists) {
      await User.create({
        name: "Admin User",
        email: "admin@food.com",
        password: "admin123",
        role: "admin",
      });
      console.log("✅ Admin user created: admin@food.com / admin123");
    } else {
      console.log("ℹ️  Admin user already exists");
    }

    console.log("\n🎉 Database seeded successfully!\n");
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
