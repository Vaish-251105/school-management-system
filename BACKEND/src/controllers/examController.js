import ExamResult from '../models/ExamResult.js';
import Exam from '../models/Exam.js';

export const createExamResult = async (req, res, next) => {
  try {
    const result = await ExamResult.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getStudentExamResults = async (req, res, next) => {
  try {
    const studentId = req.params.studentId || req.user._id;
    const results = await ExamResult.find({ studentId }).sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    next(error);
  }
};

export const getAllExams = async (req, res, next) => {
  try {
    const { studentId, examName } = req.query;
    let filter = {};
    if (studentId) filter.studentId = studentId;
    if (examName) filter.examName = { $regex: examName, $options: 'i' };
    
    const results = await ExamResult.find(filter).sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    next(error);
  }
};

export const getExamById = async (req, res, next) => {
  try {
    const result = await ExamResult.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Exam result not found' });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateExamResult = async (req, res, next) => {
  try {
    const result = await ExamResult.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!result) {
      return res.status(404).json({ message: 'Exam result not found' });
    }
    res.json({ message: 'Exam result updated successfully', result });
  } catch (error) {
    next(error);
  }
};

export const deleteExamResult = async (req, res, next) => {
  try {
    const result = await ExamResult.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Exam result not found' });
    }
    res.json({ message: 'Exam result deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// EXAM SCHEDULING
export const createExam = async (req, res, next) => {
  try {
    const exam = await Exam.create({ ...req.body, teacherId: req.user._id });
    res.status(201).json(exam);
  } catch (error) {
    next(error);
  }
};

export const getExams = async (req, res, next) => {
  try {
    const { className } = req.query;
    let filter = {};
    if (className) filter.class = className;
    const exams = await Exam.find(filter).populate('teacherId', 'name');
    res.json(exams);
  } catch (error) {
    next(error);
  }
};
