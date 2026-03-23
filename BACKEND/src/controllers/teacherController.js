import Teacher from '../models/Teacher.js';
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
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: 'Teacher deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
