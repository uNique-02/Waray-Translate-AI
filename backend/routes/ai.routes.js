import express from "express";
import { getResponse } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/", getResponse);

export default router;
