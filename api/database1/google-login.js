import { neon } from '@neondatabase/serverless';
import { OAuth2Client } from 'google-auth-library';
import { issueSessionToken, normalizeEmail } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Levelist-App-Secret, X-Mova-App-Secret, X-Musify-App-Secret, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const postgresUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!postgresUrl) {
    return res.status(500).json({ error: 'Server configuration error: DATABASE_URL is missing' });
  }

  try {
    const sql = neon(postgresUrl);
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    const { credential } = body || {};
    if (!credential) {
      return res.status(400).json({ error: 'Missing credential' });
    }
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ error: 'Server misconfigured: GOOGLE_CLIENT_ID missing' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email: rawEmail, name, picture, email_verified } = payload;

    if (!email_verified) {
      return res.status(400).json({ error: 'Google email not verified' });
    }

    const email = normalizeEmail(rawEmail);
    if (!email) return res.status(400).json({ error: 'Invalid email from Google' });

    // Ensure migration columns exist (idempotent)
    try {
      await sql`CREATE TABLE IF NOT EXISTS Users (username VARCHAR(255) PRIMARY KEY, email VARCHAR(255) NOT NULL, password_hash VARCHAR(255) NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS github_id TEXT UNIQUE`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider TEXT NOT NULL DEFAULT 'email'`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT false`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS id SERIAL UNIQUE`;
      await sql`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_email_unique') THEN ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email); END IF; END $$`;
    } catch (e) { console.warn('migration warn', e.message); }

    const existing = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;

    let user;
    if (existing.length > 0) {
      user = existing[0];
      if (!user.google_id) {
        const updated = await sql`
          UPDATE users
          SET google_id = ${googleId},
              auth_provider = CASE WHEN auth_provider = 'email' THEN 'both' ELSE auth_provider END,
              avatar_url = COALESCE(avatar_url, ${picture}),
              name = COALESCE(name, ${name}),
              email_verified = true
          WHERE id = ${user.id}
          RETURNING *
        `;
        user = updated[0] || user;
      } else if (user.google_id !== googleId) {
        const updated = await sql`
          UPDATE users
          SET avatar_url = COALESCE(avatar_url, ${picture}),
              name = COALESCE(name, ${name}),
              email_verified = true
          WHERE id = ${user.id}
          RETURNING *
        `;
        user = updated[0] || user;
      } else {
        if (!user.email_verified || !user.avatar_url) {
          const updated = await sql`
            UPDATE users
            SET avatar_url = COALESCE(avatar_url, ${picture}),
                email_verified = true
            WHERE id = ${user.id}
            RETURNING *
          `;
          user = updated[0] || user;
        }
      }
    } else {
      let baseUsername = (name || email.split('@')[0]).toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 30);
      if (!baseUsername) baseUsername = 'user_' + googleId.slice(0, 8);
      let username = baseUsername;
      for (let i = 0; i < 5; i++) {
        const exists = await sql`SELECT 1 FROM users WHERE username = ${username} LIMIT 1`;
        if (exists.length === 0) break;
        username = baseUsername + '_' + Math.floor(Math.random()*9000+1000);
      }
      const inserted = await sql`
        INSERT INTO users (username, email, name, google_id, auth_provider, avatar_url, email_verified, password_hash)
        VALUES (${username}, ${email}, ${name}, ${googleId}, 'google', ${picture}, true, '')
        RETURNING *
      `;
      user = inserted[0];
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET missing');
      return res.status(500).json({ error: 'Server misconfigured: JWT_SECRET' });
    }
    const token = issueSessionToken(user);
    const cookieDomain = '.xoeris.com';
    res.setHeader('Set-Cookie', `xoeris_token=${token}; Path=/; Domain=${cookieDomain}; Max-Age=${30*24*60*60}; HttpOnly; Secure; SameSite=Lax`);
    return res.status(200).json({ token, user });
  } catch (error) {
    console.error('google-login error:', error);
    return res.status(500).json({ error: 'Google authentication failed', details: error.message });
  }
}
