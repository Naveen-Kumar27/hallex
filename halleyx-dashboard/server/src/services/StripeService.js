const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async ({ items, customerEmail, successUrl, cancelUrl, metadata }) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description,
          },
          unit_amount: item.amount, // amount in cents
        },
        quantity: item.quantity || 1,
      })),
      mode: 'payment',
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: metadata,
    });
    return session;
  } catch (error) {
    console.error('Stripe Session Error:', error);
    throw error;
  }
};

const constructEvent = (payload, sig, endpointSecret) => {
  return stripe.webhooks.constructEvent(payload, sig, endpointSecret);
};

module.exports = {
  createCheckoutSession,
  constructEvent,
};
