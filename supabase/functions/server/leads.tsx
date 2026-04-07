import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Interface for Lead
interface Lead {
  id: string;
  fullName: string;
  businessName: string;
  phoneNumber: string;
  email: string;
  city: string;
  businessType: string;
  status: 'new' | 'contacted' | 'demo-scheduled' | 'converted' | 'rejected';
  source: string;
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
  notes?: string;
}

// Create a new lead
app.post("/make-server-3e5c72fb/leads", async (c) => {
  try {
    const body = await c.req.json();
    
    const { fullName, businessName, phoneNumber, email, city, businessType } = body;

    // Validate required fields
    if (!fullName || !businessName || !phoneNumber || !email || !city) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    const lead: Lead = {
      id: leadId,
      fullName,
      businessName,
      phoneNumber,
      email,
      city,
      businessType: businessType || 'Other',
      status: 'new',
      source: 'become-partner-form',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // Save lead to KV store
    await kv.set(`lead:${leadId}`, lead);

    console.log(`✅ New lead created: ${leadId} - ${businessName} (${city})`);

    return c.json({ 
      success: true, 
      leadId,
      message: "Lead created successfully" 
    }, 201);
  } catch (error) {
    console.error("❌ Error creating lead:", error);
    return c.json({ 
      error: "Failed to create lead",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Get all leads
app.get("/make-server-3e5c72fb/leads", async (c) => {
  try {
    const leads = await kv.getByPrefix("lead:");
    
    // Sort by createdAt (newest first)
    const sortedLeads = leads.sort((a: Lead, b: Lead) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    console.log(`📊 Retrieved ${sortedLeads.length} leads`);

    return c.json({ 
      success: true,
      leads: sortedLeads,
      count: sortedLeads.length
    });
  } catch (error) {
    console.error("❌ Error fetching leads:", error);
    return c.json({ 
      error: "Failed to fetch leads",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Get single lead by ID
app.get("/make-server-3e5c72fb/leads/:id", async (c) => {
  try {
    const leadId = c.req.param("id");
    const lead = await kv.get(`lead:${leadId}`);

    if (!lead) {
      return c.json({ error: "Lead not found" }, 404);
    }

    return c.json({ 
      success: true,
      lead 
    });
  } catch (error) {
    console.error("❌ Error fetching lead:", error);
    return c.json({ 
      error: "Failed to fetch lead",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Update lead status
app.put("/make-server-3e5c72fb/leads/:id/status", async (c) => {
  try {
    const leadId = c.req.param("id");
    const { status } = await c.req.json();

    if (!['new', 'contacted', 'demo-scheduled', 'converted', 'rejected'].includes(status)) {
      return c.json({ error: "Invalid status value" }, 400);
    }

    const lead = await kv.get(`lead:${leadId}`);

    if (!lead) {
      return c.json({ error: "Lead not found" }, 404);
    }

    const timestamp = new Date().toISOString();
    const updatedLead: Lead = {
      ...lead,
      status,
      updatedAt: timestamp,
      lastContactedAt: status === 'contacted' || status === 'demo-scheduled' ? timestamp : lead.lastContactedAt,
    };

    await kv.set(`lead:${leadId}`, updatedLead);

    console.log(`✅ Lead ${leadId} status updated to: ${status}`);

    return c.json({ 
      success: true,
      lead: updatedLead 
    });
  } catch (error) {
    console.error("❌ Error updating lead status:", error);
    return c.json({ 
      error: "Failed to update lead status",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Delete lead
app.delete("/make-server-3e5c72fb/leads/:id", async (c) => {
  try {
    const leadId = c.req.param("id");
    
    const lead = await kv.get(`lead:${leadId}`);
    if (!lead) {
      return c.json({ error: "Lead not found" }, 404);
    }

    await kv.del(`lead:${leadId}`);

    console.log(`🗑️ Lead ${leadId} deleted`);

    return c.json({ 
      success: true,
      message: "Lead deleted successfully" 
    });
  } catch (error) {
    console.error("❌ Error deleting lead:", error);
    return c.json({ 
      error: "Failed to delete lead",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

export default app;
