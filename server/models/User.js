/**
 * ============================================================
 * models/User.js – Mongoose Schema & Model for Users
 * ============================================================
 * Fields:
 *   • name     – user's display name (required)
 *   • email    – unique email address (required, lowercase)
 *   • password – hashed password (required, min 6 chars)
 *
 * Features:
 *   • Pre-save hook automatically hashes the password with
 *     bcryptjs (10 salt rounds) whenever it is new or modified.
 *   • Instance method `matchPassword` compares a plain-text
 *     candidate against the stored hash.
 *   • The password field is excluded from JSON output by
 *     default for security.
 * ============================================================
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Excluded from queries by default
    },
    // Role: 'user', 'hr', or 'admin' — default is regular user
    role: {
      type: String,
      enum: ["user", "hr", "admin"],
      default: "user",
    },

    // Resume file path stored on the server filesystem (optional)
    resume: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// ──────────────────────────────────────────────
// PRE-SAVE HOOK – Hash password before saving
// ──────────────────────────────────────────────
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  // Generate a salt with 10 rounds and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ──────────────────────────────────────────────
// INSTANCE METHOD – Compare candidate password
// ──────────────────────────────────────────────
userSchema.methods.matchPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
