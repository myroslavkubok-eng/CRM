/**
 * Payment Tracking System
 * 
 * Tracks all payments for bookings:
 * - Deposit payments
 * - Full payments
 * - Partial payments
 * - Payment history
 * - Remaining amounts
 */

import { Hono } from 'npm:hono@3.11.7';
import * as kv from './kv_store.tsx';

const app = new Hono();
const BASE_PATH = '/make-server-3e5c72fb';

interface PaymentRecord {
  id: string;
  bookingId: string;
  clientId: string;
  salonId: string;
  
  amount: number;
  method: 'card' | 'cash' | 'link' | 'stripe';
  type: 'deposit' | 'full_payment' | 'partial_payment';
  
  paidAt: Date;
  transactionId?: string;
  stripePaymentIntentId?: string;
  
  note?: string;
  processedBy?: string; // Staff ID who processed
  processedByName?: string;
}

interface PaymentInfo {
  depositPaid: boolean;
  depositAmount: number;
  depositMethod?: 'card' | 'cash' | 'link' | 'stripe';
  depositPaidAt?: Date;
  depositTransactionId?: string;
  
  fullPaymentPaid: boolean;
  totalPaid: number;
  
  totalAmount: number;
  remainingAmount: number;
  
  paymentHistory: PaymentRecord[];
}

/**
 * Get payment info for a booking
 */
app.get(`${BASE_PATH}/bookings/:bookingId/payment-info`, async (c) => {
  try {
    const bookingId = c.req.param('bookingId');

    // Get booking
    const bookingKey = `booking:${bookingId}`;
    const booking = await kv.get(bookingKey) as any;

    if (!booking) {
      return c.json({ error: 'Booking not found' }, 404);
    }

    // Get payment history
    const paymentHistoryKey = `booking:${bookingId}:payments`;
    const paymentHistory = (await kv.get(paymentHistoryKey) as PaymentRecord[]) || [];

    // Calculate totals
    const totalPaid = paymentHistory.reduce((sum, p) => sum + p.amount, 0);
    const totalAmount = booking.totalAmount || booking.servicePrice || 0;
    const remainingAmount = Math.max(0, totalAmount - totalPaid);

    // Find deposit payment
    const depositPayment = paymentHistory.find(p => p.type === 'deposit');

    // Check if fully paid
    const fullPaymentPaid = remainingAmount === 0;

    const paymentInfo: PaymentInfo = {
      depositPaid: !!depositPayment,
      depositAmount: depositPayment?.amount || booking.depositAmount || 0,
      depositMethod: depositPayment?.method,
      depositPaidAt: depositPayment?.paidAt,
      depositTransactionId: depositPayment?.transactionId,
      
      fullPaymentPaid,
      totalPaid,
      
      totalAmount,
      remainingAmount,
      
      paymentHistory: paymentHistory.sort((a, b) => 
        new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
      ),
    };

    return c.json({
      success: true,
      bookingId,
      paymentInfo,
    });
  } catch (error) {
    console.error('❌ Error getting payment info:', error);
    return c.json({ error: 'Failed to get payment info' }, 500);
  }
});

/**
 * Record a payment
 */
app.post(`${BASE_PATH}/bookings/:bookingId/record-payment`, async (c) => {
  try {
    const bookingId = c.req.param('bookingId');
    const {
      amount,
      method,
      type,
      transactionId,
      note,
      processedBy,
      processedByName,
    } = await c.req.json();

    // Validate
    if (!amount || amount <= 0) {
      return c.json({ error: 'Invalid amount' }, 400);
    }

    if (!method || !['card', 'cash', 'link', 'stripe'].includes(method)) {
      return c.json({ error: 'Invalid payment method' }, 400);
    }

    // Get booking
    const bookingKey = `booking:${bookingId}`;
    const booking = await kv.get(bookingKey) as any;

    if (!booking) {
      return c.json({ error: 'Booking not found' }, 404);
    }

    // Create payment record
    const paymentId = `payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const payment: PaymentRecord = {
      id: paymentId,
      bookingId,
      clientId: booking.clientId,
      salonId: booking.salonId,
      amount,
      method,
      type: type || 'partial_payment',
      paidAt: new Date(),
      transactionId,
      note,
      processedBy,
      processedByName,
    };

    // Save to payment history
    const paymentHistoryKey = `booking:${bookingId}:payments`;
    const paymentHistory = (await kv.get(paymentHistoryKey) as PaymentRecord[]) || [];
    paymentHistory.push(payment);
    await kv.set(paymentHistoryKey, paymentHistory);

    // Update booking's payment status
    const totalPaid = paymentHistory.reduce((sum, p) => sum + p.amount, 0);
    const totalAmount = booking.totalAmount || booking.servicePrice || 0;
    const remainingAmount = Math.max(0, totalAmount - totalPaid);

    booking.totalPaid = totalPaid;
    booking.remainingAmount = remainingAmount;
    booking.paymentStatus = remainingAmount === 0 ? 'paid' : 'partial';
    booking.updatedAt = new Date();

    await kv.set(bookingKey, booking);

    console.log(`💰 Payment recorded: ${bookingId}`);
    console.log(`   Amount: ${amount}`);
    console.log(`   Method: ${method}`);
    console.log(`   Type: ${type}`);
    console.log(`   Total paid: ${totalPaid}`);
    console.log(`   Remaining: ${remainingAmount}`);

    return c.json({
      success: true,
      payment,
      totalPaid,
      remainingAmount,
      fullyPaid: remainingAmount === 0,
    });
  } catch (error) {
    console.error('❌ Error recording payment:', error);
    return c.json({ error: 'Failed to record payment' }, 500);
  }
});

/**
 * Get all payments for a client
 */
app.get(`${BASE_PATH}/clients/:clientId/payment-history`, async (c) => {
  try {
    const clientId = c.req.param('clientId');

    // Get all client bookings
    const clientBookingsKey = `client:${clientId}:bookings`;
    const bookingIds = (await kv.get(clientBookingsKey) as string[]) || [];

    // Get payments for all bookings
    const allPayments: PaymentRecord[] = [];

    for (const bookingId of bookingIds) {
      const paymentHistoryKey = `booking:${bookingId}:payments`;
      const payments = (await kv.get(paymentHistoryKey) as PaymentRecord[]) || [];
      allPayments.push(...payments);
    }

    // Sort by date
    allPayments.sort((a, b) => 
      new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
    );

    // Calculate stats
    const totalSpent = allPayments.reduce((sum, p) => sum + p.amount, 0);
    const paymentsByMethod = {
      card: allPayments.filter(p => p.method === 'card').reduce((sum, p) => sum + p.amount, 0),
      cash: allPayments.filter(p => p.method === 'cash').reduce((sum, p) => sum + p.amount, 0),
      link: allPayments.filter(p => p.method === 'link').reduce((sum, p) => sum + p.amount, 0),
      stripe: allPayments.filter(p => p.method === 'stripe').reduce((sum, p) => sum + p.amount, 0),
    };

    return c.json({
      success: true,
      clientId,
      payments: allPayments,
      totalPayments: allPayments.length,
      totalSpent,
      paymentsByMethod,
    });
  } catch (error) {
    console.error('❌ Error getting client payment history:', error);
    return c.json({ error: 'Failed to get payment history' }, 500);
  }
});

/**
 * Get salon's payment summary for a date range
 */
app.get(`${BASE_PATH}/salons/:salonId/payments/summary`, async (c) => {
  try {
    const salonId = c.req.param('salonId');
    const { startDate, endDate } = c.req.query();

    if (!startDate || !endDate) {
      return c.json({ error: 'Start date and end date required' }, 400);
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get all bookings for salon
    const salonBookingsKey = `salon:${salonId}:bookings:all`;
    const bookingIds = (await kv.get(salonBookingsKey) as string[]) || [];

    // Get all payments
    const allPayments: PaymentRecord[] = [];

    for (const bookingId of bookingIds) {
      const paymentHistoryKey = `booking:${bookingId}:payments`;
      const payments = (await kv.get(paymentHistoryKey) as PaymentRecord[]) || [];
      allPayments.push(...payments);
    }

    // Filter by date range
    const paymentsInRange = allPayments.filter(p => {
      const paymentDate = new Date(p.paidAt);
      return paymentDate >= start && paymentDate <= end;
    });

    // Calculate summary
    const totalRevenue = paymentsInRange.reduce((sum, p) => sum + p.amount, 0);
    const totalTransactions = paymentsInRange.length;

    const byMethod = {
      card: paymentsInRange.filter(p => p.method === 'card').reduce((sum, p) => sum + p.amount, 0),
      cash: paymentsInRange.filter(p => p.method === 'cash').reduce((sum, p) => sum + p.amount, 0),
      link: paymentsInRange.filter(p => p.method === 'link').reduce((sum, p) => sum + p.amount, 0),
      stripe: paymentsInRange.filter(p => p.method === 'stripe').reduce((sum, p) => sum + p.amount, 0),
    };

    const byType = {
      deposit: paymentsInRange.filter(p => p.type === 'deposit').reduce((sum, p) => sum + p.amount, 0),
      fullPayment: paymentsInRange.filter(p => p.type === 'full_payment').reduce((sum, p) => sum + p.amount, 0),
      partial: paymentsInRange.filter(p => p.type === 'partial_payment').reduce((sum, p) => sum + p.amount, 0),
    };

    return c.json({
      success: true,
      salonId,
      dateRange: {
        start: startDate,
        end: endDate,
      },
      summary: {
        totalRevenue,
        totalTransactions,
        averageTransaction: totalTransactions > 0 ? totalRevenue / totalTransactions : 0,
        byMethod,
        byType,
      },
      payments: paymentsInRange.sort((a, b) => 
        new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
      ),
    });
  } catch (error) {
    console.error('❌ Error getting payment summary:', error);
    return c.json({ error: 'Failed to get payment summary' }, 500);
  }
});

/**
 * Get unpaid bookings for salon
 */
app.get(`${BASE_PATH}/salons/:salonId/unpaid-bookings`, async (c) => {
  try {
    const salonId = c.req.param('salonId');

    // Get all salon bookings
    const salonBookingsKey = `salon:${salonId}:bookings:all`;
    const bookingIds = (await kv.get(salonBookingsKey) as string[]) || [];

    const unpaidBookings = [];

    for (const bookingId of bookingIds) {
      const booking = await kv.get(`booking:${bookingId}`) as any;
      if (!booking) continue;

      // Skip cancelled/declined
      if (['cancelled', 'declined', 'expired'].includes(booking.status)) {
        continue;
      }

      // Get payment info
      const paymentHistoryKey = `booking:${bookingId}:payments`;
      const payments = (await kv.get(paymentHistoryKey) as PaymentRecord[]) || [];
      
      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
      const totalAmount = booking.totalAmount || booking.servicePrice || 0;
      const remainingAmount = totalAmount - totalPaid;

      if (remainingAmount > 0) {
        unpaidBookings.push({
          booking,
          totalAmount,
          totalPaid,
          remainingAmount,
          paymentHistory: payments,
        });
      }
    }

    // Sort by remaining amount (highest first)
    unpaidBookings.sort((a, b) => b.remainingAmount - a.remainingAmount);

    const totalUnpaid = unpaidBookings.reduce((sum, b) => sum + b.remainingAmount, 0);

    return c.json({
      success: true,
      salonId,
      unpaidBookings,
      count: unpaidBookings.length,
      totalUnpaid,
    });
  } catch (error) {
    console.error('❌ Error getting unpaid bookings:', error);
    return c.json({ error: 'Failed to get unpaid bookings' }, 500);
  }
});

export default app;
