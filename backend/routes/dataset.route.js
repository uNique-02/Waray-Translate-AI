import express from "express";
import { insertOne, insertBatch } from "../controllers/dataset.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { verifyOriginOrReferer } from "../middleware/originCheck.middleware.js";

const router = express.Router();

// Dataset
router.post(
  "/insert-one",
  verifyOriginOrReferer,
  protectRoute,
  adminRoute,
  insertOne,
);
router.post(
  "/insert-batch",
  verifyOriginOrReferer,
  protectRoute,
  adminRoute,
  insertBatch,
);

export default router;
