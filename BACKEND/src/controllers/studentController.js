import Student from '../models/Student.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

import bcrypt from 'bcryptjs';

// Create student
export const createStudent = async (req, res) => {
  try {
    let { userId, name, email, password, class: studentClass, section, rollNumber } = req.body;

    if (!studentClass || !section || !rollNumber) {
      return res.status(400).json({ message: "Class, Section, and Roll Number are required" });
    }

    // If no userId but email is provided, create a new User first
    if (!userId && email) {
       const existingUser = await User.findOne({ email });
       if (existingUser) {
         userId = existingUser._id;
       } else {
         const hashedPassword = await bcrypt.hash(password || '123', 10);
         const newUser = await User.create({
           name: name || email.split('@')[0],
           email,
           password: hashedPassword,
           role: 'student'
         });
         userId = newUser._id;
       }
    }

    if (!userId) {
       return res.status(400).json({ message: "User ID or Email is required to create a student" });
    }

    const student = await Student.create({
      userId,
      class: studentClass,
      section,
      rollNumber
    });

    const populated = await Student.findById(student._id).populate('userId', 'name email role');
    res.status(201).json(populated);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all students with pagination, search, filter, sort
export const getStudents = asyncHandler(async (req, res) => {
  try {
    let { page, limit, search, sort, role } = req.query;

    // Default values
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // Search by rollNumber, section, or user info (name/email)
    if (search) {
      // In a real app with many users, you'd might need to find user IDs first if searching by name
      query.$or = [
        { section: { $regex: search, $options: "i" } },
      ];
      // If rollNumber is numeric, we might need to handle it differently.
      if (!isNaN(search)) {
        query.$or.push({ rollNumber: search });
      }
    }

    // Count total documents
    const totalStudents = await Student.countDocuments(query);

    // Fetch students with pagination and populate user info
    let studentsQuery = Student.find(query)
      .populate('userId', 'name email role')
      .skip(skip)
      .limit(limit);

    // Sorting
    if (sort) {
      studentsQuery = studentsQuery.sort(sort); // e.g., sort=-createdAt
    } else {
      studentsQuery = studentsQuery.sort({ createdAt: -1 });
    }

    const students = await studentsQuery;

    res.json({
      totalStudents,
      currentPage: page,
      totalPages: Math.ceil(totalStudents / limit),
      students
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student by ID
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('userId', 'name email role');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Restrict access if logged-in user is student
    if (req.user.role === 'student') {
      if (student.userId._id.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('userId', 'name email role');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
