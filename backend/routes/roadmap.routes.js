import { Router } from "express";
import {
  createRoadmap,
  getRoadmapByPage,
  updateRoadmap,
  deleteRoadmap,
  addTodo,
  toggleTodo,
  deleteTodo,
} from "../controllers/roadmap.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, createRoadmap);
router.get("/:pageId", verifyJWT, getRoadmapByPage);
router.put("/:roadmapId", verifyJWT, updateRoadmap);
router.delete("/:roadmapId", verifyJWT, deleteRoadmap);

router.post("/:roadmapId/subheading/:subheadingIndex/todo", verifyJWT, addTodo);
router.patch("/todo/:todoId/toggle", verifyJWT, toggleTodo);
router.delete(
  "/:roadmapId/subheading/:subheadingIndex/todo/:todoId",
  verifyJWT,
  deleteTodo
);

export default router;
