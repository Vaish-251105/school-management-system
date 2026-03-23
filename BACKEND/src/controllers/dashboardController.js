import asyncHandler from 'express-async-handler';
import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalStudents = await Student.countDocuments();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const presentCount = await Attendance.countDocuments({
    date: { $gte: startOfDay, $lte: endOfDay },
    status: { $regex: /present/i }
  });

  const absentCount = await Attendance.countDocuments({
    date: { $gte: startOfDay, $lte: endOfDay },
    status: { $regex: /absent/i }
  });

  res.status(200).json({
    success: true,
    totalStudents,
    present: presentCount,
    absent: absentCount,
    attendancePercentage:
      totalStudents > 0
        ? ((presentCount / totalStudents) * 100).toFixed(2)
        : 0
  });
});