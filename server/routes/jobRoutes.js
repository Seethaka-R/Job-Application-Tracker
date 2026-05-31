/**
 * ============================================================
 * routes/jobRoutes.js – Job Application Routes
 * ============================================================
 * Mounts under: /api/jobs
 *
 * ALL routes in this file are protected – the `protect`
 * middleware runs first on every request to verify the JWT.
 *
 * Routes:
 *   GET    /api/jobs          → getAllJobs (supports query params)
 *   POST   /api/jobs          → createJob
 *   GET    /api/jobs/stats    → getJobStats  ⚠️  BEFORE /:id
 *   GET    /api/jobs/:id      → getJob
 *   PATCH  /api/jobs/:id      → updateJob
 *   DELETE /api/jobs/:id      → deleteJob
 *
 * ⚠️  IMPORTANT: /stats is defined BEFORE /:id so Express
 *     does not treat "stats" as a MongoDB ObjectId parameter.
 * ============================================================
 */

import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";
import {
  getAllJobs,
  createJob,
  getJob,
  updateJob,
  deleteJob,
  getJobStats,
  adminUpdateStatus,
} from "../controllers/jobController.js";

const router = Router();

// ── Apply authentication to ALL job routes ──────────────────
router.use(protect);

// ── Collection-level routes ─────────────────────────────────
router.route("/").get(getAllJobs).post(createJob);

// ── Stats route – MUST come before /:id ─────────────────────
router.get("/stats", getJobStats);

// ── Single-resource routes ──────────────────────────────────
router.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);

// Admin-only: update status for any job
router.patch("/:id/status", admin, (req, res, next) => {
  // admin middleware assumes protect already ran and attached req.user
  return adminUpdateStatus(req, res, next);
});

export default router;
