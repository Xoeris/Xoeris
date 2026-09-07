import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Levelist-App-Secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const appSecret = req.headers['x-levelist-app-secret'];
  if (appSecret !== process.env.LEVELIST_APP_SECRET && appSecret !== 'levelist-dev-secret-123') {
    return res.status(403).json({ error: 'Unauthorized: Invalid App Secret' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const postgresUrl = process.env.POSTGRES_URL;
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

    // Initialize tables
    try {
      await sql`CREATE TABLE IF NOT EXISTS TrustedDevices (username VARCHAR(255), device_id VARCHAR(255), created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (username, device_id))`;
      await sql`CREATE TABLE IF NOT EXISTS OTPs (email VARCHAR(255) PRIMARY KEY, code VARCHAR(6) NOT NULL, expires_at TIMESTAMP WITH TIME ZONE NOT NULL)`;
      await sql`CREATE TABLE IF NOT EXISTS Users (username VARCHAR(255) PRIMARY KEY, email VARCHAR(255) NOT NULL, password_hash VARCHAR(255) NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)`;
    } catch (e) {
      console.error('Table init error:', e);
    }

    const rows = await sql`SELECT username, email, password_hash FROM Users WHERE username = ${identifier} OR email = ${identifier}`;

    if (rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = rows[0];
    if (user.password_hash !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    if (otp) {
      const otpRows = await sql`SELECT code, expires_at FROM OTPs WHERE email = ${user.email}`;
      if (otpRows.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }
      
      const otpData = otpRows[0];
      if (otpData.code !== otp || new Date(otpData.expires_at) < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      await sql`DELETE FROM OTPs WHERE email = ${user.email}`;

      if (remember_device && device_id) {
        await sql`INSERT INTO TrustedDevices (username, device_id) VALUES (${user.username}, ${device_id}) ON CONFLICT DO NOTHING`;
      }

      return res.status(200).json({ message: 'Login successful', username: user.username, email: user.email });
    }

    const trustRows = device_id ? await sql`SELECT username FROM TrustedDevices WHERE username = ${user.username} AND device_id = ${device_id}` : [];

    if (trustRows.length > 0) {
      return res.status(200).json({ message: 'Login successful', username: user.username, email: user.email });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 600000).toISOString();

    await sql`INSERT INTO OTPs (email, code, expires_at) VALUES (${user.email}, ${otpCode}, ${expiresAt}) ON CONFLICT (email) DO UPDATE SET code = EXCLUDED.code, expires_at = EXCLUDED.expires_at`;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: 'Your Levelist Login OTP',
      html: `<h1>Levelist Sign In</h1><p>A new login was detected from an untrusted device. Here is your One-Time Password (OTP):</p><h2 style="letter-spacing: 4px; background: #f4f4f4; padding: 10px; display: inline-block;">${otpCode}</h2><p>This code will expire in 10 minutes.</p>`
    });

    return res.status(200).json({ require_otp: true, email: user.email });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
