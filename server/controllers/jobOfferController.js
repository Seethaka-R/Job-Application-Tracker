import JobOffer from "../models/JobOffer.js";

export const createJobOffer = async (req, res, next) => {
  try {
    if (req.user.role !== "hr" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to post jobs" });
    }
    req.body.createdBy = req.user.userId;
    const jobOffer = await JobOffer.create(req.body);
    res.status(201).json({ success: true, jobOffer });
  } catch (error) {
    next(error);
  }
};

export const getJobOffers = async (req, res, next) => {
  try {
    const jobOffers = await JobOffer.find().sort("-createdAt");
    res.status(200).json({ success: true, jobOffers });
  } catch (error) {
    next(error);
  }
};
