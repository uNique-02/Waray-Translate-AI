import express from "express";
// import { getResponse } from "../controllers/ai-fireworks.controller.js";
// import { getResponse } from "../controllers/ai-huggingFace.controller.js";
// import { getResponse } from "../controllers/ai.controller.js";
import { getResponse } from "../controllers/openrouter.controller.js";

const router = express.Router();

router.post("/", getResponse);

export default router;
