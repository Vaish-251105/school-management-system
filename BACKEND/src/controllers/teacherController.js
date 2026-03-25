import Teacher from '../models/Teacher.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

export const createTeacher = asyncHandler(async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();
    res.status(201).json(teacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export const getTeachers = asyncHandler(async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate('userId', 'name email role');

    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const getStaff = asyncHandler(async (req, res) => {
  try {
    let teachers = await Teacher.find().populate('userId', 'name email role').lean();
    teachers = teachers.filter(t => t.userId);
    
    // Find all users that might be staff
    const staffUsers = await User.find({ role: { $in: ['admin', 'accountant', 'teacher'] } }).lean();
    
    const consolidated = staffUsers.map(u => {
      // Find if this user already has a teacher profile
      const t = teachers.find(teacher => teacher.userId?._id?.toString() === u._id.toString() || teacher.userId === u._id.toString());
      if (t) {
        return { ...t, userId: u }; // Merge full user details
      }
      return {
        userId: u,
        designation: u.role === 'admin' ? 'Super Admin' : (u.role === 'accountant' ? 'Financial Officer' : 'Staff'),
        department: u.role === 'admin' ? 'Administration' : 'General',
        _id: u._id,
        isUserOnly: true
      };
    });

    res.json(consolidated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const getTeacherById = asyncHandler(async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('userId', 'name email role');

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const updateTeacher = asyncHandler(async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(teacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export const deleteTeacher = asyncHandler(async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (teacher) {
      await User.findByIdAndDelete(teacher.userId);
      await Teacher.findByIdAndDelete(req.params.id);
    }
    res.json({ message: 'Teacher and User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const getRecipients = asyncHandler(async (req, res) => {
  const { role } = req.user;
  let users = [];

  if (role === 'student' || role === 'parent') {
    // Students/Parents see all teachers and staff
    users = await User.find({ role: { $in: ['teacher', 'admin', 'accountant'] } }, 'name email role');
  } else if (role === 'teacher') {
    // Teachers see all students, other teachers, and admins
    users = await User.find({ role: { $in: ['student', 'teacher', 'admin'] } }, 'name email role');
  } else if (role === 'admin' || role === 'accountant') {
    // Admins and Accountants see everyone
    users = await User.find({}, 'name email role');
  }

  res.json(users);
});
