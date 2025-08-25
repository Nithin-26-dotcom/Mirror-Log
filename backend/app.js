// backend/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import pageRoutes from "./routes/page.routes.js";
import logRoutes from "./routes/log.routes.js";
import tagRoutes from "./routes/tag.routes.js";
import roadmapRoutes from "./routes/roadmap.routes.js";

const app = express();

// Middleware
app.use(cookieParser(process.env.COOKIE_SECRET || "defaultsecret"));
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/roadmaps", roadmapRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("MirrorLog Backend API is running 🚀");
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
});

export default app;
