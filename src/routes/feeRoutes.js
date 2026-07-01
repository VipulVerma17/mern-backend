import express from 'express';
import { createFee, deleteFee, getFees, updateFee } from '../controllers/feeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', protect, getFees);
router.post('/', protect, createFee);
router.put('/:id', protect, updateFee);
router.delete('/:id', protect, deleteFee);

export default router;
