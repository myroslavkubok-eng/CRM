import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import salonRoutes from "./salon-routes.tsx";
import bookingRoutes from "./bookings.tsx";
import leadRoutes from "./leads.tsx";
import supportMessageRoutes from "./support-messages.tsx";
import emailVerificationRoutes from "./email-verification.tsx";
import registrationRoutes from "./registration.tsx";
import stripeRoutes from "./stripe-routes.tsx";
import subscriptionUpgradeRoutes from "./subscription-upgrade.tsx";
import depositRoutes from "./depositRoutes.ts";
import bookingWorkflowRoutes from "./bookingWorkflowRoutes.ts";
import realtimeSlotsRoutes from "./realtimeSlots.ts";
import paymentTrackingRoutes from "./paymentTracking.ts";
import certificateRedemptionRoutes from "./certificateRedemption.ts";
import storageRoutes from "./storage-routes.ts";
import feedRoutes from "./feed-routes.ts";
import { sendBookingReminders } from "./notifications.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-3e5c72fb/health", (c) => {
  return c.json({ status: "ok" });
});

// Mount salon routes
app.route("/make-server-3e5c72fb", salonRoutes);

// Mount booking routes
app.route("/", bookingRoutes);

// Mount lead routes
app.route("/", leadRoutes);

// Mount support message routes
app.route("/", supportMessageRoutes);

// Mount email verification routes
app.route("/", emailVerificationRoutes);

// Mount registration routes
app.route("/", registrationRoutes);

// Mount stripe routes
app.route("/", stripeRoutes);

// Mount subscription upgrade routes
app.route("/", subscriptionUpgradeRoutes);

// Mount deposit & payment routes
app.route("/", depositRoutes);

// Mount booking workflow routes ⭐ NEW
app.route("/", bookingWorkflowRoutes);

// Mount real-time slots routes ⭐ NEW
app.route("/", realtimeSlotsRoutes);

// Mount payment tracking routes ⭐ NEW
app.route("/", paymentTrackingRoutes);

// Mount certificate redemption routes ⭐ NEW
app.route("/", certificateRedemptionRoutes);

// Mount storage routes ⭐ NEW
app.route("/", storageRoutes);

// Mount feed routes ⭐ NEW
app.route("/", feedRoutes);

// ============================================
// NOTIFICATIONS SCHEDULER
// Автоматическая отправка напоминаний
// ============================================

// Запускаем проверку напоминаний каждые 15 минут
setInterval(async () => {
  try {
    console.log('[Scheduler] Running booking reminders check...');
    await sendBookingReminders();
  } catch (error) {
    console.error('[Scheduler] Error in reminder check:', error);
  }
}, 15 * 60 * 1000); // 15 минут

// Запускаем первую проверку сразу при старте
setTimeout(() => {
  sendBookingReminders().catch(console.error);
}, 5000); // Через 5 секунд после старта

console.log('✅ Katia Booking Server Started');
console.log('   • Notification Scheduler: Active (every 15 minutes)');
console.log('   • Reminder Types: 3 days, 1 day, 2 hours, 30 minutes');

Deno.serve(app.fetch);