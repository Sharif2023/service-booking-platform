const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log(`[Request] ${req.method} ${req.path} | Origin: ${origin}`);
  
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Webhook route MUST come before express.json() so raw body is preserved for Stripe signature verification
app.use('/api/webhooks', require('./src/routes/webhook'));

app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/services', require('./src/routes/services'));
app.use('/api/bookings', require('./src/routes/bookings'));
app.use('/api/admin', require('./src/routes/admin'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Booking API running', status: 'OK' });
});

const PORT = process.env.PORT || 5000;

// Export mapping for Vercel serverless functions
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
  });
}