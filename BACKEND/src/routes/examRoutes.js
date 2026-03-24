import express from "express";
const router = express.Router();
import { createExamResult, getStudentExamResults, getAllExams, getExamById, updateExamResult, deleteExamResult } from "../controllers/examController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/", protect, createExamResult);
router.get("/", protect, getAllExams);
router.get("/student/:studentId", protect, getStudentExamResults);
router.get("/:id", protect, getExamById);
router.put("/:id", protect, updateExamResult);
router.delete("/:id", protect, deleteExamResult);

export default router;
