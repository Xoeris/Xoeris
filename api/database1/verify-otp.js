import { neon } from '@neondatabase/serverless';
import { issueSessionToken, isValidAppSecret, normalizeEmail } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Levelist-App-Secret, X-Mova-App-Secret, X-Musify-App-Secret, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!isValidAppSecret(req)) {
    return res.status(403).json({ error: 'Unauthorized: Invalid App Secret' });
  }

  const postgresUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!postgresUrl) return res.status(500).json({ error: 'Server configuration error: POSTGRES_URL is missing' });

  try {
    const sql = neon(postgresUrl);

    // Ensure migration idempotent (matches login.js)
    try {
      await sql`CREATE TABLE IF NOT EXISTS TrustedDevices (username VARCHAR(255), device_id VARCHAR(255), created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (username, device_id))`;
      await sql`CREATE TABLE IF NOT EXISTS OTPs (email VARCHAR(255) PRIMARY KEY, code VARCHAR(6) NOT NULL, expires_at TIMESTAMP WITH TIME ZONE NOT NULL)`;
      await sql`CREATE TABLE IF NOT EXISTS Users (username VARCHAR(255) PRIMARY KEY, email VARCHAR(255) NOT NULL, password_hash VARCHAR(255) NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS github_id TEXT UNIQUE`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider TEXT NOT NULL DEFAULT 'email'`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT false`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS id SERIAL UNIQUE`;
      await sql`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_email_unique') THEN ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email); END IF; END $$`;
    } catch (e) { console.warn('verify-otp migration warn', e.message); }

    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    const { email: rawEmail, otp, device_id, remember_device } = body || {};
    if (!rawEmail || !otp) return res.status(400).json({ error: 'Email and otp required' });

    const email = normalizeEmail(rawEmail);
    if (!email) return res.status(400).json({ error: 'Invalid email' });

    // Verify OTP (stored under normalized email)
    const otpRows = await sql`SELECT code, expires_at FROM OTPs WHERE email = ${email} LIMIT 1`;
    if (otpRows.length === 0) return res.status(400).json({ error: 'Invalid or expired OTP' });
    const otpData = otpRows[0];
    if (otpData.code !== otp || new Date(otpData.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    await sql`DELETE FROM OTPs WHERE email = ${email}`;

    // Find user by normalized email
    const existing = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
    let user;
    if (existing.length > 0) {
      user = existing[0];
      if (user.auth_provider === 'google') {
        const updated = await sql`UPDATE users SET auth_provider = 'both', email_verified = true WHERE id = ${user.id} RETURNING *`;
        user = updated[0] || user;
      } else if (!user.email_verified) {
        const updated = await sql`UPDATE users SET email_verified = true WHERE id = ${user.id} RETURNING *`;
        user = updated[0] || user;
      }
      if (remember_device && device_id) {
        await sql`INSERT INTO TrustedDevices (username, device_id) VALUES (${user.username}, ${device_id}) ON CONFLICT DO NOTHING`;
      }
    } else {
      let baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 30) || 'user_' + Math.floor(Math.random()*9000+1000);
      let username = baseUsername;
      for (let i=0;i<5;i++) {
        const exists = await sql`SELECT 1 FROM users WHERE username = ${username} LIMIT 1`;
        if (exists.length===0) break;
        username = baseUsername + '_' + Math.floor(Math.random()*9000+1000);
      }
      const inserted = await sql`
        INSERT INTO users (username, email, auth_provider, email_verified, password_hash)
        VALUES (${username}, ${email}, 'email', true, '')
        RETURNING *
      `;
      user = inserted[0];
      if (remember_device && device_id) {
        await sql`INSERT INTO TrustedDevices (username, device_id) VALUES (${user.username}, ${device_id}) ON CONFLICT DO NOTHING`;
      }
    }

    if (!process.env.JWT_SECRET) return res.status(500).json({ error: 'Server misconfigured: JWT_SECRET' });
    const token = issueSessionToken(user);
    res.setHeader('Set-Cookie', `xoeris_token=${token}; Path=/; Domain=.xoeris.com; Max-Age=${30*24*60*60}; HttpOnly; Secure; SameSite=Lax`);
    return res.status(200).json({ token, user, message: 'OTP verified', username: user.username, email: user.email });
  } catch (e) {
    console.error('verify-otp error', e);
    return res.status(500).json({ error: 'Internal Server Error', details: e.message });
  }
}
