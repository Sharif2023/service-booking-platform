const express = require('express');
const stripe = require('../config/stripe');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Service = require('../models/Service');
const { transporter, emailTemplates, FROM_EMAIL } = require('../config/email');

const router = express.Router();

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log(`[Webhook] Received Stripe event: ${event.type}`);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log(`[Webhook] Processing completed session: ${session.id}`);
      
      const booking = await Booking.getByStripeSessionId(session.id);

      if (booking) {
        console.log(`[Webhook] Found booking ${booking.id} for session ${session.id}. Current status: ${booking.status}`);
        
        if (booking.status === 'pending') {
          await Booking.updateStatus(booking.id, 'confirmed');
          console.log(`[Webhook] Booking ${booking.id} status updated to confirmed`);

          // Send confirmation email
          try {
            const user = await User.findById(booking.user_id);
            const service = await Service.getById(booking.service_id);
            
            if (user && service) {
              console.log(`[Webhook] Sending confirmation email to ${user.email} for booking ${booking.id}`);
              const emailTemplate = emailTemplates.bookingConfirmation(user, booking, service);

              await transporter.sendMail({
                from: FROM_EMAIL,
                to: user.email,
                subject: emailTemplate.subject,
                html: emailTemplate.html,
              });
              console.log(`[Webhook] Email sent successfully to ${user.email}`);
            } else {
              console.warn(`[Webhook] Could not send email: User or Service not found for booking ${booking.id}`);
            }
          } catch (emailErr) {
            console.error(`[Webhook] Email sending failed for booking ${booking.id}:`, emailErr.message);
          }
        } else {
          console.log(`[Webhook] Booking ${booking.id} is already status: ${booking.status}. Skipping email.`);
        }
      } else {
        console.warn(`[Webhook] No booking found in DB for session ID: ${session.id}`);
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error(`[Webhook] Error processing webhook: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

module.exports = router;
