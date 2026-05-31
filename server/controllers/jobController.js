/**
 * ============================================================
 * controllers/jobController.js – Job CRUD & Stats Handlers
 * ============================================================
 * All operations are scoped to the authenticated user
 * (req.user.userId) so users can only access their own jobs.
 *
 * Endpoints served (mounted via routes/jobRoutes.js):
 *   GET    /api/jobs         → getAllJobs  (search, filter, sort, paginate)
 *   POST   /api/jobs         → createJob
 *   GET    /api/jobs/stats   → getJobStats (aggregation pipeline)
 *   GET    /api/jobs/:id     → getJob
 *   PATCH  /api/jobs/:id     → updateJob
 *   DELETE /api/jobs/:id     → deleteJob
 * ============================================================
 */

import mongoose from "mongoose";
import Job from "../models/Job.js";
import { ApiError } from "../middleware/errorHandler.js";

// ──────────────────────────────────────────────
// @desc    Get all jobs for the logged-in user
// @route   GET /api/jobs
// @access  Protected
// @query   search, status, jobType, sort, page, limit
// ──────────────────────────────────────────────
export const getAllJobs = async (req, res, next) => {
  try {
    // ── Base filter: only this user's jobs ───────────────────
    const queryObject = { createdBy: req.user.userId };

    // ── Search: match company OR position (case-insensitive) ─
    const { search, status, jobType, sort, page, limit } = req.query;

    if (search) {
      queryObject.$or = [
        { company: { $regex: search, $options: "i" } },
        { position: { $regex: search, $options: "i" } },
      ];
    }

    // ── Filter by status ────────────────────────────────────
    if (status && status !== "all") {
      queryObject.status = status;
    }

    // ── Filter by jobType ───────────────────────────────────
    if (jobType && jobType !== "all") {
      queryObject.jobType = jobType;
    }

    // ── Build the Mongoose query ────────────────────────────
    let queryBuilder = Job.find(queryObject);

    // ── Sort ────────────────────────────────────────────────
    // Supported sort values: "latest", "oldest", "a-z", "z-a"
    // Default: latest (newest first)
    const sortOptions = {
      latest: "-createdAt",
      oldest: "createdAt",
      "a-z": "position",
      "z-a": "-position",
    };
    const sortKey = sortOptions[sort] || "-createdAt";
    queryBuilder = queryBuilder.sort(sortKey);

    // ── Pagination ──────────────────────────────────────────
    const pageNum = Math.max(Number(page) || 1, 1); // minimum page 1
    const limitNum = Math.max(Number(limit) || 10, 1); // minimum 1 per page
    const skip = (pageNum - 1) * limitNum;

    queryBuilder = queryBuilder.skip(skip).limit(limitNum);

    // ── Execute query + count total matching documents ──────
    const [jobs, totalJobs] = await Promise.all([
      queryBuilder,
      Job.countDocuments(queryObject),
    ]);

    const numOfPages = Math.ceil(totalJobs / limitNum);

    res.status(200).json({
      success: true,
      totalJobs,
      numOfPages,
      currentPage: pageNum,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// @desc    Create a new job application
// @route   POST /api/jobs
// @access  Protected
// ──────────────────────────────────────────────
export const createJob = async (req, res, next) => {
  try {
    // Attach the authenticated user's id as the owner
    req.body.createdBy = req.user.userId;

    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// @desc    Get a single job by ID
// @route   GET /api/jobs/:id
// @access  Protected
// ──────────────────────────────────────────────
export const getJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Job.findOne({ _id: id, createdBy: req.user.userId });

    if (!job) {
      throw new ApiError(`No job found with id: ${id}`, 404);
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// @desc    Update a job application
// @route   PATCH /api/jobs/:id
// @access  Protected
// ──────────────────────────────────────────────
export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the job that belongs to this user and update it
    const job = await Job.findOneAndUpdate(
      { _id: id, createdBy: req.user.userId },
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Re-run schema validations on update
      }
    );

    if (!job) {
      throw new ApiError(`No job found with id: ${id}`, 404);
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// @desc    Delete a job application
// @route   DELETE /api/jobs/:id
// @access  Protected
// ──────────────────────────────────────────────
export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Job.findOneAndDelete({
      _id: id,
      createdBy: req.user.userId,
    });

    if (!job) {
      throw new ApiError(`No job found with id: ${id}`, 404);
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// @desc    Get aggregated job statistics for the user
// @route   GET /api/jobs/stats
// @access  Protected
// ──────────────────────────────────────────────
export const getJobStats = async (req, res, next) => {
  try {
    /*
     * Aggregation pipeline:
     * 1. $match  – filter to only this user's jobs
     * 2. $group  – group by status and count each group
     *
     * Example output of the pipeline:
     *   [ { _id: "Applied", count: 12 }, { _id: "Interview", count: 3 }, ... ]
     *
     * We then reshape it into a friendlier object:
     *   { Applied: 12, Interview: 3, Offer: 1, Rejected: 5 }
     */
    const stats = await Job.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.user.userId),
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert the array of { _id, count } into a single object
    const statsObject = stats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    // Ensure every status key is present (default to 0)
    const defaultStats = {
      Applied: statsObject.Applied || 0,
      Interview: statsObject.Interview || 0,
      Offer: statsObject.Offer || 0,
      Rejected: statsObject.Rejected || 0,
    };

    res.status(200).json({
      success: true,
      stats: defaultStats,
      totalApplications:
        defaultStats.Applied +
        defaultStats.Interview +
        defaultStats.Offer +
        defaultStats.Rejected,
    });
  } catch (error) {
    next(error);
  }
};
