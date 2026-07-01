import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createUserRecord, findUserByEmail, isDatabaseReady } from '../dataStore.js';

const buildToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

const sanitizeUser = (user) => ({ id: user._id, fullName: user.fullName, email: user.email, role: user.role });

const DEMO_CREDENTIALS = {
  email: 'admin@college.com',
  password: 'Admin@123',
  fullName: 'Demo Admin',
  role: 'admin'
};

const isDemoLogin = (email, password) => email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password;

export const register = async (req, res) => {
  try {
    const { fullName, email, password, role, department, phone } = req.body;

    if (isDatabaseReady()) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'User already exists' });

      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ fullName, email, password: hash, role, department, phone });
      const token = buildToken(user);
      return res.status(201).json({ token, user: sanitizeUser(user) });
    }

    const existing = findUserByEmail(email);
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = createUserRecord({ fullName, email, password: hash, role, department, phone, _id: String(Date.now()) });
    const token = buildToken(user);
    return res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (isDemoLogin(email, password)) {
      const demoUser = {
        _id: 'demo-admin',
        fullName: DEMO_CREDENTIALS.fullName,
        email: DEMO_CREDENTIALS.email,
        role: DEMO_CREDENTIALS.role
      };
      const token = buildToken(demoUser);
      return res.json({ token, user: sanitizeUser(demoUser) });
    }

    if (isDatabaseReady()) {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

      const token = buildToken(user);
      return res.json({ token, user: sanitizeUser(user) });
    }

    const user = findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = buildToken(user);
    return res.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
