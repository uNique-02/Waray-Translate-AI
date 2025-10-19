import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const protectRoute = (req, res, next) => {
  if (!req.cookies.accessToken) {
    console.log("No access token in cookies");
  }
  // console.log("Cookies:", req.cookies);
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    // console.log("Decoded token:", decoded);

    try {
      const user = await User.findById(decoded.id).select("-password"); // optional: omit sensitive fields
      if (!user) {
        // console.log("Decoded token again:", decoded);
        return res.status(404).json({ message: "Auth User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  });
};

export const adminRoute = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden. Admin Accessonly." });
  }
  next();
};
