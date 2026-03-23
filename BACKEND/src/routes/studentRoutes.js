import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { body, validationResult } from 'express-validator';
import * as studentController from "../controllers/studentController.js";

// 🔐 Protect all routes with authentication
router.use(protect);

// Only Admin can create student
router.post(
  '/',
  roleMiddleware(['admin']),

  body('userId').notEmpty().withMessage('UserId required'),
  body('class').notEmpty().withMessage('Class required'),
  body('section').notEmpty().withMessage('Section required'),
  body('rollNumber').isNumeric().withMessage('Roll number must be number'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },

  studentController.createStudent
);

// Admin & Teacher can view all students with query params for Day 6 features
// Example: /api/students?page=1&limit=5&search=101&sort=-createdAt
router.get('/', roleMiddleware(['admin', 'teacher']), studentController.getStudents);

// Everyone logged in can view student by ID
router.get('/:id', studentController.getStudentById);

// Only Admin can update student
router.put('/:id', roleMiddleware(['admin']), studentController.updateStudent);

// Only Admin can delete student
router.delete('/:id', roleMiddleware(['admin']), studentController.deleteStudent);



export default router;
