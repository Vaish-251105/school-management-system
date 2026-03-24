import express from 'express';
import { createBus, getBuses, updateBusLocation, deleteBus } from '../controllers/busController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getBuses);
router.post('/', adminOnly, createBus);
router.put('/:id/location', updateBusLocation);
router.delete('/:id', adminOnly, deleteBus);

export default router;
