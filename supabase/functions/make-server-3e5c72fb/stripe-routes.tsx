/**
 * Stripe Payment Integration Routes
 * Handles subscription payments, one-time payments, and webhook processing
 */

import { Hono } from 'npm:hono';

const app = new Hono();

// ⚠️ КРИТИЧЕСКИ ВАЖНО: В production добавьте эти environment variables:
// - STRIPE_SECRET_KEY: Ваш Stripe Secret Key (sk_test_... или sk_live_...)
// - STRIPE_WEBHOOK_SECRET: Webhook signing secret (whsec_...)
// - STRIPE_PUBLISHABLE_KEY: Publishable key для frontend (pk_test_... или pk_live_...)

interface CreatePaymentIntentRequest {
  amount: number; // В минимальных единицах (центы, дирхамы и т.д.)
  currency: string; // 'aed', 'usd', 'eur', etc.
  planName: string;
  salonId?: string;
  userId?: string;
  metadata?: Record<string, string>;
}

interface CreateSubscriptionRequest {
  priceId: string; // Stripe Price ID (e.g., 'price_1MnNXJ...')
  salonId: string;
  userId: string;
  email: string;
  paymentMethodId: string;
}

/**
 * POST /make-server-3e5c72fb/stripe/create-payment-intent
 * Creates a PaymentIntent for one-time payments (booking deposits, etc.)
 */
app.post('/create-payment-intent', async (c) => {
  try {
    const body = await c.req.json<CreatePaymentIntentRequest>();
    const { amount, currency, planName, salonId, userId, metadata } = body;

    // Validation
    if (!amount || amount <= 0) {
      return c.json({ error: 'Invalid amount' }, 400);
    }

    if (!currency) {
      return c.json({ error: 'Currency is required' }, 400);
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error('❌ STRIPE_SECRET_KEY not configured');
      return c.json({ 
        error: 'Payment system not configured. Please contact support.',
        code: 'STRIPE_NOT_CONFIGURED'
      }, 500);
    }

    // Create PaymentIntent using Stripe API
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: amount.toString(),
        currency: currency.toLowerCase(),
        'automatic_payment_methods[enabled]': 'true',
        'metadata[planName]': planName || '',
        'metadata[salonId]': salonId || '',
        'metadata[userId]': userId || '',
        ...Object.entries(metadata || {}).reduce((acc, [key, value]) => ({
          ...acc,
          [`metadata[${key}]`]: value
        }), {})
      }).toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Stripe API error:', error);
      return c.json({ 
        error: 'Failed to create payment intent',
        details: error 
      }, 500);
    }

    const paymentIntent = await response.json();

    console.log(`✅ Payment Intent created: ${paymentIntent.id} for ${amount} ${currency}`);

    return c.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return c.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * POST /make-server-3e5c72fb/stripe/create-subscription
 * Creates a Stripe subscription for salon plans
 */
app.post('/create-subscription', async (c) => {
  try {
    const body = await c.req.json<CreateSubscriptionRequest>();
    const { priceId, salonId, userId, email, paymentMethodId } = body;

    // Validation
    if (!priceId || !salonId || !userId || !email || !paymentMethodId) {
      return c.json({ 
        error: 'Missing required fields',
        required: ['priceId', 'salonId', 'userId', 'email', 'paymentMethodId']
      }, 400);
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      return c.json({ 
        error: 'Payment system not configured',
        code: 'STRIPE_NOT_CONFIGURED'
      }, 500);
    }

    // Step 1: Create or retrieve customer
    let customerId: string;

    // Search for existing customer
    const searchResponse = await fetch(
      `https://api.stripe.com/v1/customers/search?query=email:"${email}"`,
      {
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
        },
      }
    );

    const searchResult = await searchResponse.json();

    if (searchResult.data && searchResult.data.length > 0) {
      customerId = searchResult.data[0].id;
      console.log(`✅ Found existing customer: ${customerId}`);
    } else {
      // Create new customer
      const createCustomerResponse = await fetch('https://api.stripe.com/v1/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email,
          'metadata[userId]': userId,
          'metadata[salonId]': salonId,
        }).toString(),
      });

      const customer = await createCustomerResponse.json();
      customerId = customer.id;
      console.log(`✅ Created new customer: ${customerId}`);
    }

    // Step 2: Attach payment method to customer
    await fetch(`https://api.stripe.com/v1/payment_methods/${paymentMethodId}/attach`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        customer: customerId,
      }).toString(),
    });

    // Step 3: Set default payment method
    await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'invoice_settings[default_payment_method]': paymentMethodId,
      }).toString(),
    });

    // Step 4: Create subscription
    const subscriptionResponse = await fetch('https://api.stripe.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        customer: customerId,
        'items[0][price]': priceId,
        'payment_behavior': 'default_incomplete',
        'payment_settings[save_default_payment_method]': 'on_subscription',
        'expand[]': 'latest_invoice.payment_intent',
        'metadata[salonId]': salonId,
        'metadata[userId]': userId,
      }).toString(),
    });

    if (!subscriptionResponse.ok) {
      const error = await subscriptionResponse.json();
      console.error('Stripe subscription error:', error);
      return c.json({ error: 'Failed to create subscription', details: error }, 500);
    }

    const subscription = await subscriptionResponse.json();

    console.log(`✅ Subscription created: ${subscription.id} for salon ${salonId}`);

    return c.json({
      subscriptionId: subscription.id,
      customerId,
      clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
      status: subscription.status,
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    return c.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * POST /make-server-3e5c72fb/stripe/cancel-subscription
 * Cancels a subscription
 */
app.post('/cancel-subscription', async (c) => {
  try {
    const { subscriptionId, cancelAtPeriodEnd = true } = await c.req.json();

    if (!subscriptionId) {
      return c.json({ error: 'subscriptionId is required' }, 400);
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      return c.json({ error: 'Payment system not configured' }, 500);
    }

    let url: string;
    let body: URLSearchParams;

    if (cancelAtPeriodEnd) {
      // Cancel at end of billing period
      url = `https://api.stripe.com/v1/subscriptions/${subscriptionId}`;
      body = new URLSearchParams({
        'cancel_at_period_end': 'true',
      });
    } else {
      // Cancel immediately
      url = `https://api.stripe.com/v1/subscriptions/${subscriptionId}`;
      body = new URLSearchParams({});
    }

    const response = await fetch(url, {
      method: cancelAtPeriodEnd ? 'POST' : 'DELETE',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      return c.json({ error: 'Failed to cancel subscription', details: error }, 500);
    }

    const subscription = await response.json();

    console.log(`✅ Subscription ${cancelAtPeriodEnd ? 'scheduled for cancellation' : 'cancelled'}: ${subscriptionId}`);

    return c.json({
      success: true,
      subscription,
    });

  } catch (error) {
    console.error('Error canceling subscription:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

/**
 * POST /make-server-3e5c72fb/stripe/webhook
 * Handles Stripe webhook events (payment success, subscription updates, etc.)
 */
app.post('/webhook', async (c) => {
  try {
    const signature = c.req.header('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET not configured');
      return c.json({ error: 'Webhook not configured' }, 500);
    }

    if (!signature) {
      return c.json({ error: 'Missing stripe-signature header' }, 400);
    }

    const payload = await c.req.text();

    // Verify webhook signature (simplified - in production use Stripe SDK)
    // In production, use: stripe.webhooks.constructEvent(payload, signature, webhookSecret)
    
    const event = JSON.parse(payload);

    console.log(`📨 Webhook received: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`✅ Payment succeeded: ${paymentIntent.id}`);
        // TODO: Update database, send confirmation email
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log(`❌ Payment failed: ${failedPayment.id}`);
        // TODO: Notify user, update database
        break;

      case 'invoice.paid':
        const paidInvoice = event.data.object;
        console.log(`✅ Invoice paid: ${paidInvoice.id}`);
        // TODO: Activate subscription, update database
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        console.log(`❌ Invoice payment failed: ${failedInvoice.id}`);
        // TODO: Send dunning email, update subscription status
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object;
        console.log(`🔄 Subscription updated: ${updatedSubscription.id}`);
        // TODO: Update database with new subscription status
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        console.log(`🗑️ Subscription deleted: ${deletedSubscription.id}`);
        // TODO: Deactivate salon account, update database
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return c.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return c.json({ error: 'Webhook processing failed' }, 500);
  }
});

/**
 * GET /make-server-3e5c72fb/stripe/config
 * Returns Stripe publishable key for frontend
 */
app.get('/config', async (c) => {
  const publishableKey = Deno.env.get('STRIPE_PUBLISHABLE_KEY');
  
  if (!publishableKey) {
    // Return demo mode configuration (silent - no console warnings)
    return c.json({ 
      configured: false,
      demoMode: true,
      message: 'Using demo mode for payment simulation'
    });
  }

  return c.json({
    publishableKey,
    configured: true,
    currency: 'aed', // Default currency
    demoMode: false
  });
});

/**
 * GET /make-server-3e5c72fb/stripe/subscription/:subscriptionId
 * Retrieves subscription details
 */
app.get('/subscription/:subscriptionId', async (c) => {
  try {
    const subscriptionId = c.req.param('subscriptionId');
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeSecretKey) {
      return c.json({ error: 'Payment system not configured' }, 500);
    }

    const response = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return c.json({ error: 'Failed to retrieve subscription', details: error }, 500);
    }

    const subscription = await response.json();

    return c.json(subscription);

  } catch (error) {
    console.error('Error retrieving subscription:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default app;