import StaffAttendance from '../models/StaffAttendance.js';
import User from '../models/User.js';

export const markStaffAttendance = async (req, res) => {
  try {
    const { attendanceData, date } = req.body; // Array of { staffId, status }
    
    for (let log of attendanceData) {
      await StaffAttendance.findOneAndUpdate(
        { staffId: log.staffId, date: new Date(date) },
        { 
          status: log.status, 
          markedBy: req.user._id 
        },
        { upsert: true, new: true }
      );
    }
    
    res.status(200).json({ message: "Staff attendance marked successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStaffAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0,0,0,0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23,59,59,999);
      query = { date: { $gte: startOfDay, $lte: endOfDay } };
    }
    
    const logs = await StaffAttendance.find(query)
      .populate('staffId', 'name role email')
      .populate('markedBy', 'name');
      
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStaffAttendanceStats = async (req, res) => {
  try {
    const total = await User.countDocuments({ role: { $in: ['teacher', 'accountant', 'admin'] } });
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const present = await StaffAttendance.countDocuments({ 
      date: { $gte: today }, 
      status: 'Present' 
    });
    
    res.status(200).json({ total, present, absent: total - present });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
