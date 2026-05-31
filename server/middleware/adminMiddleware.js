import User from "../models/User.js";

const admin = async (req, res, next) => {
  try {
    // req.user must be set by protect middleware
    if (!req.user) return res.status(401).json({ success: false, message: "Not authenticated" });

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default admin;
