import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Interface for Support Message
interface SupportMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: 'contact-form' | 'email' | 'chat' | 'phone';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  adminNotes?: string;
  responseMessage?: string;
}

// Create a new support message
app.post("/make-server-3e5c72fb/support-messages", async (c) => {
  try {
    const body = await c.req.json();
    
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const messageId = `support_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    const supportMessage: SupportMessage = {
      id: messageId,
      name,
      email,
      subject,
      message,
      status: 'new',
      priority: 'medium', // Default priority
      source: 'contact-form',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // Save message to KV store
    await kv.set(`support:${messageId}`, supportMessage);

    console.log(`✅ New support message created: ${messageId} - ${subject} from ${name}`);

    return c.json({ 
      success: true, 
      messageId,
      message: "Support message created successfully" 
    }, 201);
  } catch (error) {
    console.error("❌ Error creating support message:", error);
    return c.json({ 
      error: "Failed to create support message",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Get all support messages
app.get("/make-server-3e5c72fb/support-messages", async (c) => {
  try {
    const messages = await kv.getByPrefix("support:");
    
    // Sort by createdAt (newest first)
    const sortedMessages = messages.sort((a: SupportMessage, b: SupportMessage) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    console.log(`📊 Retrieved ${sortedMessages.length} support messages`);

    return c.json({ 
      success: true,
      messages: sortedMessages,
      count: sortedMessages.length
    });
  } catch (error) {
    console.error("❌ Error fetching support messages:", error);
    return c.json({ 
      error: "Failed to fetch support messages",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Get single support message by ID
app.get("/make-server-3e5c72fb/support-messages/:id", async (c) => {
  try {
    const messageId = c.req.param("id");
    const message = await kv.get(`support:${messageId}`);

    if (!message) {
      return c.json({ error: "Support message not found" }, 404);
    }

    return c.json({ 
      success: true,
      message 
    });
  } catch (error) {
    console.error("❌ Error fetching support message:", error);
    return c.json({ 
      error: "Failed to fetch support message",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Update support message status
app.put("/make-server-3e5c72fb/support-messages/:id/status", async (c) => {
  try {
    const messageId = c.req.param("id");
    const { status } = await c.req.json();

    if (!['new', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return c.json({ error: "Invalid status value" }, 400);
    }

    const message = await kv.get(`support:${messageId}`);

    if (!message) {
      return c.json({ error: "Support message not found" }, 404);
    }

    const timestamp = new Date().toISOString();
    const updatedMessage: SupportMessage = {
      ...message,
      status,
      updatedAt: timestamp,
      resolvedAt: status === 'resolved' || status === 'closed' ? timestamp : message.resolvedAt,
    };

    await kv.set(`support:${messageId}`, updatedMessage);

    console.log(`✅ Support message ${messageId} status updated to: ${status}`);

    return c.json({ 
      success: true,
      message: updatedMessage 
    });
  } catch (error) {
    console.error("❌ Error updating support message status:", error);
    return c.json({ 
      error: "Failed to update support message status",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Update support message priority
app.put("/make-server-3e5c72fb/support-messages/:id/priority", async (c) => {
  try {
    const messageId = c.req.param("id");
    const { priority } = await c.req.json();

    if (!['low', 'medium', 'high', 'urgent'].includes(priority)) {
      return c.json({ error: "Invalid priority value" }, 400);
    }

    const message = await kv.get(`support:${messageId}`);

    if (!message) {
      return c.json({ error: "Support message not found" }, 404);
    }

    const updatedMessage: SupportMessage = {
      ...message,
      priority,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`support:${messageId}`, updatedMessage);

    console.log(`✅ Support message ${messageId} priority updated to: ${priority}`);

    return c.json({ 
      success: true,
      message: updatedMessage 
    });
  } catch (error) {
    console.error("❌ Error updating support message priority:", error);
    return c.json({ 
      error: "Failed to update support message priority",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Update support message (assign, add notes, add response)
app.put("/make-server-3e5c72fb/support-messages/:id", async (c) => {
  try {
    const messageId = c.req.param("id");
    const updates = await c.req.json();

    const message = await kv.get(`support:${messageId}`);

    if (!message) {
      return c.json({ error: "Support message not found" }, 404);
    }

    const updatedMessage: SupportMessage = {
      ...message,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`support:${messageId}`, updatedMessage);

    console.log(`✅ Support message ${messageId} updated`);

    return c.json({ 
      success: true,
      message: updatedMessage 
    });
  } catch (error) {
    console.error("❌ Error updating support message:", error);
    return c.json({ 
      error: "Failed to update support message",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Delete support message
app.delete("/make-server-3e5c72fb/support-messages/:id", async (c) => {
  try {
    const messageId = c.req.param("id");
    
    const message = await kv.get(`support:${messageId}`);
    if (!message) {
      return c.json({ error: "Support message not found" }, 404);
    }

    await kv.del(`support:${messageId}`);

    console.log(`🗑️ Support message ${messageId} deleted`);

    return c.json({ 
      success: true,
      message: "Support message deleted successfully" 
    });
  } catch (error) {
    console.error("❌ Error deleting support message:", error);
    return c.json({ 
      error: "Failed to delete support message",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

export default app;
