/**
 * Real-time Slot Availability System
 * 
 * Shows ONLY available slots in real-time
 * Prevents double booking
 * Handles temp holds
 */

import { Hono } from 'npm:hono@3.11.7';
import * as kv from './kv_store.tsx';

const app = new Hono();
const BASE_PATH = '/make-server-3e5c72fb';

/**
 * Get available slots for a master on a specific date
 */
app.get(`${BASE_PATH}/slots/available`, async (c) => {
  try {
    const { masterId, date, serviceDuration } = c.req.query();

    if (!masterId || !date) {
      return c.json({ error: 'Missing masterId or date' }, 400);
    }

    const duration = parseInt(serviceDuration || '60');

    // Get master's working hours
    const masterKey = `master:${masterId}`;
    const master = await kv.get(masterKey) as any;

    if (!master) {
      return c.json({ error: 'Master not found' }, 404);
    }

    const workingHours = master.workingHours || {
      start: '09:00',
      end: '19:00',
    };

    // Get all bookings for this master on this date
    const calendarKey = `master:${masterId}:calendar:${date}`;
    const bookedSlots = (await kv.get(calendarKey) as any[]) || [];

    // Generate all possible slots
    const allSlots = generateTimeSlots(
      workingHours.start,
      workingHours.end,
      30 // 30-minute intervals
    );

    // Filter out unavailable slots
    const availableSlots = allSlots.filter(slot => {
      const slotStart = new Date(`${date}T${slot}`);
      const slotEnd = new Date(slotStart.getTime() + duration * 60000);

      // Check if slot conflicts with any booking
      for (const booking of bookedSlots) {
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);

        // Skip if booking is expired or cancelled
        if (booking.status === 'available') continue;
        
        // Skip temp holds that have expired
        if (booking.status === 'temp_hold' && booking.expiresAt) {
          if (new Date(booking.expiresAt) < new Date()) {
            // Temp hold expired, slot is available
            continue;
          }
        }

        // Check for overlap
        if (
          (slotStart >= bookingStart && slotStart < bookingEnd) ||
          (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
          (slotStart <= bookingStart && slotEnd >= bookingEnd)
        ) {
          // Conflict found
          return false;
        }
      }

      return true; // No conflict, slot is available
    });

    // Clean expired temp holds (background task)
    cleanExpiredTempHolds(masterId, date, bookedSlots);

    return c.json({
      success: true,
      masterId,
      masterName: master.name,
      date,
      serviceDuration: duration,
      availableSlots,
      totalSlots: allSlots.length,
      availableCount: availableSlots.length,
      occupancyRate: Math.round((1 - availableSlots.length / allSlots.length) * 100),
    });
  } catch (error) {
    console.error('❌ Error getting available slots:', error);
    return c.json({ error: 'Failed to get available slots' }, 500);
  }
});

/**
 * Get available masters for a specific time slot
 */
app.get(`${BASE_PATH}/slots/available-masters`, async (c) => {
  try {
    const { salonId, dateTime, serviceDuration } = c.req.query();

    if (!salonId || !dateTime) {
      return c.json({ error: 'Missing salonId or dateTime' }, 400);
    }

    const duration = parseInt(serviceDuration || '60');
    const requestedStart = new Date(dateTime);
    const requestedEnd = new Date(requestedStart.getTime() + duration * 60000);
    const date = requestedStart.toISOString().split('T')[0];

    // Get all masters for this salon
    const mastersKey = `salon:${salonId}:masters`;
    const masterIds = (await kv.get(mastersKey) as string[]) || [];

    const availableMasters = [];

    for (const masterId of masterIds) {
      // Get master info
      const master = await kv.get(`master:${masterId}`) as any;
      if (!master) continue;

      // Check if master is working at this time
      // TODO: Check working hours

      // Check if master is available (no conflicts)
      const calendarKey = `master:${masterId}:calendar:${date}`;
      const bookedSlots = (await kv.get(calendarKey) as any[]) || [];

      let hasConflict = false;

      for (const booking of bookedSlots) {
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);

        // Skip expired temp holds
        if (booking.status === 'temp_hold' && booking.expiresAt) {
          if (new Date(booking.expiresAt) < new Date()) continue;
        }

        // Skip cancelled/declined
        if (['available', 'cancelled', 'declined'].includes(booking.status)) {
          continue;
        }

        // Check overlap
        if (
          (requestedStart >= bookingStart && requestedStart < bookingEnd) ||
          (requestedEnd > bookingStart && requestedEnd <= bookingEnd) ||
          (requestedStart <= bookingStart && requestedEnd >= bookingEnd)
        ) {
          hasConflict = true;
          break;
        }
      }

      if (!hasConflict) {
        availableMasters.push({
          id: master.id,
          name: master.name,
          avatar: master.avatar,
          role: master.role,
          rating: master.rating || 4.5,
          reviewCount: master.reviewCount || 0,
        });
      }
    }

    return c.json({
      success: true,
      dateTime,
      serviceDuration: duration,
      availableMasters,
      count: availableMasters.length,
    });
  } catch (error) {
    console.error('❌ Error getting available masters:', error);
    return c.json({ error: 'Failed to get available masters' }, 500);
  }
});

/**
 * Check if a specific slot is available (real-time)
 */
app.post(`${BASE_PATH}/slots/check-availability`, async (c) => {
  try {
    const { masterId, dateTime, serviceDuration } = await c.req.json();

    if (!masterId || !dateTime) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const duration = parseInt(serviceDuration || '60');
    const requestedStart = new Date(dateTime);
    const requestedEnd = new Date(requestedStart.getTime() + duration * 60000);
    const date = requestedStart.toISOString().split('T')[0];

    // Get bookings for this master
    const calendarKey = `master:${masterId}:calendar:${date}`;
    const bookedSlots = (await kv.get(calendarKey) as any[]) || [];

    let available = true;
    let conflictWith = null;

    for (const booking of bookedSlots) {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);

      // Skip expired temp holds
      if (booking.status === 'temp_hold' && booking.expiresAt) {
        if (new Date(booking.expiresAt) < new Date()) {
          continue;
        }
      }

      // Skip cancelled
      if (booking.status === 'available') continue;

      // Check overlap
      if (
        (requestedStart >= bookingStart && requestedStart < bookingEnd) ||
        (requestedEnd > bookingStart && requestedEnd <= bookingEnd) ||
        (requestedStart <= bookingStart && requestedEnd >= bookingEnd)
      ) {
        available = false;
        conflictWith = {
          bookingId: booking.bookingId,
          status: booking.status,
          startTime: booking.startTime,
          endTime: booking.endTime,
        };
        break;
      }
    }

    return c.json({
      success: true,
      available,
      masterId,
      dateTime,
      serviceDuration: duration,
      conflictWith,
    });
  } catch (error) {
    console.error('❌ Error checking availability:', error);
    return c.json({ error: 'Failed to check availability' }, 500);
  }
});

/**
 * Get suggested alternative slots when conflict occurs
 */
app.post(`${BASE_PATH}/slots/suggest-alternatives`, async (c) => {
  try {
    const { masterId, dateTime, serviceDuration, salonId } = await c.req.json();

    if (!masterId || !dateTime) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const duration = parseInt(serviceDuration || '60');
    const requestedTime = new Date(dateTime);
    const date = requestedTime.toISOString().split('T')[0];

    // Get available slots for same master (different times)
    const sameTimeSlotsResponse = await fetch(
      `http://localhost:${Deno.env.get('PORT') || 8000}${BASE_PATH}/slots/available?masterId=${masterId}&date=${date}&serviceDuration=${duration}`
    );
    const sameTimeData = await sameTimeSlotsResponse.json();

    // Get available masters for same time (different masters)
    const sameMastersResponse = await fetch(
      `http://localhost:${Deno.env.get('PORT') || 8000}${BASE_PATH}/slots/available-masters?salonId=${salonId}&dateTime=${dateTime}&serviceDuration=${duration}`
    );
    const sameMastersData = await sameMastersResponse.json();

    // Find closest time slots (within 2 hours)
    const closestTimes = sameTimeData.availableSlots
      ?.filter((slot: string) => {
        const slotTime = new Date(`${date}T${slot}`);
        const diffMinutes = Math.abs(slotTime.getTime() - requestedTime.getTime()) / 60000;
        return diffMinutes <= 120; // Within 2 hours
      })
      .slice(0, 3) || [];

    return c.json({
      success: true,
      originalRequest: {
        masterId,
        dateTime,
        serviceDuration: duration,
      },
      suggestions: {
        sameMaster: {
          type: 'different_time',
          masterId,
          availableTimes: closestTimes.map((time: string) => ({
            time: `${date}T${time}`,
            display: time,
          })),
        },
        sameTime: {
          type: 'different_master',
          dateTime,
          availableMasters: sameMastersData.availableMasters || [],
        },
      },
    });
  } catch (error) {
    console.error('❌ Error suggesting alternatives:', error);
    return c.json({ error: 'Failed to suggest alternatives' }, 500);
  }
});

/**
 * Helper: Generate time slots
 */
function generateTimeSlots(start: string, end: string, intervalMinutes: number): string[] {
  const slots: string[] = [];
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);

  let currentHour = startHour;
  let currentMin = startMin;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMin < endMin)
  ) {
    slots.push(
      `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`
    );

    currentMin += intervalMinutes;
    if (currentMin >= 60) {
      currentHour += Math.floor(currentMin / 60);
      currentMin = currentMin % 60;
    }
  }

  return slots;
}

/**
 * Helper: Clean expired temp holds
 */
async function cleanExpiredTempHolds(masterId: string, date: string, bookedSlots: any[]) {
  const now = new Date();
  const expiredHolds = bookedSlots.filter(
    slot => slot.status === 'temp_hold' && slot.expiresAt && new Date(slot.expiresAt) < now
  );

  if (expiredHolds.length > 0) {
    const updatedSlots = bookedSlots.filter(
      slot => !(slot.status === 'temp_hold' && slot.expiresAt && new Date(slot.expiresAt) < now)
    );

    const calendarKey = `master:${masterId}:calendar:${date}`;
    await kv.set(calendarKey, updatedSlots);

    console.log(`🧹 Cleaned ${expiredHolds.length} expired temp holds for master ${masterId}`);
  }
}

export default app;
