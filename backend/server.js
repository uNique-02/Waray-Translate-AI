import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectToMongoDB from "./lib/connectToMongoDB.js";
import aiRoutes from "./routes/ai.routes.js";
import authRoutes from "./routes/auth.route.js";
import chatRoutes from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";
import datasetRoutes from "./routes/dataset.route.js";

import path from "path";
import { fileURLToPath } from "url";

import { createClient } from "@supabase/supabase-js";

// Fix __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.set("trust proxy", 1);
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/dataset", datasetRoutes);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from("waray_dataset")
      .select("id")
      .limit(1);

    if (error) {
      console.error("❌ Supabase connection failed:", error.message);
    } else {
      console.log("✅ Supabase connected successfully");
    }
  } catch (err) {
    console.error("❌ Supabase connection error:", err.message);
  }
}

testSupabaseConnection();

// Production: serve frontend
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "..", "frontend", "dist");

  app.use(express.static(frontendDistPath));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

//Solution: https://stackoverflow.com/questions/79553495/throw-new-typeerrormissing-parameter-name-at-i-debug-url

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  connectToMongoDB();
});
