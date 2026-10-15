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
  setCorsHeaders(res, 'POST, OPTIONS', req);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!verifyAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized: Valid Admin session required.' });
  }

  const postgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!postgresUrl) {
    return res.status(500).json({ error: 'Database configuration missing' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }

    const { 
      orderId = null, 
      userEmail: rawEmail = '', 
      plan = 'pro', 
      status = 'approved',
      adminNotes = '',
      duration = '',
      durationValue = 1,
      durationUnit = 'months'
    } = body || {};

    const normalizedPlan = (plan || 'pro').toLowerCase();
    const normalizedStatus = (status || 'approved').toLowerCase();
    let targetEmail = normalizeEmail(rawEmail);

    const sql = neon(postgresUrl);

    // If orderId is provided, retrieve order email if not specified
    if (orderId) {
      const orderRows = await sql`
        SELECT * FROM SubscriptionOrders WHERE id = ${Number(orderId)} LIMIT 1
      `;
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
      return res.status(400).json({ error: 'Target user email is required to assign subscription tier.' });
    }

    // Calculate expiration date based on duration (weeks / months / years)
    let expiresAt = null;
    let cycleDescription = 'custom';

    if (normalizedPlan !== 'free') {
      const now = new Date();
      expiresAt = new Date(now);
      const parsedVal = Math.max(1, parseInt(durationValue, 10) || 1);
      const unit = String(durationUnit || '').toLowerCase();

      if (duration === '1w' || (unit.startsWith('week') && parsedVal === 1)) {
        expiresAt.setDate(now.getDate() + 7);
        cycleDescription = '1 week';
      } else if (duration === '2w' || (unit.startsWith('week') && parsedVal === 2)) {
        expiresAt.setDate(now.getDate() + 14);
        cycleDescription = '2 weeks';
      } else if (duration === '1m' || (unit.startsWith('month') && parsedVal === 1)) {
        expiresAt.setMonth(now.getMonth() + 1);
        cycleDescription = '1 month';
      } else if (duration === '3m' || (unit.startsWith('month') && parsedVal === 3)) {
        expiresAt.setMonth(now.getMonth() + 3);
        cycleDescription = '3 months';
      } else if (duration === '6m' || (unit.startsWith('month') && parsedVal === 6)) {
        expiresAt.setMonth(now.getMonth() + 6);
        cycleDescription = '6 months';
      } else if (duration === '1y' || (unit.startsWith('year') && parsedVal === 1)) {
        expiresAt.setFullYear(now.getFullYear() + 1);
        cycleDescription = '1 year';
      } else if (unit.startsWith('week')) {
        expiresAt.setDate(now.getDate() + parsedVal * 7);
        cycleDescription = `${parsedVal} weeks`;
      } else if (unit.startsWith('month')) {
        expiresAt.setMonth(now.getMonth() + parsedVal);
        cycleDescription = `${parsedVal} months`;
      } else if (unit.startsWith('year')) {
        expiresAt.setFullYear(now.getFullYear() + parsedVal);
        cycleDescription = `${parsedVal} year${parsedVal > 1 ? 's' : ''}`;
      } else if (duration === 'never' || unit === 'never') {
        expiresAt = null;
        cycleDescription = 'permanent';
      } else {
        expiresAt.setFullYear(now.getFullYear() + 1);
        cycleDescription = '1 year';
      }
    }

    const expiresAtIso = expiresAt ? expiresAt.toISOString() : null;

    // Check if this is an order clear/delete action
    const action = (body?.action || '').toLowerCase();
    if (action === 'clear' || action === 'clear_orders') {
      await sql`DELETE FROM SubscriptionOrders`;
      return res.status(200).json({
        success: true,
        message: 'All subscription orders cleared successfully.',
        action: 'clear'
      });
    }

    if (action === 'delete' && orderId) {
      await sql`DELETE FROM SubscriptionOrders WHERE id = ${Number(orderId)}`;
      return res.status(200).json({
        success: true,
        message: `Order #${orderId} deleted successfully.`,
        action: 'delete',
        orderId
      });
    }

    // Check if this is a user delete/remove request
    if (normalizedStatus === 'delete' || normalizedStatus === 'remove' || normalizedPlan === 'delete') {
      if (targetEmail) {
        await sql`DELETE FROM users WHERE email = ${targetEmail}`;
      }
      return res.status(200).json({
        success: true,
        message: `Account ${targetEmail} removed successfully.`,
        deleted: true,
        targetEmail
      });
    }

    // Update or Insert into users table
    const existingUsers = await sql`
      SELECT id, email, username FROM users WHERE email = ${targetEmail} LIMIT 1
    `;

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
      // Pre-seed user with tier if not yet registered
      try {
        const usernameSeed = targetEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') + Math.floor(Math.random() * 1000);
        const inserted = await sql`
          INSERT INTO users (
            username, email, name, subscription_tier, subscription_status, subscription_cycle, subscription_expires_at, email_verified, created_at
          )
          VALUES (
            ${usernameSeed}, ${targetEmail}, ${targetEmail.split('@')[0]}, ${normalizedPlan}, ${normalizedPlan === 'free' ? 'expired' : 'active'}, ${cycleDescription}, ${expiresAtIso}, true, CURRENT_TIMESTAMP
          )
          RETURNING id, username, email, name, subscription_tier, subscription_status, subscription_cycle, subscription_expires_at
        `;
        updatedUser = inserted[0];
      } catch (insertErr) {
        console.warn('Could not pre-seed user:', insertErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `User ${targetEmail} successfully set as ${normalizedPlan.toUpperCase()}`,
      user: updatedUser,
      plan: normalizedPlan,
      status: normalizedStatus,
      targetEmail
    });
  } catch (error) {
    console.error('Approve order error:', error);
    return res.status(500).json({ error: 'Failed to update user subscription', details: error.message });
  }
}
