/**
 * ============================================================
 * models/Job.js – Mongoose Schema & Model for Job Applications
 * ============================================================
 * Each job document belongs to a specific user (createdBy)
 * and tracks one job application through its lifecycle.
 *
 * Fields:
 *   • company         – company name (required)
 *   • position        – job title / position (required)
 *   • status          – current stage: Applied | Interview | Offer | Rejected
 *   • jobType         – employment type: Full-Time | Part-Time | Internship | Remote | Contract
 *   • jobLocation     – city / remote / hybrid info
 *   • applicationDate – when the application was submitted
 *   • interviewDate   – scheduled interview date (if any)
 *   • jobLink         – URL to the original job posting
 *   • notes           – free-text notes about the application
 *   • createdBy       – reference to the User who owns this job
 * ============================================================
 */

import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide a company name"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },

    position: {
      type: String,
      required: [true, "Please provide a position / job title"],
      trim: true,
      maxlength: [100, "Position cannot exceed 100 characters"],
    },

    status: {
      type: String,
      enum: {
        values: ["Applied", "Interview", "Offer", "Rejected"],
        message: "{VALUE} is not a supported status",
      },
      default: "Applied",
    },

    jobType: {
      type: String,
      enum: {
        values: ["Full-Time", "Part-Time", "Internship", "Remote", "Contract"],
        message: "{VALUE} is not a supported job type",
      },
      default: "Full-Time",
    },

    jobLocation: {
      type: String,
      trim: true,
      default: "Not specified",
      maxlength: [100, "Job location cannot exceed 100 characters"],
    },

    applicationDate: {
      type: Date,
      default: Date.now,
    },

    interviewDate: {
      type: Date,
    },

    jobLink: {
      type: String,
      trim: true,
      maxlength: [500, "Job link cannot exceed 500 characters"],
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },

    // ── Owner reference ──────────────────────────
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide the user who created this job"],
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
