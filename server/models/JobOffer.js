import mongoose from "mongoose";

const jobOfferSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide a company name"],
      trim: true,
      maxlength: 100,
    },
    position: {
      type: String,
      required: [true, "Please provide a position / job title"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Please provide a job description"],
    },
    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Remote", "Contract"],
      default: "Full-Time",
    },
    location: {
      type: String,
      default: "Not specified",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("JobOffer", jobOfferSchema);
