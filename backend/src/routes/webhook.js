const express = require('express');
const stripe = require('../config/stripe');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Service = require('../models/Service');
const { transporter, emailTemplates } = require('../config/email');

const router = express.Router();

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const booking = await Booking.getByStripeSessionId(session.id);

      if (booking) {
        await Booking.updateStatus(booking.id, 'confirmed');

        // Send confirmation email
        const user = await User.findById(booking.user_id);
        const service = await Service.getById(booking.service_id);
        const emailTemplate = emailTemplates.bookingConfirmation(user, booking, service);

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        });
      }
    }

    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

module.exports = router;
