import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Levelist-App-Secret, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const postgresUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!postgresUrl) return res.status(500).json({ error: 'Server misconfigured: DATABASE_URL missing' });
  const sql = neon(postgresUrl);

  let state = req.query?.state || req.body?.state;
  if (typeof req.body === 'string') {
    try { const b = JSON.parse(req.body); state = state || b.state; } catch {}
  }
  if (!state) return res.status(400).json({ valid: false, error: 'Missing state' });

  try {
    try {
      await sql`CREATE TABLE IF NOT EXISTS auth_requests (state TEXT PRIMARY KEY, client TEXT NOT NULL, redirect_uri TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, expires_at TIMESTAMP WITH TIME ZONE NOT NULL, consumed BOOLEAN DEFAULT false)`;
    } catch (e) { console.warn('auth_requests create warn', e.message); }
    const rows = await sql`SELECT state, client, redirect_uri, expires_at, consumed FROM auth_requests WHERE state = ${state} LIMIT 1`;
    if (rows.length === 0) return res.status(200).json({ valid: false, error: 'Invalid state' });
    const r = rows[0];
    if (r.consumed) return res.status(200).json({ valid: false, error: 'Already consumed' });
    if (new Date(r.expires_at) < new Date()) return res.status(200).json({ valid: false, error: 'Expired' });
    return res.status(200).json({ valid: true, client: r.client, redirect_uri: r.redirect_uri, expires_at: r.expires_at });
  } catch (e) {
    console.error('auth/verify error', e);
    return res.status(500).json({ valid: false, error: e.message });
  }
}
