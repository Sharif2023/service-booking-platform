const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { transporter, emailTemplates, FROM_EMAIL } = require('../config/email');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('full_name').notEmpty(),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, full_name, phone } = req.body;
    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create(email, password, full_name, phone, 'user', verificationToken);
    
    // Send verification email
    try {
      const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
      const emailTemplate = emailTemplates.verificationEmail(user, verificationLink);
      
      await transporter.sendMail({
        from: FROM_EMAIL,
        to: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
      console.log(`[Auth] Verification email sent to ${user.email}`);
    } catch (emailErr) {
      console.error('[Auth] Failed to send verification email:', emailErr.message);
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role,
      is_verified: user.is_verified,
      gender: user.gender,
      dob: user.dob,
      created_at: user.created_at
    };

    res.status(201).json({ 
      message: 'Registration successful. Please check your email to verify your account.',
      user: safeUser
    });
  } catch (err) {
    next(err);
  }
});

// Login
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(`[Auth] Login attempt for: ${email}`);
    
    const user = await User.findByEmail(email);
    console.log(`[Auth] User found: ${user ? 'Yes' : 'No'}`);

    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    try {
      const isValidPassword = await User.verifyPassword(password, user.password_hash);
      console.log(`[Auth] Password valid: ${isValidPassword}`);
      
      if (!isValidPassword) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
      }
    } catch (passwordErr) {
      next(passwordErr);
      return;
    }

    if (!user.is_verified) {
      console.log(`[Auth] Login failed: User not verified`);
      return res.status(403).json({ 
        error: 'Please verify your email address to log in.',
        needsVerification: true
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    const safeUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role,
      is_verified: user.is_verified,
      gender: user.gender,
      dob: user.dob,
      created_at: user.created_at
    };

    res.json({ user: safeUser, token });
  } catch (err) {
    next(err);
  }
});

// Verify Email
router.get('/verify/:token', async (req, res, next) => {
  try {
    const { token } = req.params;
    console.log(`[Auth] Verifying token: ${token}`);
    const user = await User.findByToken(token);

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    await User.verifyEmail(user.id);
    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    next(err);
  }
});

const { authMiddleware } = require('../middleware/auth');

// Update profile
router.put('/profile', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.user;
    const { full_name, phone, gender, dob, current_password, new_password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If password change requested
    if (new_password) {
      if (!current_password) {
        return res.status(400).json({ error: 'Current password required to set new password' });
      }
      
      const dbUser = await User.findByEmail(user.email); // Need full record with password_hash
      const isValid = await User.verifyPassword(current_password, dbUser.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: 'Incorrect current password' });
      }
    }

    const updatedUser = await User.update(id, {
      full_name: full_name || user.full_name,
      phone: phone || user.phone,
      password: new_password,
      gender: gender !== undefined ? gender : user.gender,
      dob: dob !== undefined ? dob : user.dob
    });

    const safeUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      full_name: updatedUser.full_name,
      phone: updatedUser.phone,
      role: updatedUser.role,
      is_verified: updatedUser.is_verified,
      gender: updatedUser.gender,
      dob: updatedUser.dob,
      created_at: updatedUser.created_at
    };

    res.json(safeUser);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
