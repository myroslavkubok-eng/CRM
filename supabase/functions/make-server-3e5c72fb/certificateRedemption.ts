/**
 * Gift Certificate Redemption & Balance Tracking
 * 
 * Features:
 * - Check certificate validity
 * - Apply to checkout
 * - Track balance usage
 * - Client balance display  
 * - Expiration tracking
 * - Products + Services support
 */

import { Hono } from 'npm:hono@3.11.7';
import * as kv from './kv_store.tsx';

const app = new Hono();
const BASE_PATH = '/make-server-3e5c72fb';

interface CertificateUsage {
  id: string;
  certificateCode: string;
  bookingId: string;
  clientId: string;
  salonId: string;
  
  amountUsed: number;
  balanceBefore: number;
  balanceAfter: number;
  
  usedAt: Date;
  usedFor: 'service' | 'product' | 'both';
  items: {
    name: string;
    type: 'service' | 'product';
    amount: number;
  }[];
}

/**
 * Check certificate validity and balance
 */
app.post(`${BASE_PATH}/certificates/check`, async (c) => {
  try {
    const { code, clientId, salonId } = await c.req.json();

    if (!code) {
      return c.json({ error: 'Certificate code required' }, 400);
    }

    // Get certificate
    const certKey = `certificate:${code.toUpperCase()}`;
    const certificate = await kv.get(certKey) as any;

    if (!certificate) {
      return c.json({ 
        success: false,
        error: 'Certificate not found' 
      }, 404);
    }

    // Check if certificate belongs to this salon
    if (certificate.salonId !== salonId) {
      return c.json({ 
        success: false,
        error: 'Certificate not valid for this salon' 
      }, 400);
    }

    // Check if already fully used
    if (certificate.currentBalance <= 0) {
      return c.json({ 
        success: false,
        error: 'Certificate balance is zero' 
      }, 400);
    }

    // Check expiration
    if (certificate.expiresAt) {
      const expirationDate = new Date(certificate.expiresAt);
      if (expirationDate < new Date()) {
        return c.json({ 
          success: false,
          error: 'Certificate has expired' 
        }, 400);
      }
    }

    // Check if certificate is assigned to specific client
    if (certificate.recipientId && certificate.recipientId !== clientId) {
      return c.json({ 
        success: false,
        error: 'Certificate is assigned to a different client' 
      }, 400);
    }

    return c.json({
      success: true,
      certificate: {
        code: certificate.code,
        originalAmount: certificate.value,
        currentBalance: certificate.currentBalance,
        expiresAt: certificate.expiresAt,
        isValid: true,
        recipientName: certificate.recipientName,
        purchaseDate: certificate.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ Error checking certificate:', error);
    return c.json({ error: 'Failed to check certificate' }, 500);
  }
});

/**
 * Apply certificate to checkout
 */
app.post(`${BASE_PATH}/certificates/apply`, async (c) => {
  try {
    const {
      code,
      bookingId,
      clientId,
      salonId,
      amountToUse,
      items,
    } = await c.req.json();

    if (!code || !bookingId || !amountToUse) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Get certificate
    const certKey = `certificate:${code.toUpperCase()}`;
    const certificate = await kv.get(certKey) as any;

    if (!certificate) {
      return c.json({ error: 'Certificate not found' }, 404);
    }

    // Validate balance
    if (certificate.currentBalance < amountToUse) {
      return c.json({ 
        error: `Insufficient balance. Available: ${certificate.currentBalance}` 
      }, 400);
    }

    // Record usage
    const usageId = `cert-usage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const usage: CertificateUsage = {
      id: usageId,
      certificateCode: code.toUpperCase(),
      bookingId,
      clientId,
      salonId,
      amountUsed: amountToUse,
      balanceBefore: certificate.currentBalance,
      balanceAfter: certificate.currentBalance - amountToUse,
      usedAt: new Date(),
      usedFor: items ? determineUsageType(items) : 'both',
      items: items || [],
    };

    // Save usage history
    const usageHistoryKey = `certificate:${code.toUpperCase()}:usage`;
    const usageHistory = (await kv.get(usageHistoryKey) as CertificateUsage[]) || [];
    usageHistory.push(usage);
    await kv.set(usageHistoryKey, usageHistory);

    // Update certificate balance
    certificate.currentBalance -= amountToUse;
    certificate.lastUsedAt = new Date();
    certificate.timesUsed = (certificate.timesUsed || 0) + 1;
    
    if (certificate.currentBalance === 0) {
      certificate.status = 'fully_used';
      certificate.fullyUsedAt = new Date();
    } else {
      certificate.status = 'partially_used';
    }

    await kv.set(certKey, certificate);

    // Add to client's certificate balances
    const clientBalancesKey = `client:${clientId}:certificate-balances`;
    const balances = (await kv.get(clientBalancesKey) as any[]) || [];
    
    // Update or add balance
    const existingIndex = balances.findIndex(b => b.code === code.toUpperCase());
    if (existingIndex >= 0) {
      balances[existingIndex].currentBalance = certificate.currentBalance;
      balances[existingIndex].lastUsed = new Date();
    } else {
      balances.push({
        code: code.toUpperCase(),
        originalAmount: certificate.value,
        currentBalance: certificate.currentBalance,
        expiresAt: certificate.expiresAt,
        salonName: certificate.salonName,
        lastUsed: new Date(),
      });
    }
    
    await kv.set(clientBalancesKey, balances);

    console.log(`🎁 Certificate used: ${code}`);
    console.log(`   Amount used: ${amountToUse}`);
    console.log(`   Balance remaining: ${certificate.currentBalance}`);
    console.log(`   Booking: ${bookingId}`);

    return c.json({
      success: true,
      usage,
      remainingBalance: certificate.currentBalance,
      fullyUsed: certificate.currentBalance === 0,
    });
  } catch (error) {
    console.error('❌ Error applying certificate:', error);
    return c.json({ error: 'Failed to apply certificate' }, 500);
  }
});

/**
 * Get client's certificate balances
 */
app.get(`${BASE_PATH}/clients/:clientId/certificate-balances`, async (c) => {
  try {
    const clientId = c.req.param('clientId');

    const balancesKey = `client:${clientId}:certificate-balances`;
    const balances = (await kv.get(balancesKey) as any[]) || [];

    // Filter out expired and zero balance
    const activeBalances = balances.filter(b => {
      if (b.currentBalance <= 0) return false;
      
      if (b.expiresAt) {
        const expirationDate = new Date(b.expiresAt);
        if (expirationDate < new Date()) return false;
      }
      
      return true;
    });

    const totalBalance = activeBalances.reduce((sum, b) => sum + b.currentBalance, 0);

    return c.json({
      success: true,
      clientId,
      balances: activeBalances.sort((a, b) => 
        new Date(b.lastUsed || 0).getTime() - new Date(a.lastUsed || 0).getTime()
      ),
      totalBalance,
      count: activeBalances.length,
    });
  } catch (error) {
    console.error('❌ Error getting certificate balances:', error);
    return c.json({ error: 'Failed to get certificate balances' }, 500);
  }
});

/**
 * Get certificate usage history
 */
app.get(`${BASE_PATH}/certificates/:code/usage-history`, async (c) => {
  try {
    const code = c.req.param('code');

    const usageHistoryKey = `certificate:${code.toUpperCase()}:usage`;
    const usageHistory = (await kv.get(usageHistoryKey) as CertificateUsage[]) || [];

    // Sort by date (newest first)
    usageHistory.sort((a, b) => 
      new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime()
    );

    const totalUsed = usageHistory.reduce((sum, u) => sum + u.amountUsed, 0);

    return c.json({
      success: true,
      code: code.toUpperCase(),
      usageHistory,
      totalUsed,
      timesUsed: usageHistory.length,
    });
  } catch (error) {
    console.error('❌ Error getting usage history:', error);
    return c.json({ error: 'Failed to get usage history' }, 500);
  }
});

/**
 * Get salon's certificate redemptions (analytics)
 */
app.get(`${BASE_PATH}/salons/:salonId/certificate-redemptions`, async (c) => {
  try {
    const salonId = c.req.param('salonId');
    const { startDate, endDate } = c.req.query();

    if (!startDate || !endDate) {
      return c.json({ error: 'Start date and end date required' }, 400);
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get all certificates for salon
    const salonCertsKey = `salon:${salonId}:certificates`;
    const certCodes = (await kv.get(salonCertsKey) as string[]) || [];

    const allRedemptions: CertificateUsage[] = [];

    for (const code of certCodes) {
      const usageHistoryKey = `certificate:${code}:usage`;
      const history = (await kv.get(usageHistoryKey) as CertificateUsage[]) || [];
      allRedemptions.push(...history);
    }

    // Filter by date range
    const redemptionsInRange = allRedemptions.filter(r => {
      const redemptionDate = new Date(r.usedAt);
      return redemptionDate >= start && redemptionDate <= end;
    });

    // Calculate stats
    const totalRedeemed = redemptionsInRange.reduce((sum, r) => sum + r.amountUsed, 0);
    const uniqueCertificates = new Set(redemptionsInRange.map(r => r.certificateCode)).size;
    const uniqueClients = new Set(redemptionsInRange.map(r => r.clientId)).size;

    const byUsageType = {
      service: redemptionsInRange.filter(r => r.usedFor === 'service').reduce((sum, r) => sum + r.amountUsed, 0),
      product: redemptionsInRange.filter(r => r.usedFor === 'product').reduce((sum, r) => sum + r.amountUsed, 0),
      both: redemptionsInRange.filter(r => r.usedFor === 'both').reduce((sum, r) => sum + r.amountUsed, 0),
    };

    return c.json({
      success: true,
      salonId,
      dateRange: {
        start: startDate,
        end: endDate,
      },
      summary: {
        totalRedeemed,
        totalRedemptions: redemptionsInRange.length,
        uniqueCertificates,
        uniqueClients,
        averageRedemption: redemptionsInRange.length > 0 
          ? totalRedeemed / redemptionsInRange.length 
          : 0,
        byUsageType,
      },
      redemptions: redemptionsInRange.sort((a, b) => 
        new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime()
      ),
    });
  } catch (error) {
    console.error('❌ Error getting certificate redemptions:', error);
    return c.json({ error: 'Failed to get certificate redemptions' }, 500);
  }
});

/**
 * Helper: Determine usage type from items
 */
function determineUsageType(items: any[]): 'service' | 'product' | 'both' {
  if (!items || items.length === 0) return 'both';
  
  const hasService = items.some(i => i.type === 'service');
  const hasProduct = items.some(i => i.type === 'product');
  
  if (hasService && hasProduct) return 'both';
  if (hasService) return 'service';
  if (hasProduct) return 'product';
  
  return 'both';
}

export default app;
