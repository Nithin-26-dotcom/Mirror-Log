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

const router = Router();

router.post("/", createRoadmap);
router.get("/:pageId", getRoadmapByPage);
router.put("/:roadmapId", updateRoadmap);
router.delete("/:roadmapId", deleteRoadmap);

router.post("/:roadmapId/subheading/:subheadingIndex/todo", addTodo);
router.patch("/todo/:todoId/toggle", toggleTodo);
router.delete(
  "/:roadmapId/subheading/:subheadingIndex/todo/:todoId",
  deleteTodo
);

export default router;
