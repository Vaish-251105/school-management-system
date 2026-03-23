import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import * as teacherController from "../controllers/teacherController.js";

router.use(protect);

// Admin only can create/update/delete
router.post('/', roleMiddleware(['admin']), teacherController.createTeacher);
router.put('/:id', roleMiddleware(['admin']), teacherController.updateTeacher);
router.delete('/:id', roleMiddleware(['admin']), teacherController.deleteTeacher);

// Admin & Teacher can view
router.get('/', roleMiddleware(['admin', 'teacher']), teacherController.getTeachers);
router.get('/:id', roleMiddleware(['admin', 'teacher']), teacherController.getTeacherById);

export default router;
