const stripeService = require('../services/StripeService');
const Order = require('../models/Order');

const createSession = async (req, res) => {
  const { orderId, successUrl, cancelUrl } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: 'No order ID provided for checkout' });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const session = await stripeService.createCheckoutSession({
      items: [
        {
          name: `Order #${order._id.toString().substring(18).toUpperCase()}`,
          description: `Payment for ${order.orderInfo.product}`,
          amount: Math.round(order.orderInfo.totalAmount * 100), // convert to cents
          quantity: 1,
        },
      ],
      customerEmail: order.customer.email,
      successUrl: successUrl || `${process.env.CLIENT_URL}/orders?success=true&orderId=${orderId}`,
      cancelUrl: cancelUrl || `${process.env.CLIENT_URL}/orders?cancelled=true`,
      metadata: { orderId: orderId.toString() },
    });

    // Add metadata to the session for webhook processing
    // Note: Stripe Service needs to be updated or we can modify it here
    // For simplicity, I'll update StripeService to accept metadata or just add it to the call if it supports it
    // Wait, let's update StripeService first to be more flexible.

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Payment Controller Error:', error);
    res.status(500).json({ message: 'Failed to create payment session', error: error.message });
  }
};

const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripeService.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    
    if (orderId) {
      try {
        await Order.findByIdAndUpdate(orderId, {
          'orderInfo.status': 'Completed'
        });
        console.log(`Order ${orderId} marked as Completed following successful payment.`);
      } catch (err) {
        console.error(`Failed to update order ${orderId}:`, err);
      }
    }
  }

  res.json({ received: true });
};

module.exports = {
  createSession,
  handleWebhook,
};
