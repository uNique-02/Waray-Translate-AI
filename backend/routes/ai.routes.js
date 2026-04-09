import express from "express";
import { getResponse } from "../controllers/openrouter.controller.js";

const router = express.Router();

router.post("/", getResponse);

export default router;
