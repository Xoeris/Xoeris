import { neon } from '@neondatabase/serverless';
import { issueSessionToken, normalizeEmail } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Levelist-App-Secret, Authorization');
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

    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    const { code } = body || {};
    if (!code) {
      return res.status(400).json({ error: 'Missing code' });
    }

    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      return res.status(500).json({ error: 'GitHub OAuth not configured' });
    }

    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return res.status(400).json({ error: 'GitHub token exchange failed', details: JSON.stringify(tokenData) });
    }

    const profileRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokenData.access_token}`, Accept: 'application/vnd.github.v3+json' },
    });
    const profile = await profileRes.json();
    if (!profile.id) {
      return res.status(400).json({ error: 'GitHub profile fetch failed' });
    }

    const emailsRes = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${tokenData.access_token}`, Accept: 'application/vnd.github.v3+json' },
    });
    const emails = await emailsRes.json();
    if (!Array.isArray(emails)) {
      return res.status(400).json({ error: 'GitHub emails fetch failed' });
    }
    const primaryEmail = emails.find((e) => e.primary && e.verified);
    if (!primaryEmail) {
      return res.status(400).json({ error: 'No verified primary email on GitHub account' });
    }

    const email = normalizeEmail(primaryEmail.email);
    if (!email) return res.status(400).json({ error: 'Invalid email from GitHub' });
    const githubId = String(profile.id);

    // Ensure migration (idempotent)
    try {
      await sql`CREATE TABLE IF NOT EXISTS Users (username VARCHAR(255) PRIMARY KEY, email VARCHAR(255) NOT NULL, password_hash VARCHAR(255) NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS github_id TEXT UNIQUE`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE`;
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
      if (!user.github_id) {
        const updated = await sql`
          UPDATE users
          SET github_id = ${githubId},
              auth_provider = CASE WHEN auth_provider NOT LIKE '%github%' THEN auth_provider || '+github' ELSE auth_provider END,
              avatar_url = COALESCE(avatar_url, ${profile.avatar_url}),
              name = COALESCE(name, ${profile.name || profile.login}),
              email_verified = true
          WHERE id = ${user.id}
          RETURNING *
        `;
        user = updated[0] || user;
      } else {
        if (!user.email_verified || !user.avatar_url) {
          const updated = await sql`
            UPDATE users
            SET avatar_url = COALESCE(avatar_url, ${profile.avatar_url}),
                email_verified = true
            WHERE id = ${user.id}
            RETURNING *
          `;
          user = updated[0] || user;
        }
      }
    } else {
      let baseUsername = (profile.name || profile.login || email.split('@')[0]).toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 30);
      if (!baseUsername) baseUsername = 'user_' + githubId.slice(0, 8);
      let username = baseUsername;
      for (let i = 0; i < 5; i++) {
        const exists = await sql`SELECT 1 FROM users WHERE username = ${username} LIMIT 1`;
        if (exists.length === 0) break;
        username = baseUsername + '_' + Math.floor(Math.random()*9000+1000);
      }
      const inserted = await sql`
        INSERT INTO users (username, email, name, github_id, auth_provider, avatar_url, email_verified, password_hash)
        VALUES (${username}, ${email}, ${profile.name || profile.login}, ${githubId}, 'github', ${profile.avatar_url}, true, '')
        RETURNING *
      `;
      user = inserted[0];
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Server misconfigured: JWT_SECRET' });
    }
    const token = issueSessionToken(user);
    const cookieDomain = '.xoeris.com';
    res.setHeader('Set-Cookie', `xoeris_token=${token}; Path=/; Domain=${cookieDomain}; Max-Age=${30*24*60*60}; HttpOnly; Secure; SameSite=Lax`);
    return res.status(200).json({ token, user });
  } catch (error) {
    console.error('github-login error:', error);
    return res.status(500).json({ error: 'GitHub authentication failed', details: error.message });
  }
}
