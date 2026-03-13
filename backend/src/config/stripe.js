const key = (process.env.STRIPE_SECRET_KEY || '').trim();
console.log('[StripeConfig] Secret key present:', key ? 'YES' : 'NO');
if (key) {
  console.log('[StripeConfig] Key length:', key.length);
  console.log('[StripeConfig] Key prefix:', key.substring(0, 7));
}
const stripe = require('stripe')(key);

module.exports = stripe;
