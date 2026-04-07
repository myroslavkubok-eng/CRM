import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Helper function to send email notification
async function sendEmailNotification(to: string, subject: string, body: string) {
  // In production, integrate with SendGrid, AWS SES, or similar
  console.log('📧 Sending email:', { to, subject, body });
  
  // Example: Using a hypothetical email service
  // await fetch('https://api.emailservice.com/send', {
  //   method: 'POST',
  //   headers: { 'Authorization': `Bearer ${Deno.env.get('EMAIL_API_KEY')}` },
  //   body: JSON.stringify({ to, subject, body })
  // });
}

// Helper function to send SMS notification
async function sendSMSNotification(to: string, message: string) {
  // In production, integrate with Twilio, AWS SNS, or similar
  console.log('📱 Sending SMS:', { to, message });
  
  // Example: Using Twilio
  // await fetch('https://api.twilio.com/2010-04-01/Accounts/.../Messages.json', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Basic ${btoa(`${Deno.env.get('TWILIO_ACCOUNT_SID')}:${Deno.env.get('TWILIO_AUTH_TOKEN')}`)}`
  //   },
  //   body: new URLSearchParams({ To: to, From: '+1234567890', Body: message })
  // });
}

// Helper function to send push notification to salon dashboard
async function sendPushNotification(salonId: string, notification: any) {
  // In production, use WebSockets or Server-Sent Events
  console.log('🔔 Sending push notification:', { salonId, notification });
  
  // Store notification in KV for salon to retrieve
  const notificationKey = `notification:salon:${salonId}:${Date.now()}`;
  await kv.set(notificationKey, notification);
  
  // In real-time implementation, broadcast via WebSocket
  // broadcastToSalon(salonId, notification);
}

// RESCHEDULE BOOKING
app.post('/make-server-3e5c72fb/bookings/:id/reschedule', async (c) => {
  try {
    const bookingId = c.req.param('id');
    const { newDate, newTime, clientEmail, clientPhone, salonId, salonEmail, salonPhone } = await c.req.json();

    // 1. Validate booking exists
    const bookingKey = `booking:${bookingId}`;
    const existingBooking = await kv.get(bookingKey);
    
    if (!existingBooking) {
      return c.json({ error: 'Booking not found' }, 404);
    }

    // 2. Check for conflicts (prevent double booking)
    const newSlotKey = `calendar:${salonId}:${newDate}:${newTime}`;
    const existingSlot = await kv.get(newSlotKey);
    
    if (existingSlot && existingSlot.bookingId !== bookingId) {
      return c.json({ 
        error: 'Time slot not available',
        message: 'This time slot has already been booked. Please choose another time.'
      }, 409);
    }

    // 3. Free old time slot
    const oldSlotKey = `calendar:${salonId}:${existingBooking.date}:${existingBooking.time}`;
    await kv.del(oldSlotKey);

    // 4. Update booking
    const updatedBooking = {
      ...existingBooking,
      date: newDate,
      time: newTime,
      updatedAt: new Date().toISOString(),
      status: 'rescheduled',
    };
    await kv.set(bookingKey, updatedBooking);

    // 5. Reserve new time slot
    await kv.set(newSlotKey, {
      bookingId,
      salonId,
      date: newDate,
      time: newTime,
      status: 'booked',
    });

    // 6. Send notifications to client
    await sendEmailNotification(
      clientEmail,
      'Appointment Rescheduled',
      `Your appointment has been rescheduled to ${newDate} at ${newTime}. We'll see you then!`
    );
    
    if (clientPhone) {
      await sendSMSNotification(
        clientPhone,
        `Your appointment has been rescheduled to ${newDate} at ${newTime}.`
      );
    }

    // 7. Send notifications to salon
    await sendEmailNotification(
      salonEmail,
      'Booking Rescheduled - Action Required',
      `A client has rescheduled their appointment to ${newDate} at ${newTime}. Please update your calendar.`
    );
    
    if (salonPhone) {
      await sendSMSNotification(
        salonPhone,
        `Booking rescheduled: ${newDate} at ${newTime}. Check your dashboard for details.`
      );
    }

    // 8. Send push notification to salon dashboard
    await sendPushNotification(salonId, {
      type: 'booking_rescheduled',
      bookingId,
      oldDate: existingBooking.date,
      oldTime: existingBooking.time,
      newDate,
      newTime,
      clientName: existingBooking.clientName,
      service: existingBooking.service,
      timestamp: new Date().toISOString(),
    });

    return c.json({
      success: true,
      booking: updatedBooking,
      message: 'Booking rescheduled successfully. Notifications sent to all parties.',
    });

  } catch (error) {
    console.error('❌ Reschedule booking error:', error);
    return c.json({ 
      error: 'Failed to reschedule booking',
      details: error.message 
    }, 500);
  }
});

// CANCEL BOOKING
app.post('/make-server-3e5c72fb/bookings/:id/cancel', async (c) => {
  try {
    const bookingId = c.req.param('id');
    const { 
      reason, 
      clientEmail, 
      clientPhone, 
      salonId, 
      salonEmail, 
      salonPhone 
    } = await c.req.json();

    // 1. Validate booking exists
    const bookingKey = `booking:${bookingId}`;
    const existingBooking = await kv.get(bookingKey);
    
    if (!existingBooking) {
      return c.json({ error: 'Booking not found' }, 404);
    }

    if (existingBooking.status === 'cancelled') {
      return c.json({ error: 'Booking already cancelled' }, 400);
    }

    // 2. Calculate refund amount
    const bookingDate = new Date(existingBooking.date);
    const now = new Date();
    const hoursUntilBooking = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    let refundAmount = 0;
    let refundPercentage = 0;
    
    if (hoursUntilBooking > 24) {
      refundAmount = existingBooking.price;
      refundPercentage = 100;
    } else if (hoursUntilBooking > 12) {
      refundAmount = existingBooking.price * 0.5;
      refundPercentage = 50;
    }

    // 3. Update booking status
    const cancelledBooking = {
      ...existingBooking,
      status: 'cancelled',
      cancellationReason: reason,
      cancelledAt: new Date().toISOString(),
      refundAmount,
      refundPercentage,
    };
    await kv.set(bookingKey, cancelledBooking);

    // 4. Free time slot in salon calendar
    const slotKey = `calendar:${salonId}:${existingBooking.date}:${existingBooking.time}`;
    await kv.del(slotKey);

    // 5. Process refund (if applicable)
    if (refundAmount > 0) {
      // In production, integrate with Stripe refund API
      console.log('💰 Processing refund:', { bookingId, amount: refundAmount });
      
      // Example: Stripe refund
      // await fetch('https://api.stripe.com/v1/refunds', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${Deno.env.get('STRIPE_SECRET_KEY')}`,
      //     'Content-Type': 'application/x-www-form-urlencoded'
      //   },
      //   body: new URLSearchParams({
      //     charge: existingBooking.stripeChargeId,
      //     amount: (refundAmount * 100).toString()
      //   })
      // });
    }

    // 6. Send cancellation email to client
    const clientEmailBody = refundAmount > 0
      ? `Your appointment has been cancelled. A refund of $${refundAmount} (${refundPercentage}%) will be processed to your original payment method within 3-5 business days.`
      : `Your appointment has been cancelled. As per our cancellation policy, no refund will be issued for cancellations within 12 hours of the appointment.`;
    
    await sendEmailNotification(
      clientEmail,
      'Appointment Cancelled',
      clientEmailBody
    );
    
    if (clientPhone) {
      await sendSMSNotification(
        clientPhone,
        `Your appointment on ${existingBooking.date} at ${existingBooking.time} has been cancelled.`
      );
    }

    // 7. Notify salon
    await sendEmailNotification(
      salonEmail,
      'Booking Cancelled - Time Slot Now Available',
      `A client has cancelled their appointment for ${existingBooking.date} at ${existingBooking.time}. This time slot is now available for new bookings.\n\nReason: ${reason}`
    );
    
    if (salonPhone) {
      await sendSMSNotification(
        salonPhone,
        `Booking cancelled: ${existingBooking.date} at ${existingBooking.time}. Slot now available.`
      );
    }

    // 8. Send push notification to salon dashboard
    await sendPushNotification(salonId, {
      type: 'booking_cancelled',
      bookingId,
      date: existingBooking.date,
      time: existingBooking.time,
      clientName: existingBooking.clientName,
      service: existingBooking.service,
      reason,
      timestamp: new Date().toISOString(),
    });

    return c.json({
      success: true,
      booking: cancelledBooking,
      refundAmount,
      refundPercentage,
      message: 'Booking cancelled successfully. Notifications sent to all parties.',
    });

  } catch (error) {
    console.error('❌ Cancel booking error:', error);
    return c.json({ 
      error: 'Failed to cancel booking',
      details: error.message 
    }, 500);
  }
});

// CHECK AVAILABILITY (prevent double booking)
app.get('/make-server-3e5c72fb/salons/:salonId/availability', async (c) => {
  try {
    const salonId = c.req.param('salonId');
    const date = c.req.query('date');
    
    if (!date) {
      return c.json({ error: 'Date parameter required' }, 400);
    }

    // Get all bookings for this salon on the specified date
    const prefix = `calendar:${salonId}:${date}:`;
    const bookedSlots = await kv.getByPrefix(prefix);
    
    // Extract booked times
    const bookedTimes = bookedSlots.map((slot: any) => {
      const parts = slot.key.split(':');
      return parts[parts.length - 1]; // Get the time part
    });

    return c.json({
      success: true,
      date,
      bookedSlots: bookedTimes,
      availableSlots: [], // Frontend will calculate available slots
    });

  } catch (error) {
    console.error('❌ Check availability error:', error);
    return c.json({ 
      error: 'Failed to check availability',
      details: error.message 
    }, 500);
  }
});

// GET SALON NOTIFICATIONS
app.get('/make-server-3e5c72fb/salons/:salonId/notifications', async (c) => {
  try {
    const salonId = c.req.param('salonId');
    const limit = parseInt(c.req.query('limit') || '20');

    // Get recent notifications for this salon
    const prefix = `notification:salon:${salonId}:`;
    const notifications = await kv.getByPrefix(prefix);
    
    // Sort by timestamp (newest first) and limit
    const sortedNotifications = notifications
      .sort((a: any, b: any) => {
        const timeA = parseInt(a.key.split(':').pop());
        const timeB = parseInt(b.key.split(':').pop());
        return timeB - timeA;
      })
      .slice(0, limit);

    return c.json({
      success: true,
      notifications: sortedNotifications,
      count: sortedNotifications.length,
    });

  } catch (error) {
    console.error('❌ Get notifications error:', error);
    return c.json({ 
      error: 'Failed to get notifications',
      details: error.message 
    }, 500);
  }
});

// MARK NOTIFICATION AS READ
app.post('/make-server-3e5c72fb/notifications/:id/read', async (c) => {
  try {
    const notificationId = c.req.param('id');
    
    const notification = await kv.get(notificationId);
    if (!notification) {
      return c.json({ error: 'Notification not found' }, 404);
    }

    await kv.set(notificationId, {
      ...notification,
      read: true,
      readAt: new Date().toISOString(),
    });

    return c.json({ success: true });

  } catch (error) {
    console.error('❌ Mark notification as read error:', error);
    return c.json({ 
      error: 'Failed to mark notification as read',
      details: error.message 
    }, 500);
  }
});

export default app;
