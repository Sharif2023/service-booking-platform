const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Service = require('../models/Service');
const { transporter, emailTemplates } = require('../config/email');

const router = express.Router();
router.use(authMiddleware, adminMiddleware);

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.getAll();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update booking status
router.patch('/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.updateStatus(req.params.id, status);

    // Send email notification
    const user = await User.findById(booking.user_id);
    const service = await Service.getById(booking.service_id);

    const emailTemplate = emailTemplates.bookingConfirmation(user, booking, service);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get analytics
router.get('/analytics', async (req, res) => {
  try {
    const allBookings = await Booking.getAll();
    const totalBookings = allBookings.length;
    const totalRevenue = allBookings.reduce((sum, b) => sum + parseFloat(b.price || 0), 0);
    const confirmedBookings = allBookings.filter(b => b.status === 'confirmed').length;

    res.json({
      totalBookings,
      totalRevenue: totalRevenue.toFixed(2),
      confirmedBookings,
      pendingBookings: allBookings.filter(b => b.status === 'pending').length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
