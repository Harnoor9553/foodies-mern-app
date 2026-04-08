// =============================================
// middleware/authMiddleware.js - JWT Auth Middleware
// =============================================
// This middleware PROTECTS routes.
// It checks if the incoming request has a valid JWT token.
// If valid → allow access. If not → return 401 Unauthorized.

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// -------------------------------------------------------
// protect: Verifies JWT and attaches user to req.user
// -------------------------------------------------------
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with "Bearer"
  // Example header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by id stored in the token (excluding password field)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      next(); // token is valid → move to next middleware/route handler
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Token failed or expired.",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. No token provided.",
    });
  }
};

// -------------------------------------------------------
// adminOnly: Restricts route to admin users only
// -------------------------------------------------------
// Usage: router.delete('/food/:id', protect, adminOnly, deleteFood)
// protect must run first to attach req.user
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }
};

module.exports = { protect, adminOnly };
