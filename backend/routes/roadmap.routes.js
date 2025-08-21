import { Router } from "express";
import {
  createRoadmap,
  getRoadmapByPage,
  updateRoadmap,
} from "../controllers/roadmap.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/:pageId", verifyJWT, createRoadmap);
router.get("/:pageId", verifyJWT, getRoadmapByPage);
router.put("/:pageId", verifyJWT, updateRoadmap);

export default router;
