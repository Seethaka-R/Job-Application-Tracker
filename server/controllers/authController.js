/**
 * ============================================================
 * controllers/authController.js – Authentication Handlers
 * ============================================================
 * Handles user registration, login, and "get current user".
 *
 * Endpoints served (mounted via routes/authRoutes.js):
 *   POST   /api/auth/register  → register
 *   POST   /api/auth/login     → login
 *   GET    /api/auth/me        → getMe  (protected)
 *
 * Each handler uses try-catch for async error handling and
 * delegates unexpected errors to the global error handler.
 * ============================================================
 */

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError } from "../middleware/errorHandler.js";

// ──────────────────────────────────────────────
// Helper: Generate a signed JWT
// ──────────────────────────────────────────────
/**
 * Creates a JWT containing the user's id, name, and email.
 * The token expires in 30 days.
 *
 * @param {Object} user – Mongoose user document
 * @returns {string} Signed JWT string
 */
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" } // Token valid for 30 days
  );
};

// ──────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ──────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError("A user with this email already exists", 400);
    }

    // Create the user (password is hashed automatically via pre-save hook)
    const user = await User.create({ name, email, password, role: role || "user" });

    // Generate a JWT for the newly registered user
    const token = generateToken(user);

    // Respond with 201 Created
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error); // Forward to global error handler
  }
};

// ──────────────────────────────────────────────
// @desc    Login an existing user
// @route   POST /api/auth/login
// @access  Public
// ──────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email and explicitly select the password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new ApiError("Invalid email or password", 401);
    }

    // Compare the provided password with the stored hash
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new ApiError("Invalid email or password", 401);
    }

    // Credentials are valid – issue a token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// @desc    Get currently logged-in user's profile
// @route   GET /api/auth/me
// @access  Protected (requires valid JWT)
// ──────────────────────────────────────────────
export const getMe = async (req, res, next) => {
  try {
    // req.user was attached by the authMiddleware (protect)
    const user = await User.findById(req.user.userId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        resume: user.resume,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// @desc    Upload a resume file for the current user
// @route   POST /api/auth/upload-resume
// @access  Protected
// ──────────────────────────────────────────────
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Save the file path relative to server root
    user.resume = req.file.path.replace(/\\/g, "/");
    await user.save();

    res.status(200).json({ success: true, message: "Resume uploaded", resume: user.resume });
  } catch (error) {
    next(error);
  }
};
