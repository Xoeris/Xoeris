import { attemptAllowed, clientIp } from '../../_lib/auth.js';
import { requireJwtSecret } from '../../_lib/auth.js';
import jwt from 'jsonwebtoken';
import { neon } from '@neondatabase/serverless';
import { normalizeEmail, setCorsHeaders } from '../../_lib/auth.js';

function verifyAdmin(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return false;

  try {
    const jwtSecret = requireJwtSecret();
    const payload = jwt.verify(token, jwtSecret);
    const configuredAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    if (!payload || payload.role !== 'admin') return false;
    if (configuredAdminEmail && payload.email && payload.email.toLowerCase() !== configuredAdminEmail) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  setCorsHeaders(res, 'GET, POST, DELETE, OPTIONS', req);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = (req.url || '').toLowerCase();
  const subpath = req.query?.subpath || '';
  const isLogin = url.includes('/login') || subpath === 'login';

  // 1. ADMIN LOGIN
  if (isLogin) {
    if (req.method === 'GET') {
      return res.status(200).json({ email: process.env.ADMIN_EMAIL || '' });
    }
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = {}; }
      }
      const { email = '', pin = '' } = body || {};
      const configuredAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
      const configuredAdminPin = (process.env.ADMIN_PIN || '').trim();

      if (!configuredAdminPin || !configuredAdminEmail) {
        return res.status(500).json({ error: 'ADMIN_EMAIL or ADMIN_PIN environment variable is not configured.' });
      }

      if (!(await attemptAllowed('admin-login:' + clientIp(req)))) {
      return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' });
    }

    if (!email || email.trim().toLowerCase() !== configuredAdminEmail || !pin || String(pin).trim() !== configuredAdminPin) {
        return res.status(401).json({ error: 'Invalid admin email or PIN.' });
      }

      const jwtSecret = requireJwtSecret();
      const adminToken = jwt.sign(
        { sub: 'xoeris-admin', email: configuredAdminEmail, role: 'admin' },
        jwtSecret,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        success: true,
        message: 'Admin authorization granted.',
        token: adminToken,
        admin: { email: configuredAdminEmail, role: 'admin', authenticatedAt: new Date().toISOString() }
      });
    } catch (error) {
      return res.status(500).json({ error: 'Admin login processing failed', details: error.message });
    }
  }

  // 2. VERIFY ADMIN FOR ALL OTHER ACTIONS
  if (!verifyAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized: Valid Admin session required.' });
  }

  const postgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!postgresUrl) {
    return res.status(500).json({ error: 'Database configuration missing' });
  }

  const sql = neon(postgresUrl);

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  // 3. DELETE / CLEAR ORDERS
  const action = (body?.action || req.query?.action || '').toLowerCase();
  if (req.method === 'DELETE' || action === 'clear' || action === 'clear_orders') {
    try {
      await sql`DELETE FROM SubscriptionOrders`;
      return res.status(200).json({ success: true, message: 'All subscription orders cleared.' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to clear orders', details: err.message });
    }
  }

  if (action === 'delete_order' || (action === 'delete' && (body?.orderId || req.query?.orderId))) {
    const orderId = body?.orderId || req.query?.orderId;
    try {
      await sql`DELETE FROM SubscriptionOrders WHERE id = ${Number(orderId)}`;
      return res.status(200).json({ success: true, message: `Order #${orderId} deleted.` });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete order', details: err.message });
    }
  }

  // 4. DELETE / REMOVE USER ACCOUNT
  const { 
    orderId = null, 
    userEmail: rawEmail = '', 
    plan = 'pro', 
    status = 'approved',
    adminNotes = '',
    duration = '',
    durationValue = 1,
    durationUnit = 'months',
    userId = null
  } = body || {};

  const normalizedStatus = (status || '').toLowerCase();
  const normalizedPlan = (plan || 'pro').toLowerCase();
  let targetEmail = normalizeEmail(rawEmail);

  if (action === 'delete_user' || normalizedStatus === 'delete' || normalizedStatus === 'remove' || normalizedPlan === 'delete') {
    try {
      if (userId) {
        await sql`DELETE FROM users WHERE id = ${Number(userId)}`;
      } else if (targetEmail) {
        await sql`DELETE FROM users WHERE email = ${targetEmail}`;
      }
      return res.status(200).json({
        success: true,
        message: `Account ${targetEmail || userId} removed successfully.`,
        deleted: true
      });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete user account', details: err.message });
    }
  }

  // 5. GET ORDERS & USERS LIST
  const isOrdersList = req.method === 'GET' || url.includes('/orders') || subpath === 'orders';
  if (isOrdersList) {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS SubscriptionOrders (
          id SERIAL PRIMARY KEY,
          full_name TEXT NOT NULL,
          email TEXT NOT NULL,
          plan TEXT NOT NULL DEFAULT 'pro',
          billing_cycle TEXT NOT NULL DEFAULT 'yearly',
          amount_dollars INT NOT NULL,
          agree_text TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          transaction_ref TEXT UNIQUE NOT NULL,
          admin_notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      const orders = await sql`
        SELECT id, full_name, email, plan, billing_cycle, amount_dollars, agree_text, status, transaction_ref, admin_notes, created_at, updated_at
        FROM SubscriptionOrders
        ORDER BY created_at DESC
        LIMIT 100
      `;

      try {
        await sql`
          UPDATE users
          SET subscription_tier = 'free', subscription_status = 'expired'
          WHERE subscription_expires_at IS NOT NULL AND subscription_expires_at <= CURRENT_TIMESTAMP AND subscription_tier != 'free'
        `;
      } catch {}

      let users = [];
      try {
        users = await sql`
          SELECT id, username, email, name, avatar_url, COALESCE(subscription_tier, 'free') as subscription_tier, COALESCE(subscription_status, 'active') as subscription_status, subscription_cycle, subscription_expires_at, created_at
          FROM users
          ORDER BY id DESC
          LIMIT 100
        `;
      } catch {}

      const pendingCount = orders.filter(o => o.status === 'pending').length;
      const proCount = users.filter(u => u.subscription_tier === 'pro').length;
      const ultraCount = users.filter(u => u.subscription_tier === 'ultra').length;

      return res.status(200).json({
        success: true,
        orders,
        users,
        stats: {
          pendingCount,
          proCount,
          ultraCount,
          totalOrders: orders.length,
        }
      });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve admin orders', details: err.message });
    }
  }

  // 6. APPROVE ORDER / SET TIER
  if (req.method === 'POST') {
    try {
      if (orderId) {
        const orderRows = await sql`SELECT * FROM SubscriptionOrders WHERE id = ${Number(orderId)} LIMIT 1`;
        if (orderRows.length > 0) {
          if (!targetEmail) targetEmail = normalizeEmail(orderRows[0].email);
          await sql`
            UPDATE SubscriptionOrders
            SET status = ${normalizedStatus},
                plan = ${normalizedPlan},
                admin_notes = ${adminNotes || `Updated to ${normalizedPlan} by Admin on ${new Date().toISOString()}`},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${Number(orderId)}
          `;
        }
      }

      if (!targetEmail) {
        return res.status(400).json({ error: 'Target user email is required.' });
      }

      let expiresAt = null;
      let cycleDescription = 'custom';
      if (normalizedPlan !== 'free') {
        const now = new Date();
        expiresAt = new Date(now);
        const parsedVal = Math.max(1, parseInt(durationValue, 10) || 1);
        const unit = String(durationUnit || '').toLowerCase();

        if (duration === '1m' || (unit.startsWith('month') && parsedVal === 1)) {
          expiresAt.setMonth(now.getMonth() + 1);
          cycleDescription = '1 month';
        } else if (duration === '1y' || (unit.startsWith('year') && parsedVal === 1)) {
          expiresAt.setFullYear(now.getFullYear() + 1);
          cycleDescription = '1 year';
        } else if (unit.startsWith('month')) {
          expiresAt.setMonth(now.getMonth() + parsedVal);
          cycleDescription = `${parsedVal} months`;
        } else if (unit.startsWith('year')) {
          expiresAt.setFullYear(now.getFullYear() + parsedVal);
          cycleDescription = `${parsedVal} years`;
        } else {
          expiresAt.setFullYear(now.getFullYear() + 1);
          cycleDescription = '1 year';
        }
      }

      const expiresAtIso = expiresAt ? expiresAt.toISOString() : null;
      const existingUsers = await sql`SELECT id, email, username FROM users WHERE email = ${targetEmail} LIMIT 1`;
      let updatedUser = null;

      if (existingUsers.length > 0) {
        const user = existingUsers[0];
        const updated = await sql`
          UPDATE users
          SET subscription_tier = ${normalizedPlan},
              subscription_status = ${normalizedPlan === 'free' ? 'expired' : 'active'},
              subscription_cycle = ${cycleDescription},
              subscription_expires_at = ${expiresAtIso}
          WHERE id = ${user.id}
          RETURNING id, username, email, name, subscription_tier, subscription_status, subscription_cycle, subscription_expires_at
        `;
        updatedUser = updated[0];
      } else {
        const usernameSeed = targetEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') + Math.floor(Math.random() * 1000);
        const inserted = await sql`
          INSERT INTO users (username, email, name, subscription_tier, subscription_status, subscription_cycle, subscription_expires_at, email_verified, created_at)
          VALUES (${usernameSeed}, ${targetEmail}, ${targetEmail.split('@')[0]}, ${normalizedPlan}, ${normalizedPlan === 'free' ? 'expired' : 'active'}, ${cycleDescription}, ${expiresAtIso}, true, CURRENT_TIMESTAMP)
          RETURNING id, username, email, name, subscription_tier, subscription_status, subscription_cycle, subscription_expires_at
        `;
        updatedUser = inserted[0];
      }

      return res.status(200).json({
        success: true,
        message: `User ${targetEmail} set to ${normalizedPlan.toUpperCase()}`,
        user: updatedUser,
        plan: normalizedPlan,
        status: normalizedStatus,
        targetEmail
      });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update subscription', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
