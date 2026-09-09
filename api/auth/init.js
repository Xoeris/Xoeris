import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Levelist-App-Secret, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const postgresUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!postgresUrl) return res.status(500).json({ error: 'Server misconfigured: DATABASE_URL missing' });
  const sql = neon(postgresUrl);

  try {
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    const { client = 'unknown', redirect_uri = '' } = body || {};

    const allowed = ['hide', 'levelist', 'xoeris', 'web'];
    const clientNorm = String(client).toLowerCase();
    if (client && !allowed.includes(clientNorm)) {
      // still allow but log; no strict rejection to keep flexibility
      console.warn(`Unknown client init: ${clientNorm}`);
    }
    const state = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min

    try {
      await sql`CREATE TABLE IF NOT EXISTS auth_requests (state TEXT PRIMARY KEY, client TEXT NOT NULL, redirect_uri TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, expires_at TIMESTAMP WITH TIME ZONE NOT NULL, consumed BOOLEAN DEFAULT false)`;
    } catch (e) { console.warn('auth_requests create warn', e.message); }

    await sql`INSERT INTO auth_requests (state, client, redirect_uri, expires_at) VALUES (${state}, ${clientNorm}, ${redirect_uri}, ${expiresAt})`;

    const authUrl = `https://auth.xoeris.com?state=${state}&client=${encodeURIComponent(clientNorm)}`;
    return res.status(200).json({ state, expires_at: expiresAt, auth_url: authUrl });
  } catch (e) {
    console.error('auth/init error', e);
    return res.status(500).json({ error: 'Failed to create auth request', details: e.message });
  }
}
