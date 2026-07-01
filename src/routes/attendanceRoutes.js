import express from 'express';
import { createAttendance, deleteAttendance, getAttendance, updateAttendance } from '../controllers/attendanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', protect, getAttendance);
router.post('/', protect, createAttendance);
router.put('/:id', protect, updateAttendance);
router.delete('/:id', protect, deleteAttendance);

export default router;
