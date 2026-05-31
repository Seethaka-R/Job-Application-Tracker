import { Router } from "express";
import { createJobOffer, getJobOffers } from "../controllers/jobOfferController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.route("/")
  .get(protect, getJobOffers)
  .post(protect, createJobOffer);

export default router;
