import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Levelist-App-Secret, X-Mova-App-Secret, X-Musify-App-Secret, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const postgresUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!postgresUrl) return res.status(500).json({ error: 'Server misconfigured: DATABASE_URL missing' });
  const sql = neon(postgresUrl);

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const { state } = body || {};
  if (!state) return res.status(400).json({ error: 'Missing state' });
  try {
    try {
      await sql`CREATE TABLE IF NOT EXISTS auth_requests (state TEXT PRIMARY KEY, client TEXT NOT NULL, redirect_uri TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, expires_at TIMESTAMP WITH TIME ZONE NOT NULL, consumed BOOLEAN DEFAULT false)`;
    } catch {}
    const rows = await sql`SELECT consumed, expires_at FROM auth_requests WHERE state = ${state} LIMIT 1`;
    if (rows.length === 0) return res.status(404).json({ error: 'Invalid state' });
    if (rows[0].consumed) return res.status(400).json({ error: 'Already consumed' });
    if (new Date(rows[0].expires_at) < new Date()) return res.status(400).json({ error: 'Expired' });
    await sql`UPDATE auth_requests SET consumed = true WHERE state = ${state}`;
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('auth/consume error', e);
    return res.status(500).json({ error: e.message });
  }
}
