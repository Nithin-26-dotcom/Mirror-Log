import { Router } from "express";
import {
  createPage,
  getPages,
  getPageById,
  deletePage,
} from "../controllers/page.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, createPage);
router.get("/", verifyJWT, getPages);
router.get("/:pageId", verifyJWT, getPageById);
router.delete("/:pageId", verifyJWT, deletePage);

export default router;
