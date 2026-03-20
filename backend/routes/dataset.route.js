import express from "express";
import { insertOne, insertBatch } from "../controllers/dataset.controller.js";

const router = express.Router();

// Dataset
router.post("/insert-one", insertOne);
router.post("/insert-batch", insertBatch);

export default router;
