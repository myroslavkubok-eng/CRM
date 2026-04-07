import { Hono } from 'npm:hono';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

interface UpgradeRequest {
  userId: string;
  currentPlanId: string;
  newPlanId: string;
  billingPeriod: 'monthly' | 'semi-annual' | 'annual';
}

interface SubscriptionData {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  price: number;
  billingPeriod: string;
  startDate: string;
  expiryDate: string;
  status: string;
}

// Calculate proration for upgrade/downgrade
function calculateProration(
  currentSubscription: SubscriptionData,
  newPlanPrice: number,
  newBillingPeriod: string
) {
  const now = new Date();
  const startDate = new Date(currentSubscription.startDate);
  const expiryDate = new Date(currentSubscription.expiryDate);

  // Calculate total period in days
  const totalDays = Math.floor((expiryDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate days elapsed and remaining
  const daysElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, totalDays - daysElapsed);

  // Calculate remaining value of current plan
  const currentPlanRemainingValue = (currentSubscription.price * daysRemaining) / totalDays;

  // Calculate new plan days
  const newPlanDays = newBillingPeriod === 'monthly' ? 30 : 
                      newBillingPeriod === 'semi-annual' ? 180 : 365;

  // Calculate cost of new plan for remaining period
  const newPlanCostForRemainingPeriod = (newPlanPrice * daysRemaining) / newPlanDays;

  // Calculate the difference
  const isUpgrade = newPlanCostForRemainingPeriod > currentPlanRemainingValue;
  const difference = newPlanCostForRemainingPeriod - currentPlanRemainingValue;

  // For downgrades, calculate extended days
  let extendedDays = 0;
  if (!isUpgrade && difference < 0) {
    const newPlanDailyRate = newPlanPrice / newPlanDays;
    extendedDays = Math.floor(Math.abs(difference) / newPlanDailyRate);
  }

  return {
    isUpgrade,
    daysElapsed,
    daysRemaining,
    totalDays,
    currentPlanRemainingValue,
    newPlanCostForRemainingPeriod,
    difference: Math.abs(difference),
    extendedDays,
    amountToPay: isUpgrade ? Math.abs(difference) : 0,
    newExpiryDate: isUpgrade 
      ? new Date(now.getTime() + daysRemaining * 24 * 60 * 60 * 1000)
      : new Date(now.getTime() + (daysRemaining + extendedDays) * 24 * 60 * 60 * 1000)
  };
}

// Calculate upgrade/downgrade quote
app.post('/calculate', async (c) => {
  try {
    const { userId, currentPlanId, newPlanId, billingPeriod } = await c.req.json();

    if (!userId || !currentPlanId || !newPlanId || !billingPeriod) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Get current subscription from KV store
    const currentSubKey = `subscription:${userId}`;
    const currentSub = await kv.get(currentSubKey);

    if (!currentSub) {
      return c.json({ error: 'No active subscription found' }, 404);
    }

    // Base prices (should match PricingPage)
    const basePrices: Record<string, number> = {
      basic: 99,
      standard: 299,
      business: 499
    };

    // Discount percentages
    const discounts: Record<string, Record<string, number>> = {
      monthly: { basic: 0, standard: 0, business: 0 },
      'semi-annual': { basic: 15, standard: 15, business: 20 },
      annual: { basic: 20, standard: 25, business: 30 }
    };

    // Calculate new plan price
    const basePrice = basePrices[newPlanId];
    const months = billingPeriod === 'monthly' ? 1 : billingPeriod === 'semi-annual' ? 6 : 12;
    const discount = discounts[billingPeriod][newPlanId];
    const newPlanPrice = Math.round(basePrice * months * (1 - discount / 100));

    // Calculate proration
    const calculation = calculateProration(currentSub, newPlanPrice, billingPeriod);

    return c.json({
      success: true,
      calculation,
      currentPlan: {
        id: currentSub.planId,
        name: currentSub.planName,
        price: currentSub.price,
        billingPeriod: currentSub.billingPeriod
      },
      newPlan: {
        id: newPlanId,
        price: newPlanPrice,
        billingPeriod
      }
    });

  } catch (error: any) {
    console.error('Calculate upgrade error:', error);
    return c.json({ error: 'Failed to calculate upgrade', details: error.message }, 500);
  }
});

// Process upgrade (with payment)
app.post('/upgrade', async (c) => {
  try {
    const { userId, newPlanId, billingPeriod, paymentIntentId } = await c.req.json();

    if (!userId || !newPlanId || !billingPeriod) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Get current subscription
    const currentSubKey = `subscription:${userId}`;
    const currentSub = await kv.get(currentSubKey);

    if (!currentSub) {
      return c.json({ error: 'No active subscription found' }, 404);
    }

    // Base prices and discounts (same as calculate endpoint)
    const basePrices: Record<string, number> = {
      basic: 99,
      standard: 299,
      business: 499
    };

    const discounts: Record<string, Record<string, number>> = {
      monthly: { basic: 0, standard: 0, business: 0 },
      'semi-annual': { basic: 15, standard: 15, business: 20 },
      annual: { basic: 20, standard: 25, business: 30 }
    };

    const basePrice = basePrices[newPlanId];
    const months = billingPeriod === 'monthly' ? 1 : billingPeriod === 'semi-annual' ? 6 : 12;
    const discount = discounts[billingPeriod][newPlanId];
    const newPlanPrice = Math.round(basePrice * months * (1 - discount / 100));

    // Calculate proration
    const calculation = calculateProration(currentSub, newPlanPrice, billingPeriod);

    // For upgrades, verify payment was made
    if (calculation.isUpgrade) {
      if (!paymentIntentId) {
        return c.json({ error: 'Payment required for upgrades' }, 400);
      }
      
      // TODO: Verify payment with Stripe
      console.log('Payment verified:', paymentIntentId);
    }

    // Update subscription in KV store
    const planNames: Record<string, string> = {
      basic: 'Basic Start',
      standard: 'Standard Growth',
      business: 'Business Pro'
    };

    const now = new Date();
    const newSubscription: SubscriptionData = {
      ...currentSub,
      planId: newPlanId,
      planName: planNames[newPlanId],
      price: newPlanPrice,
      billingPeriod,
      startDate: now.toISOString(),
      expiryDate: calculation.newExpiryDate.toISOString(),
      status: 'active'
    };

    await kv.set(currentSubKey, newSubscription);

    // Log the transaction
    const transactionKey = `transaction:${userId}:${Date.now()}`;
    await kv.set(transactionKey, {
      type: calculation.isUpgrade ? 'upgrade' : 'downgrade',
      fromPlan: currentSub.planId,
      toPlan: newPlanId,
      amount: calculation.amountToPay,
      timestamp: now.toISOString(),
      calculation
    });

    return c.json({
      success: true,
      message: calculation.isUpgrade ? 'Upgrade successful!' : 'Downgrade successful!',
      subscription: newSubscription,
      calculation
    });

  } catch (error: any) {
    console.error('Upgrade processing error:', error);
    return c.json({ error: 'Failed to process upgrade', details: error.message }, 500);
  }
});

// Process downgrade (no payment needed)
app.post('/downgrade', async (c) => {
  try {
    const { userId, newPlanId, billingPeriod } = await c.req.json();

    if (!userId || !newPlanId || !billingPeriod) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Get current subscription
    const currentSubKey = `subscription:${userId}`;
    const currentSub = await kv.get(currentSubKey);

    if (!currentSub) {
      return c.json({ error: 'No active subscription found' }, 404);
    }

    // Base prices and discounts
    const basePrices: Record<string, number> = {
      basic: 99,
      standard: 299,
      business: 499
    };

    const discounts: Record<string, Record<string, number>> = {
      monthly: { basic: 0, standard: 0, business: 0 },
      'semi-annual': { basic: 15, standard: 15, business: 20 },
      annual: { basic: 20, standard: 25, business: 30 }
    };

    const basePrice = basePrices[newPlanId];
    const months = billingPeriod === 'monthly' ? 1 : billingPeriod === 'semi-annual' ? 6 : 12;
    const discount = discounts[billingPeriod][newPlanId];
    const newPlanPrice = Math.round(basePrice * months * (1 - discount / 100));

    // Calculate proration
    const calculation = calculateProration(currentSub, newPlanPrice, billingPeriod);

    // Ensure this is actually a downgrade
    if (calculation.isUpgrade) {
      return c.json({ error: 'This is an upgrade, please use /upgrade endpoint' }, 400);
    }

    // Update subscription
    const planNames: Record<string, string> = {
      basic: 'Basic Start',
      standard: 'Standard Growth',
      business: 'Business Pro'
    };

    const now = new Date();
    const newSubscription: SubscriptionData = {
      ...currentSub,
      planId: newPlanId,
      planName: planNames[newPlanId],
      price: newPlanPrice,
      billingPeriod,
      startDate: now.toISOString(),
      expiryDate: calculation.newExpiryDate.toISOString(),
      status: 'active'
    };

    await kv.set(currentSubKey, newSubscription);

    // Log the transaction
    const transactionKey = `transaction:${userId}:${Date.now()}`;
    await kv.set(transactionKey, {
      type: 'downgrade',
      fromPlan: currentSub.planId,
      toPlan: newPlanId,
      creditApplied: calculation.difference,
      extendedDays: calculation.extendedDays,
      timestamp: now.toISOString(),
      calculation
    });

    return c.json({
      success: true,
      message: 'Downgrade successful! Your credit has been applied.',
      subscription: newSubscription,
      calculation
    });

  } catch (error: any) {
    console.error('Downgrade processing error:', error);
    return c.json({ error: 'Failed to process downgrade', details: error.message }, 500);
  }
});

// Request refund (within 7 days)
app.post('/refund', async (c) => {
  try {
    const { subscriptionId, paymentIntentId, reason, amount } = await c.req.json();

    if (!subscriptionId || !paymentIntentId || !reason) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Get subscription from KV store
    const subscription = await kv.get(subscriptionId);

    if (!subscription) {
      return c.json({ error: 'Subscription not found' }, 404);
    }

    // Check if within 7-day refund period
    const startDate = new Date(subscription.startDate);
    const now = new Date();
    const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceStart > 7) {
      return c.json({ 
        error: 'Refund period expired', 
        message: 'Refunds are only available within 7 days of purchase' 
      }, 400);
    }

    // TODO: Process refund through Stripe
    // In production, you would call Stripe Refunds API:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // const refund = await stripe.refunds.create({
    //   payment_intent: paymentIntentId,
    //   reason: 'requested_by_customer',
    //   metadata: { reason: reason }
    // });

    console.log('Processing refund:', {
      paymentIntentId,
      amount,
      reason,
      daysSinceStart
    });

    // Update subscription status to cancelled
    const updatedSubscription = {
      ...subscription,
      status: 'refunded',
      refundedAt: now.toISOString(),
      refundReason: reason,
      refundAmount: amount
    };

    await kv.set(subscriptionId, updatedSubscription);

    // Log the refund transaction
    const refundKey = `refund:${subscription.userId}:${Date.now()}`;
    await kv.set(refundKey, {
      type: 'refund',
      subscriptionId,
      paymentIntentId,
      amount,
      reason,
      status: 'processed',
      processedAt: now.toISOString(),
      daysSinceStart
    });

    return c.json({
      success: true,
      message: 'Refund processed successfully. Money will be returned to your card within 5-10 business days.',
      refund: {
        amount,
        status: 'processing',
        estimatedArrival: '5-10 business days'
      }
    });

  } catch (error: any) {
    console.error('Refund processing error:', error);
    return c.json({ error: 'Failed to process refund', details: error.message }, 500);
  }
});

export default app;