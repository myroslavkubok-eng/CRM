import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Interface for verification code
interface VerificationCode {
  email: string;
  code: string;
  expiresAt: string;
  attempts: number;
}

// Generate 6-digit verification code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification email (using Resend API)
async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    // For now, just log the code to console
    // In production, you would use Resend API here
    console.log(`📧 Verification code for ${email}: ${code}`);
    console.log(`🔗 This is a demo - in production, email would be sent via Resend API`);
    
    // Simulate email sending
    return true;
    
    /* Production implementation with Resend:
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Katia <noreply@katia.com>',
        to: email,
        subject: 'Your Katia Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #9333ea;">Verify Your Email</h2>
            <p>Your verification code is:</p>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
              ${code}
            </div>
            <p style="color: #6b7280;">This code will expire in 10 minutes.</p>
            <p style="color: #6b7280;">If you didn't request this code, please ignore this email.</p>
          </div>
        `,
      }),
    });
    
    return response.ok;
    */
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    return false;
  }
}

// Send verification code
app.post("/make-server-3e5c72fb/leads/send-verification", async (c) => {
  try {
    const { email } = await c.req.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return c.json({ error: "Invalid email address" }, 400);
    }

    // Generate code
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Store verification code in KV store
    const verificationData: VerificationCode = {
      email,
      code,
      expiresAt,
      attempts: 0,
    };

    await kv.set(`verification:${email}`, verificationData);

    // Send email
    const emailSent = await sendVerificationEmail(email, code);

    if (!emailSent) {
      return c.json({ error: "Failed to send verification email" }, 500);
    }

    console.log(`✅ Verification code sent to: ${email}`);

    return c.json({ 
      success: true,
      message: "Verification code sent to your email",
      // In development, return the code for testing
      ...(Deno.env.get('ENVIRONMENT') === 'development' ? { code } : {}),
    });
  } catch (error) {
    console.error("❌ Error sending verification code:", error);
    return c.json({ 
      error: "Failed to send verification code",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Verify code
app.post("/make-server-3e5c72fb/leads/verify-code", async (c) => {
  try {
    const { email, code } = await c.req.json();

    if (!email || !code) {
      return c.json({ error: "Email and code are required" }, 400);
    }

    // Get verification data
    const verificationData: VerificationCode | null = await kv.get(`verification:${email}`);

    if (!verificationData) {
      return c.json({ error: "Verification code not found or expired" }, 404);
    }

    // Check if expired
    if (new Date(verificationData.expiresAt) < new Date()) {
      await kv.del(`verification:${email}`);
      return c.json({ error: "Verification code expired" }, 400);
    }

    // Check attempts (max 5)
    if (verificationData.attempts >= 5) {
      await kv.del(`verification:${email}`);
      return c.json({ error: "Too many attempts. Please request a new code." }, 400);
    }

    // Verify code
    if (verificationData.code !== code) {
      // Increment attempts
      verificationData.attempts += 1;
      await kv.set(`verification:${email}`, verificationData);
      
      return c.json({ 
        error: "Invalid verification code",
        attemptsLeft: 5 - verificationData.attempts
      }, 400);
    }

    // Code is valid - delete verification data
    await kv.del(`verification:${email}`);

    console.log(`✅ Email verified: ${email}`);

    return c.json({ 
      success: true,
      message: "Email verified successfully"
    });
  } catch (error) {
    console.error("❌ Error verifying code:", error);
    return c.json({ 
      error: "Failed to verify code",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

export default app;
