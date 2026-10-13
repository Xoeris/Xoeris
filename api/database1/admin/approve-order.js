import jwt from 'jsonwebtoken';
import { neon } from '@neondatabase/serverless';
import { normalizeEmail, setCorsHeaders } from '../../_lib/auth.js';

const ADMIN_EMAIL = 'marcelloemar@gmail.com';

function verifyAdmin(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return false;

  try {
    const jwtSecret = process.env.JWT_SECRET || 'xoeris-admin-secure-vault-key-2026';
    const payload = jwt.verify(token, jwtSecret);
    return payload && payload.email === ADMIN_EMAIL && payload.role === 'admin';
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
      adminNotes = ''
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

    // Calculate expiration date
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setFullYear(now.getFullYear() + 1);

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
            subscription_status = 'active',
            subscription_cycle = 'yearly',
            subscription_expires_at = ${expiresAt.toISOString()}
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
            ${usernameSeed}, ${targetEmail}, ${targetEmail.split('@')[0]}, ${normalizedPlan}, 'active', 'yearly', ${expiresAt.toISOString()}, true, CURRENT_TIMESTAMP
          )
          RETURNING id, username, email, name, subscription_tier, subscription_status, subscription_cycle, subscription_expires_at
        `;
        updatedUser = inserted[0];
      } catch (err) {
        console.warn('Could not pre-seed user record:', err.message);
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
