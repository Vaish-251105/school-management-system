import asyncHandler from 'express-async-handler';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Fee from '../models/Fee.js';
import Notice from '../models/Notice.js';
import Attendance from '../models/Attendance.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const [
    totalStudents,
    totalTeachers,
    allFees,
    totalNotices,
    recentNotices,
    todayAttendance
  ] = await Promise.all([
    Student.countDocuments(),
    Teacher.countDocuments(),
    Fee.find({}),
    Notice.countDocuments(),
    Notice.find().sort({ createdAt: -1 }).limit(5),
    Attendance.find({
      date: { $gte: startOfToday, $lte: endOfToday }
    })
  ]);

  const totalFees = allFees.reduce((acc, fee) => acc + (fee.amount || 0), 0);
  const presentCount = todayAttendance.filter(a => /present/i.test(a.status)).length;
  const absentCount = todayAttendance.filter(a => /absent/i.test(a.status)).length;
  
  const attendancePercentage = totalStudents > 0 
    ? ((presentCount / totalStudents) * 100).toFixed(1) 
    : "0";

  res.status(200).json({
    success: true,
    totalStudents,
    studentsCount: totalStudents,
    teachersCount: totalTeachers,
    totalFees,
    noticesCount: totalNotices,
    attendancePercentage,
    recentNotices,
    present: presentCount,
    absent: absentCount
  });
});