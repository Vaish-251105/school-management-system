import express from 'express';
import Timetable from '../models/Timetable.js';
import { roleProtect } from '../middleware/roleMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all timetables
router.get('/', async (req, res) => {
  try {
    const tts = await Timetable.find();
    res.json(tts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET timetable for specific class
router.get('/class/:id', async (req, res) => {
  try {
    const tts = await Timetable.find({ classId: req.params.id });
    res.json(tts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE/UPDATE (Admin/Teacher only)
router.post('/', [protect, roleProtect(['admin', 'teacher'])], async (req, res) => {
  const { classId, day, periods } = req.body;
  try {
    const tt = await Timetable.findOneAndUpdate(
      { classId, day },
      { periods },
      { upsert: true, new: true }
    );
    res.status(201).json(tt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
