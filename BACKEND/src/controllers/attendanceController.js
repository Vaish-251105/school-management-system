import Attendance from '../models/Attendance.js';

/* ================================
   MARK ATTENDANCE
================================ */
export const markAttendance = async (req, res, next) => {
  try {
    const { studentId, date, status } = req.body;

    if (!studentId || !status) {
      return res.status(400).json({
        message: "studentId and status are required",
      });
    }

    const attendanceDate = date ? new Date(date) : new Date();

    if (isNaN(attendanceDate)) {
      return res.status(400).json({
        message: "Invalid date format. Use YYYY-MM-DD",
      });
    }

    attendanceDate.setHours(0, 0, 0, 0);

    const attendance = await Attendance.create({
      studentId,
      date: attendanceDate,
      status,
      markedBy: req.user._id,
    });

    res.status(201).json({
      message: "Attendance marked successfully ✅",
      attendance,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Attendance already marked for this student on this date",
      });
    }
    next(error);
  }
};

/* ================================
   GET ATTENDANCE (OPTIONAL DATE FILTER)
================================ */
export const getAttendance = async (req, res, next) => {
  try {
    const { date } = req.query;

    let filter = {};

    if (date) {
      const parsedDate = new Date(date);

      if (isNaN(parsedDate)) {
        return res.status(400).json({
          message: "Invalid date format. Use YYYY-MM-DD",
        });
      }

      const start = new Date(parsedDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(parsedDate);
      end.setHours(23, 59, 59, 999);

      filter.date = { $gte: start, $lte: end };
    }

    const records = await Attendance.find(filter)
      .populate("studentId")
      .populate("markedBy", "name role")
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    next(error);
  }
};

/* ================================
   BULK MARK ATTENDANCE
================================ */
export const bulkMarkAttendance = async (req, res, next) => {
  try {
    const { attendanceData, date } = req.body; // attendanceData: [{ studentId, status }]

    if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
      return res.status(400).json({
        message: "attendanceData array is required",
      });
    }

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const results = [];
    for (const record of attendanceData) {
      try {
        const entry = await Attendance.findOneAndUpdate(
          { studentId: record.studentId, date: attendanceDate },
          { 
            status: record.status, 
            markedBy: req.user._id 
          },
          { upsert: true, new: true }
        );
        results.push(entry);
      } catch (err) {
        console.error(`Error marking attendance for ${record.studentId}:`, err);
      }
    }

    res.status(200).json({
      message: `Successfully marked ${results.length} records ✅`,
      results,
    });
  } catch (error) {
    next(error);
  }
};
