/**
 * ============================================================
 * server.js – Express Application Entry Point
 * ============================================================
 * This file:
 *   1. Loads environment variables from .env
 *   2. Connects to MongoDB
 *   3. Configures middleware (CORS, JSON parser, logger)
 *   4. Mounts route handlers
 *   5. Registers the global error handler
 *   6. Starts the HTTP server
 *
 * Run:
 *   npm start        – production
 *   npm run dev      – development (auto-restart on changes)
 * ============================================================
 */

// ── 1. Load environment variables FIRST ─────────────────────
import dotenv from "dotenv";
dotenv.config();

// ── 2. Core imports ─────────────────────────────────────────
import express from "express";
import cors from "cors";
import morgan from "morgan";

// ── 3. Internal imports ─────────────────────────────────────
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

// ── 4. Initialise Express app ───────────────────────────────
const app = express();

// ── 5. Global Middleware ────────────────────────────────────

// Enable Cross-Origin Resource Sharing so the frontend (on a
// different port or domain) can talk to this API.
app.use(cors());

// Parse incoming JSON request bodies (e.g. POST / PATCH data)
app.use(express.json());

// HTTP request logger – "dev" format gives concise colored output
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ── 6. Health-check / root route ────────────────────────────
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Job Application Tracker API is running",
  });
});

// ── 7. Mount Routes ─────────────────────────────────────────
app.use("/api/auth", authRoutes); // Authentication endpoints
app.use("/api/jobs", jobRoutes); // Job CRUD & stats endpoints

// ── 8. 404 handler for unknown routes ───────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found – check the URL and HTTP method",
  });
});

// ── 9. Global Error Handler (must be LAST middleware) ───────
app.use(errorHandler);

// ── 10. Start Server ────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB before accepting requests
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
