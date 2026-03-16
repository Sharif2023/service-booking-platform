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
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { service_id, booking_date, booking_time, special_requests } = req.body;
    const userId = req.user?.id;
    console.log('[CreateSession] Request started for User ID:', userId);
    console.log('[CreateSession] Params:', { service_id, booking_date, booking_time });

    if (!userId) {
      console.error('[CreateSession] No user ID found in request!');
      return res.status(401).json({ error: 'Unauthorized: User ID missing' });
    }

    const user = await User.findById(userId);
    console.log('[CreateSession] User lookup:', user ? `Found (${user.email})` : 'NOT FOUND');
    
    if (!user) {
      console.error('[CreateSession] User not found in database for ID:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    const service = await Service.getById(service_id);
    console.log('[CreateSession] Service lookup:', service ? `Found (${service.name}, Price: ${service.price})` : 'NOT FOUND');

    if (!service) {
      console.error('[CreateSession] Service not found for ID:', service_id);
      return res.status(404).json({ error: 'Service not found' });
    }

    const price = parseFloat(service.price || service.service_price);
    if (isNaN(price)) {
      console.error('[CreateSession] Invalid price detected:', service.price);
      return res.status(400).json({ error: 'Service has invalid price configuration' });
    }

    // Prevent duplicates: Check if a pending booking already exists for this slot
    console.log('[CreateSession] Checking for existing pending booking...');
    let booking = await Booking.findPendingBooking(userId, service_id, booking_date, booking_time);
    
    if (booking) {
      console.log('[CreateSession] Found existing pending booking. Reusing ID:', booking.id);
    } else {
      console.log('[CreateSession] No existing pending booking found. Creating new one...');
      booking = await Booking.create(userId, service_id, booking_date, booking_time, special_requests);
      console.log('[CreateSession] New booking created in DB. ID:', booking?.id);
    }

    if (!booking) {
      throw new Error('Failed to create or retrieve booking record');
    }

    // Create Stripe checkout session
    const frontendUrl = (process.env.FRONTEND_URL || '').trim();
    const stripeKey = (process.env.STRIPE_SECRET_KEY || '').trim();
    
    console.log('[CreateSession] Environment Check:');
    console.log('- FRONTEND_URL:', frontendUrl || 'MISSING');
    console.log('- STRIPE_KEY status:', stripeKey ? 'PRESENT' : 'MISSING');
    console.log('- STRIPE_KEY length:', stripeKey.length);

    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY is missing in environment variables');
    }

    console.log('[CreateSession] Calling Stripe API (checkout.sessions.create)...');
    
    const sessionConfig = {
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: String(service.name),
              description: `${booking_date} at ${booking_time}`,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      ui_mode: 'embedded',
      return_url: `${frontendUrl}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: user.email,
      metadata: {
        booking_id: String(booking.id),
        user_id: String(userId),
      },
    };

    console.log('[CreateSession] Stripe Config:', JSON.stringify(sessionConfig, null, 2));

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log('[CreateSession] Stripe API SUCCESS! Session ID:', session.id);

    // Save Stripe session ID
    await Booking.updateStripeSession(booking.id, session.id, null);
    console.log('[CreateSession] Booking updated with Stripe session ID');

    res.status(201).json({ 
      sessionId: session.id, 
      clientSecret: session.client_secret
    });
  } catch (err) {
    next(err);
  }
});

// Check payment status of a Stripe session
router.get('/session-status/:sessionId', authMiddleware, async (req, res, next) => {
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
    next(err); // Use next(err)
  }
});

// Get user's bookings
router.get('/', authMiddleware, async (req, res, next) => { // Added 'next'
  try {
    const bookings = await Booking.getByUserId(req.user.id);
    res.json(bookings);
  } catch (err) {
    next(err); // Use next(err)
  }
});

// Cancel booking
router.patch('/:id/cancel', authMiddleware, async (req, res, next) => { // Added 'next'
  try {
    const booking = await Booking.getById(req.params.id);

    if (!booking || booking.user_id !== req.user.id) {
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      throw error;
    }

    if (booking.status === 'confirmed' || booking.status === 'pending') {
      const updatedBooking = await Booking.updateStatus(req.params.id, 'cancelled');
      res.json(updatedBooking);
    } else {
      res.status(400).json({ error: 'Cannot cancel this booking' });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
