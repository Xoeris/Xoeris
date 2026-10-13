import { neon } from '@neondatabase/serverless';
import { verifySessionToken, normalizeEmail, setCorsHeaders } from '../_lib/auth.js';

export default async function handler(req, res) {
  setCorsHeaders(res, 'POST, OPTIONS', req);
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

    const { 
      fullName = '', 
      email: rawEmail = '', 
      plan = 'pro', 
      billingCycle = 'yearly', 
      agreeText = '' 
    } = body || {};

    const normalizedPlan = plan.toLowerCase() === 'ultra' ? 'ultra' : 'pro';
    const normalizedCycle = billingCycle.toLowerCase() === 'monthly' ? 'monthly' : 'yearly';
    const email = normalizeEmail(rawEmail);
    const cleanFullName = String(fullName || '').trim();

    if (!cleanFullName) {
      return res.status(400).json({ error: 'Full name is required.' });
    }

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    if (String(agreeText || '').trim() !== 'I AGREE') {
      return res.status(400).json({ error: 'You must type exactly "I AGREE" to confirm payment authorization.' });
    }

    const sql = neon(postgresUrl);

    // Ensure required tables & columns exist
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free'`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active'`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_cycle TEXT DEFAULT 'monthly'`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE`;
      
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
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;
    } catch (e) {
      console.warn('Subscription table initialization notice:', e.message);
    }

    // Determine amount
    // Pro: $15/mo -> $180/yr - 30% = $126/yr ($10.50/mo)
    // Ultra: $50/mo -> $600/yr - 30% = $420/yr ($35.00/mo)
    let amountDollars = 15;
    if (normalizedPlan === 'ultra') {
      amountDollars = normalizedCycle === 'yearly' ? 420 : 50;
    } else {
      amountDollars = normalizedCycle === 'yearly' ? 126 : 15;
    }

    const transactionRef = `XOERIS-REQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    // Insert pending subscription order for admin verification
    const inserted = await sql`
      INSERT INTO SubscriptionOrders (
        full_name, email, plan, billing_cycle, amount_dollars, agree_text, status, transaction_ref, created_at, updated_at
      )
      VALUES (
        ${cleanFullName}, ${email}, ${normalizedPlan}, ${normalizedCycle}, ${amountDollars}, ${agreeText.trim()}, 'pending', ${transactionRef}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
      RETURNING id, full_name, email, plan, billing_cycle, amount_dollars, status, transaction_ref, created_at
    `;

    const order = inserted[0];

    return res.status(200).json({
      success: true,
      message: 'Subscription request sent to Admin Dashboard for verification.',
      transactionRef,
      order,
      plan: normalizedPlan,
      billingCycle: normalizedCycle,
      amount: amountDollars,
      currency: 'USD'
    });
  } catch (error) {
    console.error('Subscription order creation error:', error);
    return res.status(500).json({
      error: 'Error creating subscription request',
      details: error.message,
    });
  }
}
