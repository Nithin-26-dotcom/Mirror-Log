import { Router } from "express";
import {
  createPage,
  listMyPages,
  getPageById,
  updatePage,
  deletePage,
} from "../controllers/page.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, createPage);
router.get("/", verifyJWT, listMyPages);
router.get("/:pageId", verifyJWT, getPageById);
router.patch("/:pageId", verifyJWT, updatePage);
router.delete("/:pageId", verifyJWT, deletePage);

export default router;
