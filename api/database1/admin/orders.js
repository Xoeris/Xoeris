import jwt from 'jsonwebtoken';
import { neon } from '@neondatabase/serverless';
import { setCorsHeaders } from '../../_lib/auth.js';

function verifyAdmin(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return false;

  try {
    const jwtSecret = process.env.JWT_SECRET || 'xoeris-admin-secure-vault-key-2026';
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
  setCorsHeaders(res, 'GET, OPTIONS', req);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
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
    const sql = neon(postgresUrl);

    // Ensure SubscriptionOrders table exists
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

    // Auto reset any expired subscriptions to free
    try {
      await sql`
        UPDATE users
        SET subscription_tier = 'free',
            subscription_status = 'expired'
        WHERE subscription_expires_at IS NOT NULL
          AND subscription_expires_at <= CURRENT_TIMESTAMP
          AND subscription_tier != 'free'
      `;
    } catch (e) {
      console.warn('Could not run auto reset query:', e.message);
    }

    let users = [];
    try {
      users = await sql`
        SELECT id, username, email, name, avatar_url, COALESCE(subscription_tier, 'free') as subscription_tier, COALESCE(subscription_status, 'active') as subscription_status, subscription_cycle, subscription_expires_at, created_at
        FROM users
        ORDER BY id DESC
        LIMIT 100
      `;
    } catch (e) {
      console.warn('Could not list users:', e.message);
    }

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
  } catch (error) {
    console.error('Fetch admin orders error:', error);
    return res.status(500).json({ error: 'Failed to retrieve admin orders', details: error.message });
  }
}
