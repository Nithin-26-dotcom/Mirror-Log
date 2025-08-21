import {
  getMe,
  updateMe,
  deleteMe,
  adminListUsers,
} from "../controllers/user.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.get("/:id", verifyJWT, getMe);
router.get("/", verifyJWT, adminListUsers);
router.put("/:id", verifyJWT, updateMe);
// router.put("/replace/:id", verifyJWT, replaceUser);
router.delete("/:id", verifyJWT, deleteMe);
export default router;
