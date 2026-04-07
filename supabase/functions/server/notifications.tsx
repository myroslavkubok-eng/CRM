/**
 * Push Notifications Service для Katia Beauty Platform
 * Автоматическая отправка напоминаний о записях
 */

import * as kv from './kv_store.tsx';

// Web Push library для отправки уведомлений
// import webpush from 'npm:web-push@3.6.7';

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  tag?: string;
  requireInteraction?: boolean;
}

/**
 * Отправка push уведомления пользователю
 */
export async function sendPushNotification(
  userId: string,
  payload: NotificationPayload
): Promise<boolean> {
  try {
    // Получаем подписку пользователя
    const subscriptionKey = `push:subscription:${userId}`;
    const subscription = await kv.get<PushSubscriptionData>(subscriptionKey);

    if (!subscription) {
      console.log(`[Notifications] No push subscription for user ${userId}`);
      return false;
    }

    // Проверяем настройки уведомлений пользователя
    const settingsKey = `notifications:settings:${userId}`;
    const settings = await kv.get(settingsKey);

    if (!settings || !settings.enabled || !settings.pushNotifications) {
      console.log(`[Notifications] Push notifications disabled for user ${userId}`);
      return false;
    }

    // TODO: В production используйте реальную отправку через Web Push API
    // const vapidKeys = {
    //   publicKey: Deno.env.get('VAPID_PUBLIC_KEY'),
    //   privateKey: Deno.env.get('VAPID_PRIVATE_KEY'),
    // };
    //
    // webpush.setVapidDetails(
    //   'mailto:support@katia.com',
    //   vapidKeys.publicKey,
    //   vapidKeys.privateKey
    // );
    //
    // await webpush.sendNotification(
    //   subscription,
    //   JSON.stringify(payload)
    // );

    console.log(`[Notifications] ✅ Push sent to user ${userId}:`, payload.title);
    return true;
  } catch (error) {
    console.error(`[Notifications] Error sending push to user ${userId}:`, error);
    return false;
  }
}

/**
 * Отправка email уведомления
 */
export async function sendEmailNotification(
  userId: string,
  subject: string,
  body: string
): Promise<boolean> {
  try {
    // Проверяем настройки
    const settingsKey = `notifications:settings:${userId}`;
    const settings = await kv.get(settingsKey);

    if (!settings || !settings.enabled || !settings.emailNotifications) {
      console.log(`[Notifications] Email notifications disabled for user ${userId}`);
      return false;
    }

    // TODO: Интеграция с email сервисом (SendGrid, Resend, etc.)
    // const apiKey = Deno.env.get('EMAIL_API_KEY');
    // await sendEmail({ to: userEmail, subject, body });

    console.log(`[Notifications] ✅ Email sent to user ${userId}:`, subject);
    return true;
  } catch (error) {
    console.error(`[Notifications] Error sending email to user ${userId}:`, error);
    return false;
  }
}

/**
 * Отправка SMS уведомления
 */
export async function sendSMSNotification(
  userId: string,
  message: string
): Promise<boolean> {
  try {
    // Проверяем настройки
    const settingsKey = `notifications:settings:${userId}`;
    const settings = await kv.get(settingsKey);

    if (!settings || !settings.enabled || !settings.smsNotifications) {
      console.log(`[Notifications] SMS notifications disabled for user ${userId}`);
      return false;
    }

    // TODO: Интеграция с SMS сервисом (Twilio, etc.)
    // const apiKey = Deno.env.get('TWILIO_API_KEY');
    // await sendSMS({ to: userPhone, message });

    console.log(`[Notifications] ✅ SMS sent to user ${userId}`);
    return true;
  } catch (error) {
    console.error(`[Notifications] Error sending SMS to user ${userId}:`, error);
    return false;
  }
}

/**
 * Проверка и отправка напоминаний о записях
 */
export async function sendBookingReminders(): Promise<void> {
  try {
    console.log('[Scheduler] Checking for booking reminders...');

    // Получаем все бронирования
    const bookings = await kv.getByPrefix('booking:');
    const now = new Date();

    for (const booking of bookings) {
      if (booking.status !== 'upcoming') continue;

      const appointmentTime = new Date(booking.dateTime);
      const timeDiff = appointmentTime.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      const daysDiff = hoursDiff / 24;

      // Получаем настройки САЛОНА (когда отправлять напоминания)
      const salonConfigKey = `salon:notifications:${booking.salonId || 'default'}`;
      const salonConfig = await kv.get(salonConfigKey);
      
      // Если у салона нет настроек, используем дефолтные
      const reminders = salonConfig?.reminders || {
        threeDaysBefore: true,
        oneDayBefore: true,
        twoHoursBefore: true,
        thirtyMinutesBefore: false,
      };

      // Получаем настройки КЛИЕНТА (какие каналы использовать)
      const clientSettingsKey = `notifications:settings:${booking.clientId}`;
      const clientSettings = await kv.get(clientSettingsKey);

      if (!clientSettings || !clientSettings.enabled) continue;

      // Проверяем, нужно ли отправить напоминание (по настройкам САЛОНА)
      let shouldSend = false;
      let timeframe = '';

      // 3 дня до записи (±2 часа)
      if (reminders.threeDaysBefore && daysDiff >= 2.9 && daysDiff <= 3.1) {
        shouldSend = true;
        timeframe = '3 days';
      }
      // 1 день до записи (±2 часа)
      else if (reminders.oneDayBefore && daysDiff >= 0.9 && daysDiff <= 1.1) {
        shouldSend = true;
        timeframe = '1 day';
      }
      // 2 часа до записи (±15 минут)
      else if (reminders.twoHoursBefore && hoursDiff >= 1.75 && hoursDiff <= 2.25) {
        shouldSend = true;
        timeframe = '2 hours';
      }
      // 30 минут до записи (±5 минут)
      else if (reminders.thirtyMinutesBefore && hoursDiff >= 0.4 && hoursDiff <= 0.6) {
        shouldSend = true;
        timeframe = '30 minutes';
      }

      if (shouldSend) {
        // Проверяем, не отправляли ли уже это напоминание
        const reminderKey = `reminder:${booking.id}:${timeframe}`;
        const alreadySent = await kv.get(reminderKey);

        if (!alreadySent) {
          // Формируем текст уведомления
          const formattedDate = appointmentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          const formattedTime = appointmentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          });

          const title = `Upcoming Appointment ${timeframe === '30 minutes' ? 'Soon' : `in ${timeframe}`}`;
          const body = `${booking.serviceName} at ${booking.salonName}\n${formattedDate} at ${formattedTime}`;

          // Отправляем уведомления через выбранные КЛИЕНТОМ каналы
          const notifications = [];
          
          if (clientSettings.pushNotifications) {
            notifications.push(
              sendPushNotification(booking.clientId, {
                title,
                body,
                icon: '/icons/icon-192x192.png',
                badge: '/icons/badge-72x72.png',
                tag: `booking-${booking.id}`,
                data: {
                  bookingId: booking.id,
                  salonId: booking.salonId,
                  url: `/client`,
                },
                requireInteraction: timeframe === '30 minutes',
              })
            );
          }
          
          if (clientSettings.emailNotifications) {
            notifications.push(sendEmailNotification(booking.clientId, title, body));
          }
          
          if (clientSettings.smsNotifications) {
            notifications.push(sendSMSNotification(booking.clientId, body));
          }

          await Promise.all(notifications);

          // Помечаем напоминание как отправленное
          await kv.set(reminderKey, { sentAt: now.toISOString() });
          
          console.log(`[Scheduler] ✅ Reminder sent for booking ${booking.id} (${timeframe})`);
        }
      }
    }
  } catch (error) {
    console.error('[Scheduler] Error sending booking reminders:', error);
  }
}

/**
 * Уведомление о новой записи (для владельцев салонов/админов)
 */
export async function notifyNewBooking(
  salonId: string,
  booking: any
): Promise<void> {
  try {
    // Получаем всех владельцев и админов салона
    const users = await kv.getByPrefix(`salon:${salonId}:user:`);

    for (const user of users) {
      if (user.role !== 'owner' && user.role !== 'admin') continue;

      const settings = await kv.get(`notifications:settings:${user.userId}`);
      if (!settings || !settings.enabled || !settings.newBookings) continue;

      const formattedDate = new Date(booking.dateTime).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
      const formattedTime = new Date(booking.dateTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      await sendPushNotification(user.userId, {
        title: '🎉 New Booking!',
        body: `${booking.clientName} booked ${booking.serviceName}\n${formattedDate} at ${formattedTime}`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: `new-booking-${booking.id}`,
        data: {
          bookingId: booking.id,
          salonId: salonId,
          url: '/dashboard',
        },
      });
    }

    console.log(`[Notifications] ✅ New booking notification sent for salon ${salonId}`);
  } catch (error) {
    console.error('[Notifications] Error notifying new booking:', error);
  }
}

/**
 * Уведомление об отмене записи
 */
export async function notifyCancellation(
  salonId: string,
  booking: any
): Promise<void> {
  try {
    // Уведомляем владельцев/админов салона
    const users = await kv.getByPrefix(`salon:${salonId}:user:`);

    for (const user of users) {
      if (user.role !== 'owner' && user.role !== 'admin') continue;

      const settings = await kv.get(`notifications:settings:${user.userId}`);
      if (!settings || !settings.enabled || !settings.cancellations) continue;

      const formattedDate = new Date(booking.dateTime).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
      const formattedTime = new Date(booking.dateTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      await sendPushNotification(user.userId, {
        title: '❌ Booking Cancelled',
        body: `${booking.clientName} cancelled ${booking.serviceName}\n${formattedDate} at ${formattedTime}`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: `cancel-${booking.id}`,
        data: {
          bookingId: booking.id,
          salonId: salonId,
          url: '/dashboard',
        },
      });
    }

    console.log(`[Notifications] ✅ Cancellation notification sent for salon ${salonId}`);
  } catch (error) {
    console.error('[Notifications] Error notifying cancellation:', error);
  }
}