/**
 * Booking Workflow Routes
 * 
 * Handles:
 * - Booking creation with pending status
 * - Salon confirmation/decline/reschedule
 * - Client reschedule response
 * - Calendar conflict checking
 * - Auto-decline timer
 * - Real-time notifications
 */

import { Hono } from 'npm:hono@3.11.7';
import * as kv from './kv_store.tsx';
import {
  BookingWithWorkflow,
  BookingStatus,
  BookingStatusHistory,
  CalendarSlotStatus,
  SalonConfirmationAction,
  ClientRescheduleResponse,
  CalendarConflictCheck,
  DEFAULT_AUTO_DECLINE_CONFIG,
  TEMP_HOLD_DURATION_MINUTES,
  RESCHEDULE_RESPONSE_DEADLINE_HOURS,
} from './bookingWorkflowTypes.ts';

const app = new Hono();
const BASE_PATH = '/make-server-3e5c72fb';

/**
 * Create new booking (with pending status)
 */
app.post(`${BASE_PATH}/bookings/create`, async (c) => {
  try {
    const {
      clientId,
      clientName,
      clientEmail,
      clientPhone,
      salonId,
      salonName,
      serviceId,
      serviceName,
      servicePrice,
      serviceDuration,
      masterId,
      masterName,
      startTime,
      depositPaid,
      depositAmount,
      isNewClient = false,
    } = await c.req.json();

    // Validate required fields
    if (!clientId || !salonId || !serviceId || !masterId || !startTime) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Check for calendar conflicts
    const conflict = await checkCalendarConflict(salonId, masterId, new Date(startTime), serviceDuration);
    
    if (conflict.hasConflict && conflict.conflictType === 'confirmed') {
      return c.json({ 
        error: 'Time slot is already booked',
        conflict 
      }, 409);
    }

    // Create booking ID
    const bookingId = `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate end time
    const start = new Date(startTime);
    const end = new Date(start.getTime() + serviceDuration * 60000);
    
    // Temp hold expiration (30 min from now)
    const tempHoldExpires = new Date(Date.now() + TEMP_HOLD_DURATION_MINUTES * 60000);
    
    // Confirmation deadline (2 hours from now)
    const confirmationDeadline = new Date(Date.now() + DEFAULT_AUTO_DECLINE_CONFIG.timeoutMinutes * 60000);

    // Create booking
    const booking: BookingWithWorkflow = {
      id: bookingId,
      clientId,
      clientName,
      clientEmail,
      clientPhone,
      isNewClient,
      salonId,
      salonName,
      serviceId,
      serviceName,
      servicePrice,
      serviceDuration,
      masterId,
      masterName,
      requestedDateTime: start,
      startTime: start,
      endTime: end,
      status: 'pending',
      statusHistory: [
        {
          id: `history-${Date.now()}`,
          status: 'pending',
          timestamp: new Date(),
          changedBy: 'client',
          actorId: clientId,
          actorName: clientName,
        },
      ],
      calendarSlotStatus: 'temp_hold',
      tempHoldExpiresAt: tempHoldExpires,
      confirmationRequired: true,
      confirmationDeadline,
      depositPaid,
      depositAmount,
      totalAmount: servicePrice,
      remainingAmount: servicePrice - depositAmount,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save booking
    const bookingKey = `booking:${bookingId}`;
    await kv.set(bookingKey, booking);

    // Add to salon's pending list
    const pendingKey = `salon:${salonId}:bookings:pending`;
    const pendingBookings = (await kv.get(pendingKey) as string[]) || [];
    pendingBookings.push(bookingId);
    await kv.set(pendingKey, pendingBookings);

    // Add to client's bookings list
    const clientBookingsKey = `client:${clientId}:bookings`;
    const clientBookings = (await kv.get(clientBookingsKey) as string[]) || [];
    clientBookings.push(bookingId);
    await kv.set(clientBookingsKey, clientBookings);

    // Add to master's calendar (temp hold)
    const calendarKey = `master:${masterId}:calendar:${start.toISOString().split('T')[0]}`;
    const calendarSlots = (await kv.get(calendarKey) as any[]) || [];
    calendarSlots.push({
      bookingId,
      startTime: start,
      endTime: end,
      status: 'temp_hold',
      expiresAt: tempHoldExpires,
    });
    await kv.set(calendarKey, calendarSlots);

    // Schedule auto-decline (in production, use a scheduler/cron)
    // For now, we'll check on status requests
    
    console.log(`✅ Booking created: ${bookingId} (pending)`);
    console.log(`   Client: ${clientName}`);
    console.log(`   Salon: ${salonName}`);
    console.log(`   Time: ${start.toISOString()}`);
    console.log(`   Auto-decline at: ${confirmationDeadline.toISOString()}`);

    // TODO: Send notification to salon
    // TODO: Send confirmation email to client

    return c.json({
      success: true,
      booking,
      message: 'Booking created. Waiting for salon confirmation.',
    });
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    return c.json({ 
      error: 'Failed to create booking',
      details: error.message 
    }, 500);
  }
});

/**
 * Salon confirms booking
 */
app.post(`${BASE_PATH}/bookings/:bookingId/confirm`, async (c) => {
  try {
    const bookingId = c.req.param('bookingId');
    const { actorId, actorName } = await c.req.json();

    // Get booking
    const bookingKey = `booking:${bookingId}`;
    const booking = await kv.get(bookingKey) as BookingWithWorkflow;

    if (!booking) {
      return c.json({ error: 'Booking not found' }, 404);
    }

    if (booking.status !== 'pending') {
      return c.json({ error: 'Booking is not pending' }, 400);
    }

    // Update booking
    booking.status = 'confirmed';
    booking.calendarSlotStatus = 'confirmed';
    booking.confirmedAt = new Date();
    booking.confirmedBy = actorId;
    booking.updatedAt = new Date();

    // Add to status history
    booking.statusHistory.push({
      id: `history-${Date.now()}`,
      status: 'confirmed',
      timestamp: new Date(),
      changedBy: 'salon',
      actorId,
      actorName,
    });

    // Save booking
    await kv.set(bookingKey, booking);

    // Remove from pending list
    const pendingKey = `salon:${booking.salonId}:bookings:pending`;
    const pendingBookings = (await kv.get(pendingKey) as string[]) || [];
    const updatedPending = pendingBookings.filter(id => id !== bookingId);
    await kv.set(pendingKey, updatedPending);

    // Update calendar slot to confirmed
    const calendarKey = `master:${booking.masterId}:calendar:${booking.startTime.toISOString().split('T')[0]}`;
    const calendarSlots = (await kv.get(calendarKey) as any[]) || [];
    const updatedSlots = calendarSlots.map(slot =>
      slot.bookingId === bookingId
        ? { ...slot, status: 'confirmed', expiresAt: undefined }
        : slot
    );
    await kv.set(calendarKey, updatedSlots);

    console.log(`✅ Booking confirmed: ${bookingId}`);
    console.log(`   Confirmed by: ${actorName}`);

    // TODO: Send confirmation notification to client
    // TODO: Send calendar invite

    return c.json({
      success: true,
      booking,
      message: 'Booking confirmed successfully',
    });
  } catch (error) {
    console.error('❌ Error confirming booking:', error);
    return c.json({ error: 'Failed to confirm booking' }, 500);
  }
});

/**
 * Salon declines booking
 */
app.post(`${BASE_PATH}/bookings/:bookingId/decline`, async (c) => {
  try {
    const bookingId = c.req.param('bookingId');
    const { declineReason, actorId, actorName } = await c.req.json();

    // Get booking
    const bookingKey = `booking:${bookingId}`;
    const booking = await kv.get(bookingKey) as BookingWithWorkflow;

    if (!booking) {
      return c.json({ error: 'Booking not found' }, 404);
    }

    if (booking.status !== 'pending') {
      return c.json({ error: 'Booking is not pending' }, 400);
    }

    // Update booking
    booking.status = 'declined_by_salon';
    booking.calendarSlotStatus = 'available';
    booking.declineReason = declineReason;
    booking.declinedAt = new Date();
    booking.declinedBy = 'salon';
    booking.updatedAt = new Date();

    // Add to status history
    booking.statusHistory.push({
      id: `history-${Date.now()}`,
      status: 'declined_by_salon',
      timestamp: new Date(),
      changedBy: 'salon',
      actorId,
      actorName,
      reason: declineReason,
    });

    // Save booking
    await kv.set(bookingKey, booking);

    // Remove from pending list
    const pendingKey = `salon:${booking.salonId}:bookings:pending`;
    const pendingBookings = (await kv.get(pendingKey) as string[]) || [];
    const updatedPending = pendingBookings.filter(id => id !== bookingId);
    await kv.set(pendingKey, updatedPending);

    // Release calendar slot
    const calendarKey = `master:${booking.masterId}:calendar:${booking.startTime.toISOString().split('T')[0]}`;
    const calendarSlots = (await kv.get(calendarKey) as any[]) || [];
    const updatedSlots = calendarSlots.filter(slot => slot.bookingId !== bookingId);
    await kv.set(calendarKey, updatedSlots);

    console.log(`❌ Booking declined: ${bookingId}`);
    console.log(`   Reason: ${declineReason}`);

    // TODO: Process refund (if deposit was paid)
    // TODO: Send decline notification to client

    return c.json({
      success: true,
      booking,
      message: 'Booking declined. Client will be refunded.',
      refundAmount: booking.depositAmount,
    });
  } catch (error) {
    console.error('❌ Error declining booking:', error);
    return c.json({ error: 'Failed to decline booking' }, 500);
  }
});

/**
 * Salon proposes reschedule
 */
app.post(`${BASE_PATH}/bookings/:bookingId/propose-reschedule`, async (c) => {
  try {
    const bookingId = c.req.param('bookingId');
    const { newDateTime, rescheduleReason, actorId, actorName } = await c.req.json();

    // Get booking
    const bookingKey = `booking:${bookingId}`;
    const booking = await kv.get(bookingKey) as BookingWithWorkflow;

    if (!booking) {
      return c.json({ error: 'Booking not found' }, 404);
    }

    if (booking.status !== 'confirmed') {
      return c.json({ error: 'Only confirmed bookings can be rescheduled' }, 400);
    }

    // Store original time
    const originalDateTime = booking.startTime;
    
    // Update booking
    booking.status = 'rescheduled_pending';
    booking.rescheduleRequest = {
      requestedBy: 'salon',
      requestedAt: new Date(),
      originalDateTime,
      newDateTime: new Date(newDateTime),
      reason: rescheduleReason,
      expiresAt: new Date(Date.now() + RESCHEDULE_RESPONSE_DEADLINE_HOURS * 3600000),
    };
    booking.updatedAt = new Date();

    // Add to status history
    booking.statusHistory.push({
      id: `history-${Date.now()}`,
      status: 'rescheduled_pending',
      timestamp: new Date(),
      changedBy: 'salon',
      actorId,
      actorName,
      reason: rescheduleReason,
      previousTime: originalDateTime,
      newTime: new Date(newDateTime),
    });

    // Save booking
    await kv.set(bookingKey, booking);

    console.log(`📅 Reschedule proposed: ${bookingId}`);
    console.log(`   From: ${originalDateTime}`);
    console.log(`   To: ${newDateTime}`);
    console.log(`   Reason: ${rescheduleReason}`);

    // TODO: Send reschedule request notification to client

    return c.json({
      success: true,
      booking,
      message: 'Reschedule request sent to client',
    });
  } catch (error) {
    console.error('❌ Error proposing reschedule:', error);
    return c.json({ error: 'Failed to propose reschedule' }, 500);
  }
});

/**
 * Client responds to reschedule
 */
app.post(`${BASE_PATH}/bookings/:bookingId/reschedule-response`, async (c) => {
  try {
    const bookingId = c.req.param('bookingId');
    const { action, declineReason } = await c.req.json() as ClientRescheduleResponse;

    // Get booking
    const bookingKey = `booking:${bookingId}`;
    const booking = await kv.get(bookingKey) as BookingWithWorkflow;

    if (!booking) {
      return c.json({ error: 'Booking not found' }, 404);
    }

    if (booking.status !== 'rescheduled_pending' || !booking.rescheduleRequest) {
      return c.json({ error: 'No reschedule request pending' }, 400);
    }

    if (action === 'accept') {
      // Accept reschedule
      const newStart = new Date(booking.rescheduleRequest.newDateTime);
      const newEnd = new Date(newStart.getTime() + booking.serviceDuration * 60000);

      booking.status = 'confirmed';
      booking.startTime = newStart;
      booking.endTime = newEnd;
      booking.confirmedDateTime = newStart;
      booking.rescheduleRequest = undefined;
      booking.updatedAt = new Date();

      // Add to status history
      booking.statusHistory.push({
        id: `history-${Date.now()}`,
        status: 'confirmed',
        timestamp: new Date(),
        changedBy: 'client',
        actorId: booking.clientId,
        actorName: booking.clientName,
        notes: 'Accepted reschedule request',
      });

      // Update calendar
      // TODO: Remove old slot, add new slot

      console.log(`✅ Reschedule accepted: ${bookingId}`);

      // Save booking
      await kv.set(bookingKey, booking);

      return c.json({
        success: true,
        booking,
        message: 'Reschedule accepted',
      });
    } else {
      // Decline reschedule = cancel booking
      booking.status = 'cancelled_by_client';
      booking.cancellationReason = declineReason || 'Declined reschedule request';
      booking.cancelledAt = new Date();
      booking.cancelledBy = 'client';
      booking.rescheduleRequest = undefined;
      booking.refundAmount = booking.depositAmount;
      booking.updatedAt = new Date();

      // Add to status history
      booking.statusHistory.push({
        id: `history-${Date.now()}`,
        status: 'cancelled_by_client',
        timestamp: new Date(),
        changedBy: 'client',
        actorId: booking.clientId,
        actorName: booking.clientName,
        reason: declineReason,
      });

      console.log(`❌ Reschedule declined: ${bookingId}`);

      // Save booking
      await kv.set(bookingKey, booking);

      // TODO: Process refund

      return c.json({
        success: true,
        booking,
        message: 'Booking cancelled. Refund initiated.',
        refundAmount: booking.depositAmount,
      });
    }
  } catch (error) {
    console.error('❌ Error responding to reschedule:', error);
    return c.json({ error: 'Failed to process reschedule response' }, 500);
  }
});

/**
 * Get salon's pending bookings
 */
app.get(`${BASE_PATH}/salons/:salonId/bookings/pending`, async (c: { req: { param: (arg0: string) => any; }; json: (arg0: { success?: boolean; bookings?: BookingWithWorkflow[]; count?: number; error?: string; }, arg1: number | undefined) => any; }) => {
  try {
    const salonId = c.req.param('salonId');
    
    const pendingKey = `salon:${salonId}:bookings:pending`;
    const pendingIds = (await kv.get(pendingKey) as string[]) || [];

    const bookings = await Promise.all(
      pendingIds.map(async (id) => {
        const booking = await kv.get(`booking:${id}`) as BookingWithWorkflow;
        return booking;
      })
    );

    // Filter out null/expired
    const validBookings = bookings.filter(b => b !== null);

    return c.json({
      success: true,
      bookings: validBookings,
      count: validBookings.length,
    });
  } catch (error) {
    console.error('❌ Error fetching pending bookings:', error);
    return c.json({ error: 'Failed to fetch bookings' }, 500);
  }
});

/**
 * Get client's bookings
 */
app.get(`${BASE_PATH}/clients/:clientId/bookings`, async (c) => {
  try {
    const clientId = c.req.param('clientId');
    
    const clientBookingsKey = `client:${clientId}:bookings`;
    const bookingIds = (await kv.get(clientBookingsKey) as string[]) || [];

    const bookings = await Promise.all(
      bookingIds.map(async (id) => {
        const booking = await kv.get(`booking:${id}`) as BookingWithWorkflow;
        return booking;
      })
    );

    const validBookings = bookings.filter(b => b !== null);

    return c.json({
      success: true,
      bookings: validBookings,
      count: validBookings.length,
    });
  } catch (error) {
    console.error('❌ Error fetching client bookings:', error);
    return c.json({ error: 'Failed to fetch bookings' }, 500);
  }
});

/**
 * Check calendar conflicts
 */
async function checkCalendarConflict(
  salonId: string,
  masterId: string,
  startTime: Date,
  duration: number
): Promise<CalendarConflictCheck> {
  const endTime = new Date(startTime.getTime() + duration * 60000);
  const dateKey = startTime.toISOString().split('T')[0];
  
  const calendarKey = `master:${masterId}:calendar:${dateKey}`;
  const calendarSlots = (await kv.get(calendarKey) as any[]) || [];

  // Check for conflicts
  for (const slot of calendarSlots) {
    const slotStart = new Date(slot.startTime);
    const slotEnd = new Date(slot.endTime);

    // Check if times overlap
    if (
      (startTime >= slotStart && startTime < slotEnd) ||
      (endTime > slotStart && endTime <= slotEnd) ||
      (startTime <= slotStart && endTime >= slotEnd)
    ) {
      // Conflict found
      if (slot.status === 'confirmed') {
        return {
          hasConflict: true,
          conflictType: 'confirmed',
          conflictingBookingId: slot.bookingId,
          suggestedAlternatives: [], // TODO: Generate alternatives
        };
      } else if (slot.status === 'temp_hold') {
        // Check if hold has expired
        if (slot.expiresAt && new Date(slot.expiresAt) > new Date()) {
          return {
            hasConflict: true,
            conflictType: 'temp_hold',
            conflictingBookingId: slot.bookingId,
            suggestedAlternatives: [],
          };
        }
      }
    }
  }

  return {
    hasConflict: false,
    suggestedAlternatives: [],
  };
}

export default app;
