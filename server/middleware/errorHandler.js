/**
 * ============================================================
 * middleware/errorHandler.js – Global Error Handler
 * ============================================================
 * Provides:
 *   1. `ApiError` – a custom error class that carries an HTTP
 *      status code so controllers can throw meaningful errors.
 *   2. `errorHandler` – Express error-handling middleware
 *      (4-argument signature) that catches all errors and
 *      returns a consistent JSON response.
 *
 * Usage in controllers:
 *   throw new ApiError("Job not found", 404);
 *
 * Mount in server.js (AFTER all routes):
 *   app.use(errorHandler);
 * ============================================================
 */

// ──────────────────────────────────────────────
// Custom Error Class
// ──────────────────────────────────────────────
class ApiError extends Error {
  /**
   * @param {string}  message    – Human-readable error description
   * @param {number}  statusCode – HTTP status code (e.g. 400, 404, 500)
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// ──────────────────────────────────────────────
// Error-Handling Middleware
// ──────────────────────────────────────────────
const errorHandler = (err, req, res, _next) => {
  // Start with defaults
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // ── Mongoose: bad ObjectId ────────────────────────────────
  if (err.name === "CastError") {
    statusCode = 404;
    message = `Resource not found (invalid id: ${err.value})`;
  }

  // ── Mongoose: duplicate key (e.g. email already exists) ──
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    statusCode = 400;
    message = `Duplicate value for field: ${field}. Please use another value.`;
  }

  // ── Mongoose: validation error ────────────────────────────
  if (err.name === "ValidationError") {
    statusCode = 400;
    // Combine all field-level messages into one string
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(". ");
  }

  // Log the full error in development for easier debugging
  if (process.env.NODE_ENV === "development") {
    console.error("🔴 Error:", err);
  }

  // Send the JSON response
  res.status(statusCode).json({
    success: false,
    message,
    // Include the stack trace only in development mode
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export { ApiError, errorHandler };
