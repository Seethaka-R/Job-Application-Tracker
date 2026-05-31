/**
 * ============================================================
 * middleware/authMiddleware.js – JWT Authentication Guard
 * ============================================================
 * Extracts the Bearer token from the Authorization header,
 * verifies it with the JWT_SECRET, and attaches the decoded
 * user payload (userId, name, email) to `req.user`.
 *
 * Usage: add `protect` to any route that requires login.
 *   router.get("/dashboard", protect, dashboardHandler);
 * ============================================================
 */

import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  // ── 1. Read the Authorization header ──────────────────────
  const authHeader = req.headers.authorization;

  // Check that the header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed – no token provided",
    });
  }

  // ── 2. Extract the token (everything after "Bearer ") ─────
  const token = authHeader.split(" ")[1];

  try {
    // ── 3. Verify the token and decode its payload ────────────
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to the request object for downstream use
    // The payload was created in authController.js → generateToken()
    req.user = {
      userId: decoded.userId,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };

    next(); // Token is valid – proceed to the next middleware / route handler
  } catch (error) {
    // Token is expired, malformed, or signed with a different secret
    return res.status(401).json({
      success: false,
      message: "Authentication failed – invalid or expired token",
    });
  }
};

export default protect;
