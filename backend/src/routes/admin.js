const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Service = require('../models/Service');
const { transporter, emailTemplates, FROM_EMAIL } = require('../config/email');

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
  const { id } = req.params;
  const { status } = req.body;
  
  console.log(`[Admin] Attempting to update booking ${id} to status: ${status}`);

  try {
    const booking = await Booking.updateStatus(id, status);
    console.log(`[Admin] Booking ${id} status successfully updated in DB`);

    // Send email notification - wrapped in try/catch to ensure API response succeeds 
    // even if email fails (common in local dev without proper SMTP)
    try {
      const user = await User.findById(booking.user_id);
      const service = await Service.getById(booking.service_id);

      if (user && service && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        console.log(`[Admin] Sending status update email to ${user.email}`);
        const emailTemplate = emailTemplates.bookingConfirmation(user, booking, service);
        await transporter.sendMail({
          from: FROM_EMAIL,
          to: user.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        });
        console.log(`[Admin] Email sent successfully`);
      } else {
        console.log(`[Admin] Skipping email: Missing user/service data or mail config`);
      }
    } catch (emailError) {
      console.error('[Admin] Email notification failed but booking update succeeded:', emailError.message);
      // We don't throw here - the main goal (status update) was successful
    }

    res.json(booking);
  } catch (err) {
    console.error(`[Admin] Failed to update booking ${id}:`, err.message);
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
