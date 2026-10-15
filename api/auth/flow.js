import { allowedOriginFor } from '../_lib/auth.js';
import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', allowedOriginFor(req));
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Levelist-App-Secret, X-Mova-App-Secret, X-Musify-App-Secret, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = (req.url || '').toLowerCase();
  const isInit = url.includes('/init') || req.query?.action === 'init';
  const isVerify = url.includes('/verify') || req.query?.action === 'verify';
  const isConsume = url.includes('/consume') || req.query?.action === 'consume';

  const postgresUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!postgresUrl) return res.status(500).json({ error: 'Server misconfigured: DATABASE_URL missing' });
  const sql = neon(postgresUrl);

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  // 1. Action: INIT
  if (isInit) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    try {
      const { client = 'unknown', redirect_uri = '' } = body || {};
      const clientNorm = String(client).toLowerCase();
      const state = crypto.randomBytes(16).toString('hex');
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      try {
        await sql`CREATE TABLE IF NOT EXISTS auth_requests (state TEXT PRIMARY KEY, client TEXT NOT NULL, redirect_uri TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, expires_at TIMESTAMP WITH TIME ZONE NOT NULL, consumed BOOLEAN DEFAULT false)`;
      } catch (e) { console.warn('auth_requests create warn', e.message); }

      await sql`INSERT INTO auth_requests (state, client, redirect_uri, expires_at) VALUES (${state}, ${clientNorm}, ${redirect_uri}, ${expiresAt})`;
      const authUrl = `https://auth.xoeris.com?state=${state}&client=${encodeURIComponent(clientNorm)}`;
      return res.status(200).json({ state, expires_at: expiresAt, auth_url: authUrl });
    } catch (e) {
      console.error('auth flow init error', e);
      return res.status(500).json({ error: 'Failed to create auth request', details: e.message });
    }
  }

  // 2. Action: VERIFY
  if (isVerify) {
    let state = req.query?.state || body?.state;
    if (!state) return res.status(400).json({ valid: false, error: 'Missing state' });
    try {
      try {
        await sql`CREATE TABLE IF NOT EXISTS auth_requests (state TEXT PRIMARY KEY, client TEXT NOT NULL, redirect_uri TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, expires_at TIMESTAMP WITH TIME ZONE NOT NULL, consumed BOOLEAN DEFAULT false)`;
      } catch {}
      const rows = await sql`SELECT state, client, redirect_uri, expires_at, consumed FROM auth_requests WHERE state = ${state} LIMIT 1`;
      if (rows.length === 0) return res.status(200).json({ valid: false, error: 'Invalid state' });
      const r = rows[0];
      if (r.consumed) return res.status(200).json({ valid: false, error: 'Already consumed' });
      if (new Date(r.expires_at) < new Date()) return res.status(200).json({ valid: false, error: 'Expired' });
      return res.status(200).json({ valid: true, client: r.client, redirect_uri: r.redirect_uri, expires_at: r.expires_at });
    } catch (e) {
      console.error('auth flow verify error', e);
      return res.status(500).json({ valid: false, error: e.message });
    }
  }

  // 3. Action: CONSUME
  if (isConsume) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
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
      console.error('auth flow consume error', e);
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(400).json({ error: 'Unknown auth action' });
}
