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
], async (req, res) => {
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

    res.status(201).json({ 
      message: 'Registration successful. Please check your email to verify your account.',
      user: { id: user.id, email: user.email, full_name: user.full_name, is_verified: false }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[Auth] Login attempt for: ${email}`);
    
    const user = await User.findByEmail(email);
    console.log(`[Auth] User found: ${user ? 'Yes' : 'No'}`);

    if (!user) {
      console.log(`[Auth] Login failed: User not found`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    try {
      const isValidPassword = await User.verifyPassword(password, user.password_hash);
      console.log(`[Auth] Password valid: ${isValidPassword}`);
      
      if (!isValidPassword) {
        console.log(`[Auth] Login failed: Invalid password`);
        return res.status(401).json({ error: 'Invalid email or password' });
      }
    } catch (passwordErr) {
      console.error(`[Auth] Password verification error:`, passwordErr.message);
      return res.status(500).json({ error: 'Authentication internal error' });
    }

    if (!user.is_verified) {
      console.log(`[Auth] Login failed: User not verified`);
      return res.status(403).json({ 
        error: 'Please verify your email address to log in.',
        needsVerification: true
      });
    }

    try {
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      console.log(`[Auth] Token generated for user: ${user.id}`);
      res.json({ user: { id: user.id, email: user.email, full_name: user.full_name, phone: user.phone, role: user.role, is_verified: user.is_verified }, token });
    } catch (jwtErr) {
      console.error(`[Auth] JWT signing error:`, jwtErr.message);
      return res.status(500).json({ error: 'Token generation failed' });
    }
  } catch (err) {
    console.error(`[Auth] Global login error:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// Verify Email
router.get('/verify/:token', async (req, res) => {
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
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
