const Stripe = require('stripe');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY missing. Stripe features will fail.');
}

const stripe = new Stripe(STRIPE_SECRET_KEY , {
  maxNetworkRetries: 2,
  timeout: 15000
});

module.exports = stripe;