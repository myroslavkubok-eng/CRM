import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Save user role
app.post('/salon-role', async (c) => {
  try {
    const { userId, roleData } = await c.req.json();
    
    if (!userId || !roleData) {
      return c.json({ error: 'Missing userId or roleData' }, 400);
    }

    // Save role data: salon_user:{userId}
    await kv.set(`salon_user:${userId}`, roleData);

    // Add user to salon's user list: salon:{salonId}:users
    const salonUsersKey = `salon:${roleData.salonId}:users`;
    const existingUsers = await kv.get(salonUsersKey) || [];
    if (!existingUsers.includes(userId)) {
      existingUsers.push(userId);
      await kv.set(salonUsersKey, existingUsers);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error saving user role:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get user role
app.get('/salon-role/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const roleData = await kv.get(`salon_user:${userId}`);
    
    return c.json({ role: roleData });
  } catch (error) {
    console.error('Error getting user role:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Save salon data
app.post('/salon', async (c) => {
  try {
    const salonData = await c.req.json();
    
    if (!salonData.id) {
      return c.json({ error: 'Missing salon id' }, 400);
    }

    // Save salon data: salon:{salonId}
    await kv.set(`salon:${salonData.id}`, salonData);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error saving salon data:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get salon data
app.get('/salon/:salonId', async (c) => {
  try {
    const salonId = c.req.param('salonId');
    const salonData = await kv.get(`salon:${salonId}`);
    
    return c.json({ salon: salonData });
  } catch (error) {
    console.error('Error getting salon data:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Update salon publication status
app.patch('/salon/:salonId/publish', async (c) => {
  try {
    const salonId = c.req.param('salonId');
    const { isPublished } = await c.req.json();
    
    if (typeof isPublished !== 'boolean') {
      return c.json({ error: 'isPublished must be a boolean' }, 400);
    }

    // Get existing salon data
    const salonData = await kv.get(`salon:${salonId}`);
    
    if (!salonData) {
      return c.json({ error: 'Salon not found' }, 404);
    }

    // Update publication status
    salonData.isPublished = isPublished;
    salonData.publishedAt = isPublished ? new Date().toISOString() : null;
    
    // Save updated salon data
    await kv.set(`salon:${salonId}`, salonData);

    return c.json({ success: true, salon: salonData });
  } catch (error) {
    console.error('Error updating salon publication status:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Update salon settings
app.patch('/salon/:salonId/settings', async (c) => {
  try {
    const salonId = c.req.param('salonId');
    const settings = await c.req.json();
    
    // Get existing salon data or create new one
    let salonData = await kv.get(`salon:${salonId}`);
    
    if (!salonData) {
      // Create new salon if doesn't exist
      console.log(`Creating new salon with ID: ${salonId}`);
      salonData = {
        id: salonId,
        createdAt: new Date().toISOString(),
        isPublished: false,
      };
    }

    // Update salon settings
    if (settings.name) salonData.name = settings.name;
    if (settings.phone) salonData.phone = settings.phone;
    if (settings.address) salonData.address = settings.address;
    if (settings.description) salonData.description = settings.description;
    if (settings.coordinates) salonData.coordinates = settings.coordinates;
    if (settings.logo !== undefined) salonData.logo = settings.logo;
    if (settings.cover) salonData.cover = settings.cover;
    if (settings.gallery) salonData.gallery = settings.gallery;
    if (settings.workingHours) salonData.workingHours = settings.workingHours;
    
    // Update timestamp
    salonData.updatedAt = new Date().toISOString();
    
    // Save updated salon data
    await kv.set(`salon:${salonId}`, salonData);

    return c.json({ success: true, salon: salonData });
  } catch (error) {
    console.error('Error updating salon settings:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get all salons for owner
app.get('/owner/:ownerId/salons', async (c) => {
  try {
    const ownerId = c.req.param('ownerId');
    
    // Get all salons with prefix salon:
    const allSalons = await kv.getByPrefix('salon:');
    
    // Filter salons by owner
    const ownerSalons = allSalons.filter((salon: any) => 
      salon.ownerId === ownerId
    );
    
    return c.json({ salons: ownerSalons });
  } catch (error) {
    console.error('Error getting owner salons:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Generate invite token
app.post('/invite', async (c) => {
  try {
    const { salonId, role, invitedBy } = await c.req.json();
    
    if (!salonId || !role || !invitedBy) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Generate random token
    const token = `invite_${Math.random().toString(36).substring(2)}${Date.now()}`;
    
    // Save invite data: invite:{token}
    const inviteData = {
      salonId,
      role,
      invitedBy,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };
    
    await kv.set(`invite:${token}`, inviteData);

    return c.json({ token });
  } catch (error) {
    console.error('Error generating invite token:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Validate invite token
app.get('/invite/:token', async (c) => {
  try {
    const token = c.req.param('token');
    const inviteData = await kv.get(`invite:${token}`);
    
    if (!inviteData) {
      return c.json({ error: 'Invalid invite token' }, 404);
    }

    // Check if expired
    const now = new Date();
    const expiresAt = new Date(inviteData.expiresAt);
    
    if (now > expiresAt) {
      // Delete expired token
      await kv.del(`invite:${token}`);
      return c.json({ error: 'Invite token expired' }, 410);
    }

    return c.json({ invite: inviteData });
  } catch (error) {
    console.error('Error validating invite token:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Delete invite token after use
app.delete('/invite/:token', async (c) => {
  try {
    const token = c.req.param('token');
    await kv.del(`invite:${token}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting invite token:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Save/Update master data
app.post('/master', async (c) => {
  try {
    const masterData = await c.req.json();
    
    if (!masterData.id || !masterData.salonId) {
      return c.json({ error: 'Missing master id or salonId' }, 400);
    }

    // Get existing master data or create new
    const existingMaster = await kv.get(`master:${masterData.id}`);
    
    const masterToSave = {
      ...existingMaster,
      ...masterData,
      updatedAt: new Date().toISOString()
    };

    // Save master data: master:{masterId}
    await kv.set(`master:${masterData.id}`, masterToSave);

    // Ensure master is in salon's masters list
    const salonMastersKey = `salon:${masterData.salonId}:masters`;
    const existingMasters = await kv.get(salonMastersKey) || [];
    if (!existingMasters.includes(masterData.id)) {
      existingMasters.push(masterData.id);
      await kv.set(salonMastersKey, existingMasters);
    }

    return c.json({ success: true, master: masterToSave });
  } catch (error) {
    console.error('Error saving master data:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get master data
app.get('/master/:masterId', async (c) => {
  try {
    const masterId = c.req.param('masterId');
    const masterData = await kv.get(`master:${masterId}`);
    
    if (!masterData) {
      return c.json({ error: 'Master not found' }, 404);
    }
    
    return c.json({ master: masterData });
  } catch (error) {
    console.error('Error getting master data:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get all masters for a salon
app.get('/salon/:salonId/masters', async (c) => {
  try {
    const salonId = c.req.param('salonId');
    
    if (!salonId) {
      return c.json({ error: 'Salon ID is required' }, 400);
    }
    
    // Get list of master IDs for this salon
    const salonMastersKey = `salon:${salonId}:masters`;
    let masterIds = [];
    
    try {
      const mastersData = await kv.get(salonMastersKey);
      masterIds = mastersData || [];
    } catch (kvError) {
      // If key doesn't exist, return empty array (salon has no masters yet)
      console.log(`No masters list found for salon ${salonId}, returning empty array`);
      return c.json({ masters: [] });
    }
    
    // Get master data for each ID
    const masters = [];
    for (const masterId of masterIds) {
      try {
        const masterData = await kv.get(`master:${masterId}`);
        if (masterData) {
          masters.push(masterData);
        }
      } catch (masterError) {
        console.warn(`Master ${masterId} not found, skipping`);
        // Continue with other masters
      }
    }
    
    return c.json({ masters });
  } catch (error) {
    console.error('Error getting salon masters:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Delete master
app.delete('/master/:masterId', async (c) => {
  try {
    const masterId = c.req.param('masterId');
    
    // Get master data to find salonId
    const masterData = await kv.get(`master:${masterId}`);
    
    if (masterData && masterData.salonId) {
      // Remove from salon's masters list
      const salonMastersKey = `salon:${masterData.salonId}:masters`;
      const existingMasters = await kv.get(salonMastersKey) || [];
      const updatedMasters = existingMasters.filter((id: string) => id !== masterId);
      await kv.set(salonMastersKey, updatedMasters);
    }
    
    // Delete master data
    await kv.del(`master:${masterId}`);
    
    // Delete salon role
    await kv.del(`salon_user:${masterId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting master:', error);
    return c.json({ error: String(error) }, 500);
  }
});

export default app;