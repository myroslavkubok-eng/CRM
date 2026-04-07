/**
 * Stripe Service - Stripe Connect & Payment Processing
 * 
 * Handles:
 * - Stripe Connect account creation & management
 * - Payment Intent creation for deposits/full payments
 * - Refund processing based on cancellation policy
 * - Webhook event handling
 */

import Stripe from 'npm:stripe@14.11.0';

// Initialize Stripe with secret key
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const PLATFORM_FEE_PERCENT = 3; // 3% platform fee

/**
 * Stripe Connect Account Management
 */

/**
 * Create a Stripe Connect account for a salon
 */
export async function createConnectAccount(params: {
  salonId: string;
  ownerId: string;
  email: string;
  businessName: string;
  country?: string;
}) {
  try {
    // Create Connect account
    const account = await stripe.accounts.create({
      type: 'standard', // Standard account - full control for salon owner
      email: params.email,
      business_type: 'individual', // or 'company'
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      metadata: {
        salonId: params.salonId,
        ownerId: params.ownerId,
      },
    });

    console.log('✅ Created Stripe Connect account:', account.id);
    return account;
  } catch (error) {
    console.error('❌ Error creating Connect account:', error);
    throw error;
  }
}

/**
 * Create onboarding link for Connect account
 */
export async function createAccountLink(params: {
  accountId: string;
  returnUrl: string;
  refreshUrl: string;
}) {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: params.accountId,
      refresh_url: params.refreshUrl,
      return_url: params.returnUrl,
      type: 'account_onboarding',
    });

    console.log('✅ Created account onboarding link');
    return accountLink;
  } catch (error) {
    console.error('❌ Error creating account link:', error);
    throw error;
  }
}

/**
 * Get Connect account status
 */
export async function getAccountStatus(accountId: string) {
  try {
    const account = await stripe.accounts.retrieve(accountId);

    return {
      accountId: account.id,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      requirementsNeeded: account.requirements?.currently_due || [],
      requirementsPending: account.requirements?.eventually_due || [],
      detailsSubmitted: account.details_submitted,
    };
  } catch (error) {
    console.error('❌ Error fetching account status:', error);
    throw error;
  }
}

/**
 * Delete/Disconnect Connect account
 */
export async function deleteConnectAccount(accountId: string) {
  try {
    await stripe.accounts.del(accountId);
    console.log('✅ Deleted Connect account:', accountId);
  } catch (error) {
    console.error('❌ Error deleting account:', error);
    throw error;
  }
}

/**
 * Payment Processing
 */

/**
 * Create Payment Intent for deposit or full payment
 */
export async function createPaymentIntent(params: {
  amount: number; // Amount in smallest currency unit (fils for AED)
  currency: string; // 'aed'
  salonStripeAccountId: string;
  customerId?: string;
  metadata: {
    bookingId: string;
    salonId: string;
    paymentType: 'deposit' | 'full' | 'remaining';
    clientEmail: string;
  };
  applicationFeeAmount?: number; // Platform fee
}) {
  try {
    // Calculate platform fee (3% of amount)
    const platformFee = params.applicationFeeAmount || 
      Math.round(params.amount * (PLATFORM_FEE_PERCENT / 100));

    const paymentIntent = await stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency.toLowerCase(),
      
      // Connect account to receive funds
      transfer_data: {
        destination: params.salonStripeAccountId,
      },
      
      // Platform fee
      application_fee_amount: platformFee,
      
      // Customer
      customer: params.customerId,
      
      // Metadata
      metadata: params.metadata,
      
      // Payment methods
      payment_method_types: ['card'],
      
      // Automatic confirmation
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    console.log('✅ Created Payment Intent:', paymentIntent.id);
    console.log(`   Amount: ${params.amount} ${params.currency}`);
    console.log(`   Platform fee: ${platformFee} ${params.currency}`);
    console.log(`   Salon receives: ${params.amount - platformFee} ${params.currency}`);

    return paymentIntent;
  } catch (error) {
    console.error('❌ Error creating Payment Intent:', error);
    throw error;
  }
}

/**
 * Confirm Payment Intent
 */
export async function confirmPaymentIntent(
  paymentIntentId: string,
  paymentMethodId: string
) {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });

    console.log('✅ Confirmed Payment Intent:', paymentIntent.id);
    return paymentIntent;
  } catch (error) {
    console.error('❌ Error confirming Payment Intent:', error);
    throw error;
  }
}

/**
 * Get Payment Intent status
 */
export async function getPaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('❌ Error fetching Payment Intent:', error);
    throw error;
  }
}

/**
 * Refund Processing
 */

/**
 * Create refund for a payment
 */
export async function createRefund(params: {
  paymentIntentId: string;
  amount?: number; // Optional - partial refund. If not provided, full refund
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
  metadata?: {
    bookingId: string;
    cancelReason: string;
    refundPercent: number;
  };
}) {
  try {
    // Get the charge ID from Payment Intent
    const paymentIntent = await stripe.paymentIntents.retrieve(params.paymentIntentId);
    
    if (!paymentIntent.latest_charge) {
      throw new Error('No charge found for this Payment Intent');
    }

    // Create refund
    const refund = await stripe.refunds.create({
      charge: paymentIntent.latest_charge as string,
      amount: params.amount, // If undefined, full refund
      reason: params.reason || 'requested_by_customer',
      metadata: params.metadata,
    });

    console.log('✅ Created refund:', refund.id);
    console.log(`   Amount: ${refund.amount} ${refund.currency}`);
    console.log(`   Status: ${refund.status}`);

    return refund;
  } catch (error) {
    console.error('❌ Error creating refund:', error);
    throw error;
  }
}

/**
 * Get refund status
 */
export async function getRefund(refundId: string) {
  try {
    const refund = await stripe.refunds.retrieve(refundId);
    return refund;
  } catch (error) {
    console.error('❌ Error fetching refund:', error);
    throw error;
  }
}

/**
 * Customer Management
 */

/**
 * Create or retrieve Stripe customer
 */
export async function getOrCreateCustomer(params: {
  email: string;
  name: string;
  userId: string;
}) {
  try {
    // Search for existing customer
    const existingCustomers = await stripe.customers.list({
      email: params.email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      console.log('✅ Found existing customer:', existingCustomers.data[0].id);
      return existingCustomers.data[0];
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email: params.email,
      name: params.name,
      metadata: {
        userId: params.userId,
      },
    });

    console.log('✅ Created new customer:', customer.id);
    return customer;
  } catch (error) {
    console.error('❌ Error with customer:', error);
    throw error;
  }
}

/**
 * Webhook Handling
 */

/**
 * Construct webhook event from request
 */
export function constructWebhookEvent(
  payload: string,
  signature: string,
  webhookSecret: string
) {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );
    return event;
  } catch (error) {
    console.error('❌ Webhook signature verification failed:', error);
    throw error;
  }
}

/**
 * Handle webhook events
 */
export async function handleWebhookEvent(event: Stripe.Event) {
  console.log('📨 Webhook event received:', event.type);

  switch (event.type) {
    // Payment succeeded
    case 'payment_intent.succeeded':
      return await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);

    // Payment failed
    case 'payment_intent.payment_failed':
      return await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);

    // Refund processed
    case 'charge.refunded':
      return await handleRefundProcessed(event.data.object as Stripe.Charge);

    // Connect account updated
    case 'account.updated':
      return await handleAccountUpdated(event.data.object as Stripe.Account);

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
      return { received: true };
  }
}

/**
 * Handle payment success
 */
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log('✅ Payment succeeded:', paymentIntent.id);
  
  const metadata = paymentIntent.metadata;
  
  // TODO: Update booking in database
  // - Set payment status to 'paid'
  // - Store payment intent ID
  // - Send confirmation email
  
  return {
    bookingId: metadata.bookingId,
    status: 'paid',
    amount: paymentIntent.amount,
  };
}

/**
 * Handle payment failure
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('❌ Payment failed:', paymentIntent.id);
  
  const metadata = paymentIntent.metadata;
  
  // TODO: Update booking in database
  // - Set payment status to 'failed'
  // - Send failure notification
  
  return {
    bookingId: metadata.bookingId,
    status: 'failed',
    error: paymentIntent.last_payment_error?.message,
  };
}

/**
 * Handle refund processed
 */
async function handleRefundProcessed(charge: Stripe.Charge) {
  console.log('💰 Refund processed for charge:', charge.id);
  
  // TODO: Update booking in database
  // - Set payment status to 'refunded'
  // - Update refund amount
  // - Send refund confirmation email
  
  return {
    chargeId: charge.id,
    refunded: charge.refunded,
    amountRefunded: charge.amount_refunded,
  };
}

/**
 * Handle account updated
 */
async function handleAccountUpdated(account: Stripe.Account) {
  console.log('🔄 Connect account updated:', account.id);
  
  // TODO: Update salon in database
  // - Update charges_enabled status
  // - Update payouts_enabled status
  // - Update requirements
  
  return {
    accountId: account.id,
    chargesEnabled: account.charges_enabled,
    payoutsEnabled: account.payouts_enabled,
  };
}

/**
 * Utility Functions
 */

/**
 * Convert AED to fils (smallest unit)
 */
export function aedToFils(aed: number): number {
  return Math.round(aed * 100);
}

/**
 * Convert fils to AED
 */
export function filsToAed(fils: number): number {
  return fils / 100;
}

/**
 * Calculate platform fee
 */
export function calculatePlatformFee(amount: number, feePercent: number = PLATFORM_FEE_PERCENT): number {
  return Math.round(amount * (feePercent / 100));
}

/**
 * Validate Stripe account can accept payments
 */
export async function validateAccountCanAcceptPayments(accountId: string): Promise<{
  valid: boolean;
  errors: string[];
}> {
  try {
    const account = await stripe.accounts.retrieve(accountId);
    
    const errors: string[] = [];
    
    if (!account.charges_enabled) {
      errors.push('Charges not enabled for this account');
    }
    
    if (!account.payouts_enabled) {
      errors.push('Payouts not enabled for this account');
    }
    
    if (account.requirements?.currently_due && account.requirements.currently_due.length > 0) {
      errors.push(`Missing requirements: ${account.requirements.currently_due.join(', ')}`);
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  } catch (error) {
    return {
      valid: false,
      errors: ['Failed to validate account'],
    };
  }
}
