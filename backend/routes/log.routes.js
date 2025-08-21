import { Router } from "express";
import {
  createLog,
  listLogs,
  updateLog,
  deleteLog,
} from "../controllers/log.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/:pageId", verifyJWT, createLog);
router.get("/:pageId", verifyJWT, getLogsByPage);
router.get("/:pageId/filter", verifyJWT, filterLogs);

export default router;
