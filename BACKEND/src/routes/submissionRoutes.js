import express from 'express';
import { submitHomework, getSubmissions, gradeSubmission } from '../controllers/submissionController.js';
import { protect, teacherOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', submitHomework);
router.get('/', getSubmissions);
router.put('/:id/grade', teacherOnly, gradeSubmission);

export default router;
