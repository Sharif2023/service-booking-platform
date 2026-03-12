const express = require('express');
const stripe = require('../config/stripe');
const { body, validationResult } = require('express-validator');
const { authMiddleware } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const { transporter, emailTemplates } = require('../config/email');

const router = express.Router();

// Create booking and get Stripe session
router.post('/create-session', authMiddleware, [
  body('service_id').notEmpty(),
  body('booking_date').notEmpty(),
  body('booking_time').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { service_id, booking_date, booking_time, special_requests } = req.body;
    const user = await User.findById(req.user.id);
    const service = await Service.getById(service_id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Create booking with pending status
    const booking = await Booking.create(req.user.id, service_id, booking_date, booking_time, special_requests);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: service.name,
              description: `${booking_date} at ${booking_time}`,
            },
            unit_amount: Math.round(service.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/booking-cancelled`,
      customer_email: user.email,
      metadata: {
        booking_id: booking.id,
        user_id: req.user.id,
      },
    });

    // Save Stripe session ID
    await Booking.updateStripeSession(booking.id, session.id);

    res.json({ sessionId: session.id, clientSecret: session.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's bookings
router.get('/', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.getByUserId(req.user.id);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel booking
router.patch('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.getById(req.params.id);

    if (!booking || booking.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (booking.status === 'confirmed') {
      const updatedBooking = await Booking.updateStatus(req.params.id, 'cancelled');
      res.json(updatedBooking);
    } else {
      res.status(400).json({ error: 'Cannot cancel this booking' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
