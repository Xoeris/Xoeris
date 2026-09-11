import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';
import { issueSessionToken, isValidAppSecret, getAppDisplayName, normalizeEmail } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Levelist-App-Secret, X-Mova-App-Secret, X-Musify-App-Secret, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!isValidAppSecret(req)) {
    return res.status(403).json({ error: 'Unauthorized: Invalid App Secret' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const postgresUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!postgresUrl) {
    return res.status(500).json({ error: 'Server configuration error: POSTGRES_URL is missing' });
  }
  if (!resendApiKey) {
    return res.status(500).json({ error: 'Server configuration error: RESEND_API_KEY is missing' });
  }

  try {
    const sql = neon(postgresUrl);
    const resend = new Resend(resendApiKey);

    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    if (!body) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    const { identifier, password, device_id, otp, remember_device } = body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Identifier and password are required' });
    }

    // Initialize tables + migration (idempotent)
    try {
      await sql`CREATE TABLE IF NOT EXISTS TrustedDevices (username VARCHAR(255), device_id VARCHAR(255), created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (username, device_id))`;
      await sql`CREATE TABLE IF NOT EXISTS OTPs (email VARCHAR(255) PRIMARY KEY, code VARCHAR(6) NOT NULL, expires_at TIMESTAMP WITH TIME ZONE NOT NULL)`;
      await sql`CREATE TABLE IF NOT EXISTS Users (username VARCHAR(255) PRIMARY KEY, email VARCHAR(255) NOT NULL, password_hash VARCHAR(255) NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)`;
      // Migration per spec section 1 (idempotent)
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS github_id TEXT UNIQUE`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider TEXT NOT NULL DEFAULT 'email'`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT false`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS id SERIAL UNIQUE`;
      // Ensure email unique
      await sql`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_email_unique') THEN ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email); END IF; END $$`;
    } catch (e) {
      console.error('Table init/migration error:', e);
    }

    // Lookup user by identifier (username or email) — handle case-insensitive email
    const normalizedIdentifier = identifier.includes('@') ? normalizeEmail(identifier) : identifier;
    const rows = await sql`SELECT * FROM Users WHERE username = ${identifier} OR email = ${identifier} OR email = ${normalizedIdentifier} LIMIT 1`;

    if (rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    let user = rows[0];
    if (user.password_hash !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // OTP provided → verify
    if (otp) {
      const normalizedEmailForOtp = normalizeEmail(user.email);
      const otpRows = await sql`SELECT code, expires_at FROM OTPs WHERE email = ${normalizedEmailForOtp} OR email = ${user.email} LIMIT 1`;
      if (otpRows.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }
      
      const otpData = otpRows[0];
      if (otpData.code !== otp || new Date(otpData.expires_at) < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      await sql`DELETE FROM OTPs WHERE email = ${normalizedEmailForOtp} OR email = ${user.email}`;

      if (remember_device && device_id) {
        await sql`INSERT INTO TrustedDevices (username, device_id) VALUES (${user.username}, ${device_id}) ON CONFLICT DO NOTHING`;
      }

      // === Spec section 4: merge point — check auth_provider and upgrade to 'both' if needed, ensure normalized email ===
      const email = normalizeEmail(user.email);
      // Re-fetch by normalized email to get latest row with all columns
      const existing = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
      if (existing.length > 0) {
        user = existing[0];
        if (user.auth_provider === 'google') {
          const updated = await sql`
            UPDATE users
            SET auth_provider = 'both',
                email_verified = true
            WHERE id = ${user.id}
            RETURNING *
          `;
          user = updated[0] || user;
        } else if (user.auth_provider === 'github' || user.auth_provider === 'github+google' || user.auth_provider?.includes('github')) {
          // If already github, mark both-ish — use 'both' as generic for email+oauth
          const updated = await sql`
            UPDATE users
            SET auth_provider = CASE WHEN auth_provider NOT LIKE '%email%' THEN auth_provider || '+email' ELSE auth_provider END,
                email_verified = true
            WHERE id = ${user.id}
            RETURNING *
          `;
          user = updated[0] || user;
        } else {
          // Ensure email_verified true after successful OTP
          if (!user.email_verified) {
            const updated = await sql`UPDATE users SET email_verified = true WHERE id = ${user.id} RETURNING *`;
            user = updated[0] || user;
          }
        }
      } else {
        // Edge: no row by normalized email (should not happen since we found by identifier, but handle)
        const inserted = await sql`
          INSERT INTO users (username, email, auth_provider, email_verified, password_hash)
          VALUES (${user.username}, ${email}, 'email', true, ${user.password_hash})
          ON CONFLICT (email) DO NOTHING
          RETURNING *
        `;
        if (inserted.length > 0) user = inserted[0];
      }

      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ error: 'Server misconfigured: JWT_SECRET' });
      }
      const token = issueSessionToken(user);
      res.setHeader('Set-Cookie', `xoeris_token=${token}; Path=/; Domain=.xoeris.com; Max-Age=${30*24*60*60}; HttpOnly; Secure; SameSite=Lax`);
      return res.status(200).json({ token, user, message: 'Login successful', username: user.username, email: user.email });
    }

    // No OTP — check trusted device
    const trustRows = device_id ? await sql`SELECT username FROM TrustedDevices WHERE username = ${user.username} AND device_id = ${device_id}` : [];

    if (trustRows.length > 0) {
      // Trusted → issue token directly (merge check still applies)
      const email = normalizeEmail(user.email);
      const existing = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
      let trustedUser = existing.length > 0 ? existing[0] : user;
      // Ensure email_verified if trusted
      if (!trustedUser.email_verified) {
        const updated = await sql`UPDATE users SET email_verified = true WHERE id = ${trustedUser.id} RETURNING *`;
        trustedUser = updated[0] || trustedUser;
      }
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ error: 'Server misconfigured: JWT_SECRET' });
      }
      const token = issueSessionToken(trustedUser);
      res.setHeader('Set-Cookie', `xoeris_token=${token}; Path=/; Domain=.xoeris.com; Max-Age=${30*24*60*60}; HttpOnly; Secure; SameSite=Lax`);
      return res.status(200).json({ token, user: trustedUser, message: 'Login successful', username: trustedUser.username, email: trustedUser.email });
    }

    // Not trusted — send OTP (normalize email for OTP store so verification matches)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 600000).toISOString();
    const normalizedEmail = normalizeEmail(user.email);

    await sql`INSERT INTO OTPs (email, code, expires_at) VALUES (${normalizedEmail}, ${otpCode}, ${expiresAt}) ON CONFLICT (email) DO UPDATE SET code = EXCLUDED.code, expires_at = EXCLUDED.expires_at`;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: `Your ${getAppDisplayName(req)} Login OTP`,
      html: `<h1>${getAppDisplayName(req)} Sign In</h1><p>A new login was detected from an untrusted device. Here is your One-Time Password (OTP):</p><h2 style="letter-spacing: 4px; background: #f4f4f4; padding: 10px; display: inline-block;">${otpCode}</h2><p>This code will expire in 10 minutes.</p>`
    });

    return res.status(200).json({ require_otp: true, email: user.email });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
