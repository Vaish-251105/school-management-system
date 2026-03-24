import express from 'express';
const router = express.Router();
import Class from '../models/Class.js';
import { protect } from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

router.use(protect);

router.get('/', async (req, res) => {
  const classes = await Class.find();
  res.json(classes);
});

router.post('/', roleMiddleware(['admin']), async (req, res) => {
  try {
    const newClass = await Class.create(req.body);
    res.status(201).json(newClass);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/:id', roleMiddleware(['admin']), async (req, res) => {
  await Class.findByIdAndDelete(req.params.id);
  res.json({ message: "Class deleted" });
});

export default router;
