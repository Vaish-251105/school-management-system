import express from "express";
const router = express.Router();
import { 
  createExamResult, getStudentExamResults, getAllExams, getExamById, updateExamResult, deleteExamResult,
  createExam, getExams 
} from "../controllers/examController.js";
import { protect, teacherOnly } from "../middleware/authMiddleware.js";

router.post("/", protect, createExamResult);
router.get("/all", protect, getAllExams); // Re-named
router.get("/results", protect, getStudentExamResults);
router.get("/my-results", protect, getStudentExamResults);
router.get("/student/:studentId", protect, getStudentExamResults);

// EXAM SCHEDULING
router.route("/schedule")
  .post(protect, teacherOnly, createExam)
  .get(protect, getExams);

router.get("/:id", protect, getExamById);
router.put("/:id", protect, updateExamResult);
router.delete("/:id", protect, deleteExamResult);

export default router;
