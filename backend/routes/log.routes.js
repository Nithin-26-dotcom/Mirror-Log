import {
  createLog,
  listLogs,
  getLogById,
  updateLog,
  deleteLog,
} from "../controllers/log.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, createLog); // Create a new log
router.get("/", verifyJWT, listLogs); // Get all logs of the user
router.get("/:id", verifyJWT, getLogById); // Get a single log by ID
router.patch("/:id", verifyJWT, updateLog); // Update a log
router.delete("/:id", verifyJWT, deleteLog); // Delete a log

export default router;
