const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const FROM_EMAIL = `"ServiceHub Support" <support@servicehub.com>`;

const emailTemplates = {
  bookingConfirmation: (user, booking, service) => ({
    subject: `Booking Confirmed - ${service.name}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 10px; color: white;">
        <div style="background: white; color: #333; padding: 30px; border-radius: 8px;">
          <h1 style="color: #667eea; margin-bottom: 20px;">✓ Booking Confirmed!</h1>
          <p style="font-size: 16px; margin-bottom: 15px;">Hi ${user.full_name},</p>
          <p style="font-size: 16px; margin-bottom: 20px;">Your booking has been confirmed. Here are the details:</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 10px 0;"><strong>Service:</strong> ${service.name}</p>
            <p style="margin: 10px 0;"><strong>Date:</strong> ${booking.booking_date}</p>
            <p style="margin: 10px 0;"><strong>Time:</strong> ${booking.booking_time}</p>
            <p style="margin: 10px 0;"><strong>Duration:</strong> ${service.duration_minutes} minutes</p>
            <p style="margin: 10px 0;"><strong>Price:</strong> $${(service.service_price || service.price || 0)}</p>
            ${booking.special_requests ? `<p style="margin: 10px 0;"><strong>Special Requests:</strong> ${booking.special_requests}</p>` : ''}
          </div>
          
          <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Thank you for booking with us! If you need to reschedule or have any questions, please contact us.</p>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">ServiceHub - Professional Services on Demand</p>
          </div>
        </div>
      </div>
    `,
  }),
  verificationEmail: (user, verificationLink) => ({
    subject: 'Confirm your ServiceHub Account',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 10px; color: white;">
        <div style="background: white; color: #333; padding: 30px; border-radius: 8px; text-align: center;">
          <h1 style="color: #667eea; margin-bottom: 20px;">Welcome to ServiceHub!</h1>
          <p style="font-size: 16px; margin-bottom: 25px;">Hi ${user.full_name}, please confirm your email address to start booking professional services.</p>
          
          <a href="${verificationLink}" style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-bottom: 25px;">Verify My Email Address</a>
          
          <p style="font-size: 14px; color: #666; margin-bottom: 20px;">If the button above doesn't work, copy and paste this link into your browser:</p>
          <p style="font-size: 12px; color: #999; word-break: break-all;">${verificationLink}</p>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; margin-top: 30px;">
            <p style="color: #999; font-size: 12px;">ServiceHub - Professional Services on Demand</p>
          </div>
        </div>
      </div>
    `,
  }),
};

module.exports = {
  transporter,
  emailTemplates,
  FROM_EMAIL,
};
