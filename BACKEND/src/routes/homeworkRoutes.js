import express from "express";
const router = express.Router();
import { createHomework, getAllHomework, getHomeworkById, updateHomework, deleteHomework } from "../controllers/homeworkController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/", protect, createHomework);
router.get("/", protect, getAllHomework);
router.get("/:id", protect, getHomeworkById);
router.put("/:id", protect, updateHomework);
router.delete("/:id", protect, deleteHomework);

export default router;
