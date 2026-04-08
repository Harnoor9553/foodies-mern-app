// =============================================
// middleware/errorMiddleware.js - Global Error Handler
// =============================================
// This is the LAST middleware in the chain.
// Any error passed via next(error) lands here.

// -------------------------------------------------------
// notFound: Handles routes that don't exist (404)
// -------------------------------------------------------
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error); // pass to errorHandler below
};

// -------------------------------------------------------
// errorHandler: Formats all errors into clean JSON responses
// -------------------------------------------------------
const errorHandler = (err, req, res, next) => {
  // Sometimes a 200 status slips through — force it to 500
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose: Invalid ObjectId (e.g., /api/food/abc instead of a real id)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found (invalid ID format)";
  }

  // Mongoose: Duplicate key error (e.g., email already registered)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists. Please use a different value.`;
  }

  // Mongoose: Validation error (e.g., missing required field)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only show stack trace in development (helps debugging)
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = { notFound, errorHandler };
