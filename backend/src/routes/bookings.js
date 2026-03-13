const express = require('express');
const stripe = require('../config/stripe');
const { body, validationResult } = require('express-validator');
const { authMiddleware } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const { transporter, emailTemplates, FROM_EMAIL } = require('../config/email');

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

    console.log('Found user:', user ? user.email : 'NOT FOUND');
    console.log('Found service:', service ? service.name : 'NOT FOUND');


    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Create booking with pending status
    console.log('[CreateSession] Creating booking in DB...');
    const booking = await Booking.create(req.user.id, service_id, booking_date, booking_time, special_requests);
    console.log('[CreateSession] Booking created in DB. ID:', booking.id);

    // Create Stripe checkout session
    console.log('[CreateSession] Initializing Stripe with environment vars...');
    console.log('[CreateSession] FRONTEND_URL:', process.env.FRONTEND_URL ? 'PRESENT' : 'MISSING');
    console.log('[CreateSession] STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'PRESENT' : 'MISSING');

    console.log('[CreateSession] Creating Stripe session...');
    const session = await stripe.checkout.sessions.create({
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
      ui_mode: 'embedded',
      return_url: `${process.env.FRONTEND_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: user.email,
      metadata: {
        booking_id: booking.id,
        user_id: req.user.id,
      },
    });

    // Save Stripe session ID
    await Booking.updateStripeSession(booking.id, session.id, null);

    console.log('Stripe session created successfully:', session.id);
    console.log('Full Session Record:', JSON.stringify(session, null, 2));
    console.log('Client Secret available:', session.client_secret ? 'YES' : 'NO');
    console.log('--- Create Session Request End ---');

    res.json({ 
      sessionId: session.id, 
      clientSecret: session.client_secret,
      _fullInformation: session 
    });
  } catch (err) {
    console.error('!!! Create Session Error !!!');
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ error: err.message });
  }
});

// Check payment status of a Stripe session
router.get('/session-status/:sessionId', authMiddleware, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    const booking = await Booking.getByStripeSessionId(req.params.sessionId);

    if (!booking || booking.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized or booking not found' });
    }

    // If status is paid but our DB is still pending, update it (fallback for webhook)
    if (session.payment_status === 'paid' && booking.status === 'pending') {
      console.log(`[SessionFallback] Payment verified for booking ${booking.id}. Updating status...`);
      await Booking.updateStatus(booking.id, 'confirmed');
      booking.status = 'confirmed';

      // Send confirmation email (simplified for fallback)
      try {
        const user = await User.findById(booking.user_id);
        const service = await Service.getById(booking.service_id);
        
        if (user && service) {
          console.log(`[SessionFallback] Sending confirmation email to ${user.email}`);
          const emailTemplate = emailTemplates.bookingConfirmation(user, booking, service);
          await transporter.sendMail({
            from: FROM_EMAIL,
            to: user.email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
          });
          console.log(`[SessionFallback] Email sent successfully`);
        } else {
          console.warn(`[SessionFallback] Skipping email: User or Service data missing`);
        }
      } catch (emailErr) {
        console.error(`[SessionFallback] Email notification failed:`, emailErr.message);
      }
    } else {
      console.log(`[SessionFallback] Payment status: ${session.payment_status}, Booking status: ${booking.status}. No action needed.`);
    }

    res.json({ 
      status: session.status, 
      payment_status: session.payment_status, 
      booking_status: booking.status,
      booking: {
        id: booking.id,
        service_name: (await Service.getById(booking.service_id)).name,
        booking_date: booking.booking_date,
        booking_time: booking.booking_time
      }
    });
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

    if (booking.status === 'confirmed' || booking.status === 'pending') {
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
