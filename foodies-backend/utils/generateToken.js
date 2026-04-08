// =============================================
// utils/generateToken.js - JWT Token Generator
// =============================================
// A utility function to create a signed JWT token.
// We call this after login and registration.

const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },               // payload: what we store inside the token
    process.env.JWT_SECRET,        // secret key to sign the token
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } // token expires in 7 days
  );
};

module.exports = generateToken;
