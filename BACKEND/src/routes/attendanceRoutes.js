import express from "express";
const router = express.Router();
import { 
  markAttendance,
  getAttendance,
  bulkMarkAttendance,
 } from "../controllers/attendanceController.js";

import {  protect  } from "../middleware/authMiddleware.js";

// Mark attendance single
router.post("/", protect, markAttendance);

// Bulk mark attendance
router.post("/bulk", protect, bulkMarkAttendance);

// Get attendance (optional ?date=YYYY-MM-DD)
router.get("/", protect, getAttendance);

export default router;