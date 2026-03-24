import express from 'express';
import { markStaffAttendance, getStaffAttendance, getStaffAttendanceStats } from '../controllers/staffAttendanceController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/')
  .post(adminOnly, markStaffAttendance)
  .get(getStaffAttendance);

router.get('/stats', getStaffAttendanceStats);

export default router;
