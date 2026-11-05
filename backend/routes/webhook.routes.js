const express = require('express');
const router = express.Router();
const rawBody = require('../middleware/rawBody.middleware');
const { handleStripeWebhook } = require('../controllers/webhook.controller');

router.post('/stripe', rawBody, handleStripeWebhook);

module.exports = router;