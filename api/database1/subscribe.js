import { neon } from '@neondatabase/serverless';
import { verifySessionToken, normalizeEmail, setCorsHeaders } from '../_lib/auth.js';

export default async function handler(req, res) {
  setCorsHeaders(res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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

    const { plan = 'pro', billingCycle = 'yearly', cardLast4 = '', cardBrand = '', email: clientEmail } = body || {};

    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    let userEmail = clientEmail ? normalizeEmail(clientEmail) : '';
    let userId = null;

    if (token) {
      try {
        const payload = verifySessionToken(token);
        if (payload?.email) userEmail = normalizeEmail(payload.email);
        if (payload?.sub) userId = payload.sub;
      } catch (e) {
        console.warn('Invalid token in subscribe endpoint:', e.message);
      }
    }

    const sql = neon(postgresUrl);

    // Ensure subscription columns exist
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free'`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active'`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_cycle TEXT DEFAULT 'monthly'`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE`;
      await sql`
        CREATE TABLE IF NOT EXISTS Subscriptions (
          id SERIAL PRIMARY KEY,
          user_id INT,
          email TEXT,
          plan TEXT NOT NULL,
          billing_cycle TEXT NOT NULL,
          amount_cents INT NOT NULL,
          card_brand TEXT,
          card_last4 TEXT,
          status TEXT NOT NULL DEFAULT 'active',
          transaction_ref TEXT UNIQUE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL
        )
      `;
    } catch (e) {
      console.warn('Subscription migration notice:', e.message);
    }

    // Calculate dates and amounts
    const now = new Date();
    const expiresAt = new Date(now);
    let amountDollars = 50;

    if (billingCycle === 'yearly') {
      expiresAt.setFullYear(now.getFullYear() + 1);
      amountDollars = 420;
    } else {
      expiresAt.setMonth(now.getMonth() + 1);
      amountDollars = 50;
    }

    const transactionRef = `XOERIS-SUB-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    let updatedUser = null;

    if (userEmail || userId) {
      const userRows = await sql`
        SELECT * FROM users
        WHERE email = ${userEmail} OR username = ${String(userId)} OR id::text = ${String(userId)}
        LIMIT 1
      `;

      if (userRows.length > 0) {
        const existing = userRows[0];
        const updateRows = await sql`
          UPDATE users
          SET subscription_tier = ${plan},
              subscription_status = 'active',
              subscription_cycle = ${billingCycle},
              subscription_expires_at = ${expiresAt.toISOString()}
          WHERE id = ${existing.id}
          RETURNING id, username, email, name, avatar_url, auth_provider, email_verified, subscription_tier, subscription_status, subscription_cycle, subscription_expires_at
        `;
        updatedUser = updateRows[0];

        await sql`
          INSERT INTO Subscriptions (user_id, email, plan, billing_cycle, amount_cents, card_brand, card_last4, status, transaction_ref, expires_at)
          VALUES (${existing.id}, ${existing.email}, ${plan}, ${billingCycle}, ${amountDollars * 100}, ${cardBrand}, ${cardLast4}, 'active', ${transactionRef}, ${expiresAt.toISOString()})
        `;
      }
    }

    if (!updatedUser) {
      // Guest or direct checkout record
      await sql`
        INSERT INTO Subscriptions (email, plan, billing_cycle, amount_cents, card_brand, card_last4, status, transaction_ref, expires_at)
        VALUES (${userEmail || 'guest@xoeris.com'}, ${plan}, ${billingCycle}, ${amountDollars * 100}, ${cardBrand}, ${cardLast4}, 'active', ${transactionRef}, ${expiresAt.toISOString()})
      `;
      updatedUser = {
        email: userEmail || 'guest@xoeris.com',
        subscription_tier: plan,
        subscription_status: 'active',
        subscription_cycle: billingCycle,
        subscription_expires_at: expiresAt.toISOString(),
      };
    }

    return res.status(200).json({
      success: true,
      message: 'Subscription successfully activated',
      transactionRef,
      plan,
      billingCycle,
      amount: amountDollars,
      currency: 'USD',
      cardBrand,
      cardLast4,
      expiresAt: expiresAt.toISOString(),
      user: updatedUser,
    });
  } catch (error) {
    console.error('Subscription charge error:', error);
    return res.status(500).json({
      error: 'Payment processing error',
      details: error.message,
    });
  }
}
