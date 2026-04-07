export type UserRole = 'owner' | 'admin' | 'master';

export interface SalonUserRole {
  userId: string;
  salonId: string;
  role: UserRole;
  invitedBy?: string;
  createdAt: string;
}

export interface SalonData {
  id: string;
  name: string;
  ownerId: string;
  plan: string;
  subscriptionStatus: 'active' | 'trial' | 'canceled';
  trialEndsAt?: string;
  createdAt: string;
}

// Store user role in kv_store
// Key format: salon_user:{userId}
export async function saveUserRole(
  userId: string,
  salonId: string,
  role: UserRole,
  invitedBy?: string
): Promise<void> {
  const roleData: SalonUserRole = {
    userId,
    salonId,
    role,
    invitedBy,
    createdAt: new Date().toISOString(),
  };

  const response = await fetch(
    `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-3e5c72fb/salon-role`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ userId, roleData }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to save user role: ${error}`);
  }
}

// Get user role from kv_store
export async function getUserRole(userId: string): Promise<SalonUserRole | null> {
  try {
    const response = await fetch(
      `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-3e5c72fb/salon-role/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.role || null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

// Save salon data
export async function saveSalonData(salonData: SalonData): Promise<void> {
  const response = await fetch(
    `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-3e5c72fb/salon`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(salonData),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to save salon data: ${error}`);
  }
}

// Get salon data
export async function getSalonData(salonId: string): Promise<SalonData | null> {
  try {
    const response = await fetch(
      `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-3e5c72fb/salon/${salonId}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.salon || null;
  } catch (error) {
    console.error('Error getting salon data:', error);
    return null;
  }
}

// Generate invite token
export async function generateInviteToken(
  salonId: string,
  role: UserRole,
  invitedBy: string
): Promise<string> {
  const response = await fetch(
    `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-3e5c72fb/invite`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ salonId, role, invitedBy }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to generate invite token: ${error}`);
  }

  const data = await response.json();
  return data.token;
}

// Validate invite token
export async function validateInviteToken(token: string): Promise<{
  salonId: string;
  role: UserRole;
  invitedBy: string;
} | null> {
  try {
    const response = await fetch(
      `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-3e5c72fb/invite/${token}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.invite || null;
  } catch (error) {
    console.error('Error validating invite token:', error);
    return null;
  }
}
