import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import {
  UserModel,
  loadLocalDb,
  saveLocalDb,
  getIsMongoConnected,
} from '../db.ts';
import { generateToken, requireAuth, AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res: Response) => {
  try {
    const { name, email, phone, password, address, role } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Full name, email, phone number, and password are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (getIsMongoConnected()) {
      const existingUser = await UserModel.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(409).json({ error: 'An account with this email address already exists. Please sign in instead.' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const userRole = role === 'admin' ? 'admin' : 'user';

      const newUser = await UserModel.create({
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        address: address ? address.trim() : '',
        passwordHash,
        role: userRole,
      });

      const token = generateToken({
        _id: newUser._id.toString(),
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      });

      return res.status(201).json({
        message: 'Account created successfully.',
        token,
        user: {
          _id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          address: newUser.address,
          role: newUser.role,
          createdAt: newUser.createdAt,
        },
      });
    }

    // Local DB
    const db = loadLocalDb();
    const existing = db.users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists. Please sign in instead.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const userRole = role === 'admin' ? 'admin' : 'user';

    const newUser = {
      _id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      address: address ? address.trim() : '',
      passwordHash,
      role: userRole as 'user' | 'admin',
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    saveLocalDb();

    const token = generateToken({
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    console.error('[Auth Register Error]', err);
    return res.status(500).json({ error: 'An unexpected server error occurred during registration. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (getIsMongoConnected()) {
      const user = await UserModel.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = generateToken({
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      });

      return res.json({
        message: 'Signed in successfully.',
        token,
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    }

    // Local DB
    const db = loadLocalDb();
    const user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken({
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return res.json({
      message: 'Signed in successfully.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('[Auth Login Error]', err);
    return res.status(500).json({ error: 'An unexpected server error occurred during authentication.' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    if (getIsMongoConnected()) {
      const user = await UserModel.findById(req.user._id).select('-passwordHash');
      if (!user) {
        return res.status(404).json({ error: 'User profile not found.' });
      }
      return res.json({ user });
    }

    const db = loadLocalDb();
    const user = db.users.find(u => u._id === req.user?._id);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    const { passwordHash: _, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch (err) {
    console.error('[Auth Me Error]', err);
    return res.status(500).json({ error: 'Failed to retrieve profile details.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (_req, res: Response) => {
  return res.json({ message: 'Logged out successfully.' });
});

export default router;
