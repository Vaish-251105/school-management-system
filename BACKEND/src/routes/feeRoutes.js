import express from "express";
const router = express.Router();
import { createFee, getStudentFees, payFee } from "../controllers/feeController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/", protect, createFee);
router.get("/", protect, getStudentFees);
router.get("/:studentId", protect, getStudentFees);
router.post("/pay/:id", protect, payFee);

export default router;
