/**
 * Deposit & Payment Routes
 * 
 * Handles:
 * - Stripe Connect account management
 * - Payment processing (deposits & full payments)
 * - Refunds & cancellations
 * - Deposit settings CRUD
 */

import { Hono } from 'npm:hono@3.11.7';
import * as kv from './kv_store.tsx';
import * as stripeService from './stripeService.ts';
import { 
  SalonDepositSettings, 
  DEFAULT_DEPOSIT_SETTINGS,
  calculateDeposit,
  calculateRefund,
  canReschedule,
  BookingPayment,
  StripeConnectOnboarding,
} from './depositTypes.ts';

const app = new Hono();

const BASE_PATH = '/make-server-3e5c72fb';

// Platform URL for Stripe Connect redirects
const PLATFORM_URL = Deno.env.get('PLATFORM_URL') || 'http://localhost:3000';

/**
 * Stripe Connect Routes
 */

// Create Stripe Connect account & get onboarding link
app.post(`${BASE_PATH}/stripe/connect/create`, async (c) => {
  try {
    const { salonId, ownerId, ownerEmail, salonName } = await c.req.json();

    // Validate required fields
    if (!salonId || !ownerId || !ownerEmail) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Check if account already exists
    const existingKey = `salon:${salonId}:stripe:connect`;
    const existing = await kv.get(existingKey);
    
    if (existing) {
      return c.json({ 
        error: 'Stripe account already connected',
        accountId: existing.stripeAccountId 
      }, 400);
    }

    // Create Stripe Connect account
    const account = await stripeService.createConnectAccount({
      salonId,
      ownerId,
      email: ownerEmail,
      businessName: salonName,
      country: 'AE', // UAE
    });

    // Create onboarding link
    const accountLink = await stripeService.createAccountLink({
      accountId: account.id,
      returnUrl: `${PLATFORM_URL}/dashboard/settings/payments?success=true`,
      refreshUrl: `${PLATFORM_URL}/dashboard/settings/payments?refresh=true`,
    });

    // Store in KV
    const connectData: StripeConnectOnboarding = {
      salonId,
      ownerId,
      onboardingStatus: 'in_progress',
      stripeAccountId: account.id,
      onboardingUrl: accountLink.url,
      returnUrl: `${PLATFORM_URL}/dashboard/settings/payments?success=true`,
      refreshUrl: `${PLATFORM_URL}/dashboard/settings/payments?refresh=true`,
      accountEnabled: false,
      chargesEnabled: false,
      payoutsEnabled: false,
      requirementsNeeded: [],
      lastUpdated: new Date(),
    };
    
    await kv.set(existingKey, connectData);

    console.log('✅ Stripe Connect account created for salon:', salonId);

    return c.json({
      success: true,
      accountId: account.id,
      onboardingUrl: accountLink.url,
      message: 'Redirect user to onboardingUrl to complete setup',
    });
  } catch (error) {
    console.error('❌ Error creating Stripe Connect account:', error);
    return c.json({ 
      error: 'Failed to create Stripe account',
      details: error.message 
    }, 500);
  }
});

// Get Stripe Connect account status
app.get(`${BASE_PATH}/stripe/connect/status/:salonId`, async (c) => {
  try {
    const salonId = c.req.param('salonId');
    
    const connectKey = `salon:${salonId}:stripe:connect`;
    const connectData = await kv.get(connectKey) as StripeConnectOnboarding;

    if (!connectData || !connectData.stripeAccountId) {
      return c.json({ 
        connected: false,
        message: 'No Stripe account connected' 
      });
    }

    // Get fresh status from Stripe
    const status = await stripeService.getAccountStatus(connectData.stripeAccountId);

    // Update KV with latest status
    connectData.accountEnabled = status.chargesEnabled && status.payoutsEnabled;
    connectData.chargesEnabled = status.chargesEnabled;
    connectData.payoutsEnabled = status.payoutsEnabled;
    connectData.requirementsNeeded = status.requirementsNeeded;
    connectData.onboardingStatus = status.chargesEnabled ? 'completed' : 'in_progress';
    connectData.lastUpdated = new Date();
    
    await kv.set(connectKey, connectData);

    return c.json({
      connected: true,
      accountId: connectData.stripeAccountId,
      chargesEnabled: status.chargesEnabled,
      payoutsEnabled: status.payoutsEnabled,
      requirementsNeeded: status.requirementsNeeded,
      requirementsPending: status.requirementsPending,
      detailsSubmitted: status.detailsSubmitted,
      onboardingStatus: connectData.onboardingStatus,
    });
  } catch (error) {
    console.error('❌ Error fetching Stripe status:', error);
    return c.json({ 
      error: 'Failed to fetch account status',
      details: error.message 
    }, 500);
  }
});

// Disconnect Stripe account
app.post(`${BASE_PATH}/stripe/connect/disconnect/:salonId`, async (c) => {
  try {
    const salonId = c.req.param('salonId');
    
    const connectKey = `salon:${salonId}:stripe:connect`;
    const connectData = await kv.get(connectKey) as StripeConnectOnboarding;

    if (!connectData || !connectData.stripeAccountId) {
      return c.json({ error: 'No account to disconnect' }, 400);
    }

    // Delete from Stripe (optional - usually just disable)
    // await stripeService.deleteConnectAccount(connectData.stripeAccountId);

    // Remove from KV
    await kv.del(connectKey);

    console.log('✅ Disconnected Stripe account for salon:', salonId);

    return c.json({
      success: true,
      message: 'Stripe account disconnected',
    });
  } catch (error) {
    console.error('❌ Error disconnecting Stripe:', error);
    return c.json({ 
      error: 'Failed to disconnect account',
      details: error.message 
    }, 500);
  }
});

/**
 * Deposit Settings Routes
 */

// Get deposit settings for salon
app.get(`${BASE_PATH}/salons/:salonId/deposit-settings`, async (c) => {
  try {
    const salonId = c.req.param('salonId');
    
    const settingsKey = `salon:${salonId}:deposit:settings`;
    const settings = await kv.get(settingsKey);

    if (!settings) {
      // Return default settings
      return c.json({
        ...DEFAULT_DEPOSIT_SETTINGS,
        salonId,
      });
    }

    return c.json(settings);
  } catch (error) {
    console.error('❌ Error fetching deposit settings:', error);
    return c.json({ error: 'Failed to fetch settings' }, 500);
  }
});

// Update deposit settings
app.put(`${BASE_PATH}/salons/:salonId/deposit-settings`, async (c) => {
  try {
    const salonId = c.req.param('salonId');
    const settings: SalonDepositSettings = await c.req.json();

    // Validate Stripe connection if deposits enabled
    if (settings.depositEnabled) {
      const connectKey = `salon:${salonId}:stripe:connect`;
      const connectData = await kv.get(connectKey) as StripeConnectOnboarding;

      if (!connectData || !connectData.stripeAccountId) {
        return c.json({ 
          error: 'Stripe account must be connected before enabling deposits' 
        }, 400);
      }

      // Validate account can accept payments
      const validation = await stripeService.validateAccountCanAcceptPayments(
        connectData.stripeAccountId
      );

      if (!validation.valid) {
        return c.json({ 
          error: 'Stripe account not ready to accept payments',
          details: validation.errors 
        }, 400);
      }
    }

    // Save settings
    const settingsKey = `salon:${salonId}:deposit:settings`;
    await kv.set(settingsKey, settings);

    console.log('✅ Updated deposit settings for salon:', salonId);

    return c.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('❌ Error updating deposit settings:', error);
    return c.json({ error: 'Failed to update settings' }, 500);
  }
});

/**
 * Payment Routes
 */

// Create payment intent for booking
app.post(`${BASE_PATH}/bookings/:bookingId/create-payment`, async (c) => {
  try {
    const bookingId = c.req.param('bookingId');
    const { 
      salonId, 
      amount, 
      paymentType, // 'deposit' | 'full' | 'remaining'
      clientEmail,
      clientName,
      clientUserId,
    } = await c.req.json();

    // Get salon's Stripe account
    const connectKey = `salon:${salonId}:stripe:connect`;
    const connectData = await kv.get(connectKey) as StripeConnectOnboarding;

    if (!connectData || !connectData.stripeAccountId) {
      return c.json({ error: 'Salon has not connected Stripe' }, 400);
    }

    // Validate account
    const validation = await stripeService.validateAccountCanAcceptPayments(
      connectData.stripeAccountId
    );

    if (!validation.valid) {
      return c.json({ 
        error: 'Salon cannot accept payments',
        details: validation.errors 
      }, 400);
    }

    // Get or create Stripe customer
    const customer = await stripeService.getOrCreateCustomer({
      email: clientEmail,
      name: clientName,
      userId: clientUserId,
    });

    // Convert AED to fils (smallest unit)
    const amountInFils = stripeService.aedToFils(amount);

    // Create Payment Intent
    const paymentIntent = await stripeService.createPaymentIntent({
      amount: amountInFils,
      currency: 'aed',
      salonStripeAccountId: connectData.stripeAccountId,
      customerId: customer.id,
      metadata: {
        bookingId,
        salonId,
        paymentType,
        clientEmail,
      },
    });

    // Store payment info in KV
    const paymentData: BookingPayment = {
      bookingId,
      salonId,
      totalAmount: amount,
      depositAmount: paymentType === 'deposit' ? amount : 0,
      paidAmount: amount,
      remainingAmount: 0,
      paymentOption: paymentType === 'full' ? 'full' : 'deposit',
      paymentStatus: 'pending',
      paymentIntentId: paymentIntent.id,
      cancelled: false,
      noShow: false,
      createdAt: new Date(),
    };

    const paymentKey = `booking:${bookingId}:payment`;
    await kv.set(paymentKey, paymentData);

    console.log('✅ Created payment intent for booking:', bookingId);

    return c.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: stripeService.filsToAed(paymentIntent.amount),
      currency: paymentIntent.currency,
    });
  } catch (error) {
    console.error('❌ Error creating payment:', error);
    return c.json({ 
      error: 'Failed to create payment',
      details: error.message 
    }, 500);
  }
});

// Confirm payment (webhook will handle actual confirmation)
app.post(`${BASE_PATH}/bookings/:bookingId/confirm-payment`, async (c) => {
  try {
    const bookingId = c.req.param('bookingId');
    const { paymentIntentId } = await c.req.json();

    // Get payment intent status
    const paymentIntent = await stripeService.getPaymentIntent(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return c.json({ 
        error: 'Payment not successful',
        status: paymentIntent.status 
      }, 400);
    }

    // Update payment in KV
    const paymentKey = `booking:${bookingId}:payment`;
    const paymentData = await kv.get(paymentKey) as BookingPayment;

    if (paymentData) {
      paymentData.paymentStatus = 'deposit_paid';
      paymentData.paidAt = new Date();
      await kv.set(paymentKey, paymentData);
    }

    console.log('✅ Payment confirmed for booking:', bookingId);

    return c.json({
      success: true,
      status: paymentIntent.status,
    });
  } catch (error) {
    console.error('❌ Error confirming payment:', error);
    return c.json({ error: 'Failed to confirm payment' }, 500);
  }
});

/**
 * Cancellation & Refund Routes
 */

// Cancel booking with refund calculation
app.post(`${BASE_PATH}/bookings/:bookingId/cancel`, async (c) => {
  try {
    const bookingId = c.req.param('bookingId');
    const { 
      appointmentDate, 
      cancelReason,
      isNoShow = false,
    } = await c.req.json();

    // Get payment data
    const paymentKey = `booking:${bookingId}:payment`;
    const paymentData = await kv.get(paymentKey) as BookingPayment;

    if (!paymentData) {
      return c.json({ error: 'Payment data not found' }, 404);
    }

    if (paymentData.cancelled) {
      return c.json({ error: 'Booking already cancelled' }, 400);
    }

    // Get salon deposit settings
    const settingsKey = `salon:${paymentData.salonId}:deposit:settings`;
    const settings = await kv.get(settingsKey) as SalonDepositSettings;

    if (!settings || !settings.cancellationPolicy.enabled) {
      return c.json({ error: 'Cancellation policy not configured' }, 400);
    }

    // Calculate hours until appointment
    const now = new Date();
    const appointment = new Date(appointmentDate);
    const hoursUntil = (appointment.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Calculate refund amount
    const refundAmount = calculateRefund(
      paymentData,
      settings,
      hoursUntil,
      isNoShow
    );

    console.log(`📊 Cancellation calculation:
      - Hours until appointment: ${hoursUntil.toFixed(2)}
      - Paid amount: AED ${paymentData.paidAmount}
      - Refund amount: AED ${refundAmount}
      - Refund %: ${((refundAmount / paymentData.paidAmount) * 100).toFixed(0)}%
      - Is no-show: ${isNoShow}
    `);

    // Process refund if amount > 0
    let refundId: string | undefined;
    
    if (refundAmount > 0 && paymentData.paymentIntentId) {
      const refund = await stripeService.createRefund({
        paymentIntentId: paymentData.paymentIntentId,
        amount: stripeService.aedToFils(refundAmount),
        reason: isNoShow ? 'fraudulent' : 'requested_by_customer',
        metadata: {
          bookingId,
          cancelReason,
          refundPercent: (refundAmount / paymentData.paidAmount) * 100,
        },
      });

      refundId = refund.id;
    }

    // Update payment data
    paymentData.cancelled = true;
    paymentData.cancelledAt = new Date();
    paymentData.cancelReason = cancelReason;
    paymentData.refundAmount = refundAmount;
    paymentData.refundId = refundId;
    paymentData.noShow = isNoShow;
    
    if (isNoShow) {
      paymentData.noShowAt = new Date();
      paymentData.penaltyAmount = paymentData.paidAmount - refundAmount;
    }

    await kv.set(paymentKey, paymentData);

    console.log(`✅ Booking cancelled:
      - Booking ID: ${bookingId}
      - Refund: AED ${refundAmount}
      - Kept by salon: AED ${paymentData.paidAmount - refundAmount}
    `);

    return c.json({
      success: true,
      refundAmount,
      keptAmount: paymentData.paidAmount - refundAmount,
      refundPercent: (refundAmount / paymentData.paidAmount) * 100,
      refundId,
      message: refundAmount > 0 
        ? `AED ${refundAmount} will be refunded to your card in 3-5 business days`
        : 'No refund available for this cancellation',
    });
  } catch (error) {
    console.error('❌ Error cancelling booking:', error);
    return c.json({ 
      error: 'Failed to cancel booking',
      details: error.message 
    }, 500);
  }
});

// Reschedule booking
app.post(`${BASE_PATH}/bookings/:bookingId/reschedule`, async (c) => {
  try {
    const bookingId = c.req.param('bookingId');
    const { 
      currentAppointmentDate,
      newAppointmentDate,
      rescheduleCount = 0,
    } = await c.req.json();

    // Get payment data
    const paymentKey = `booking:${bookingId}:payment`;
    const paymentData = await kv.get(paymentKey) as BookingPayment;

    if (!paymentData) {
      return c.json({ error: 'Payment data not found' }, 404);
    }

    // Get salon deposit settings
    const settingsKey = `salon:${paymentData.salonId}:deposit:settings`;
    const settings = await kv.get(settingsKey) as SalonDepositSettings;

    if (!settings) {
      return c.json({ error: 'Deposit settings not found' }, 404);
    }

    // Check if reschedule is allowed
    const rescheduleCheck = canReschedule(
      {
        rescheduleCount,
        appointmentDate: new Date(currentAppointmentDate),
      },
      settings
    );

    if (!rescheduleCheck.canReschedule) {
      return c.json({ 
        error: rescheduleCheck.reason 
      }, 400);
    }

    // Reschedule is free - deposit transfers to new date
    console.log(`✅ Booking rescheduled:
      - Booking ID: ${bookingId}
      - Old date: ${currentAppointmentDate}
      - New date: ${newAppointmentDate}
      - Deposit (AED ${paymentData.paidAmount}) remains valid
    `);

    return c.json({
      success: true,
      message: 'Booking rescheduled successfully',
      depositTransferred: true,
      remainingReschedules: settings.cancellationPolicy.rescheduleLimit - rescheduleCount - 1,
    });
  } catch (error) {
    console.error('❌ Error rescheduling booking:', error);
    return c.json({ error: 'Failed to reschedule booking' }, 500);
  }
});

/**
 * Webhook Handler
 */

// Stripe webhook endpoint
app.post(`${BASE_PATH}/stripe/webhook`, async (c) => {
  try {
    const signature = c.req.header('stripe-signature');
    
    if (!signature) {
      return c.json({ error: 'No signature' }, 400);
    }

    const payload = await c.req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

    // Construct and verify event
    const event = stripeService.constructWebhookEvent(
      payload,
      signature,
      webhookSecret
    );

    // Handle event
    const result = await stripeService.handleWebhookEvent(event);

    return c.json({ received: true, result });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return c.json({ 
      error: 'Webhook handling failed',
      details: error.message 
    }, 400);
  }
});

export default app;
