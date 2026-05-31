/**
 * ============================================================
 * routes/authRoutes.js – Authentication Routes
 * ============================================================
 * Mounts under: /api/auth
 *
 * Routes:
 *   POST  /api/auth/register  – Create a new account
 *   POST  /api/auth/login     – Authenticate & receive JWT
 *   GET   /api/auth/me        – Get current user (protected)
 *
 * Validation is handled by express-validator before the
 * controller runs, keeping controllers clean and focused.
 * ============================================================
 */

import { Router } from "express";
import { body, validationResult } from "express-validator";
import { register, login, getMe, uploadResume } from "../controllers/authController.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import protect from "../middleware/authMiddleware.js";

const router = Router();

// ──────────────────────────────────────────────
// Helper middleware: check for validation errors
// ──────────────────────────────────────────────
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return 400 with an array of validation messages
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

// ──────────────────────────────────────────────
// POST /api/auth/register
// ──────────────────────────────────────────────
router.post(
  "/register",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: 50 })
      .withMessage("Name cannot exceed 50 characters"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please provide a valid email address")
      .normalizeEmail(),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role").optional().isIn(["user", "hr", "admin"]).withMessage("Invalid role"),
  ],
  validate,
  register
);

// ──────────────────────────────────────────────
// POST /api/auth/login
// ──────────────────────────────────────────────
router.post(
  "/login",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please provide a valid email address")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

// ──────────────────────────────────────────────
// GET /api/auth/me  (protected – requires JWT)
// ──────────────────────────────────────────────
router.get("/me", protect, getMe);

// ──────────────────────────────────────────────
// POST /api/auth/upload-resume  (protected)
// Accepts a single file field named `resume` (PDF or DOC/DOCX)
// ──────────────────────────────────────────────
const uploadsDir = path.join(process.cwd(), "uploads", "resumes");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user ? req.user.userId : Date.now()}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [".pdf", ".doc", ".docx"];
  if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
  else cb(new Error("Only PDF/DOC/DOCX files are allowed"), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/upload-resume", protect, upload.single("resume"), uploadResume);

export default router;
