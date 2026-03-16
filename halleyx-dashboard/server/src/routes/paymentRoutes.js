const express = require('express');
const router = express.Router();
const { createSession, handleWebhook } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

// Route to create a checkout session
router.post('/create-session', protect, createSession);

// Route to handle Stripe webhooks
// Note: This needs raw body for signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
