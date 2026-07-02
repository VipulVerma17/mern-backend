import express from 'express';
import { login, register } from '../controllers/authController.js';
import { validateLogin, validateRegistration } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

export default router;
