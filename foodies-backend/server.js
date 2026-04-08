// =============================================
// server.js - Main Entry Point
// =============================================
// This is the heart of your backend.
// It sets up Express, connects to MongoDB, 
// registers all routes, and starts the server.

// Load environment variables from .env file FIRST
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// --- Import all route files ---
const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");

// -------------------------------------------------------
// Connect to MongoDB
// -------------------------------------------------------
connectDB();

// -------------------------------------------------------
// Initialize Express App
// -------------------------------------------------------
const app = express();

// -------------------------------------------------------
// MIDDLEWARE (applied to every request)
// -------------------------------------------------------

// CORS: Allow requests from your frontend origin
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://127.0.0.1:5500",
    credentials: true, // allows cookies if you use them later
  })
);

// Parse incoming JSON request bodies (req.body)
app.use(express.json());

// Parse URL-encoded form data (like from HTML forms)
app.use(express.urlencoded({ extended: true }));

// -------------------------------------------------------
// Health Check Route — test if server is running
// -------------------------------------------------------
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🍔 Food Ordering API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      food: "/api/food",
      cart: "/api/cart",
      orders: "/api/orders",
      reviews: "/api/reviews",
      newsletter: "/api/newsletter",
    },
  });
});

// -------------------------------------------------------
// ROUTES — mount each router at its base path
// -------------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/newsletter", newsletterRoutes);

// -------------------------------------------------------
// ERROR HANDLING MIDDLEWARE (must be LAST)
// -------------------------------------------------------
app.use(notFound);      // handles 404 — unknown routes
app.use(errorHandler);  // handles all other errors

// -------------------------------------------------------
// START THE SERVER
// -------------------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📡 API available at: http://localhost:${PORT}`);
  console.log(`🌐 Frontend URL allowed: ${process.env.FRONTEND_URL}\n`);
});
