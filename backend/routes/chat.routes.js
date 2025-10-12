import express from "express";
import { getChats, createChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/", getUserChats);
router.post("/new", createChat);
