import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';

const sql = neon(process.env.POSTGRES_URL);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Levelist-App-Secret');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const appSecret = req.headers['x-levelist-app-secret'];
  if (appSecret !== process.env.LEVELIST_APP_SECRET && appSecret !== 'levelist-dev-secret-123') {
    res.status(403).json({ error: 'Unauthorized' });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    if (!body) {
      res.status(400).json({ error: 'Empty body' });
      return;
    }

    // Initialize tables if they don't exist
    try {
      await sql`CREATE TABLE IF NOT EXISTS TrustedDevices (username VARCHAR(255), device_id VARCHAR(255), created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (username, device_id))`;
      await sql`CREATE TABLE IF NOT EXISTS OTPs (email VARCHAR(255) PRIMARY KEY, code VARCHAR(6) NOT NULL, expires_at TIMESTAMP WITH TIME ZONE NOT NULL)`;
      await sql`CREATE TABLE IF NOT EXISTS Users (username VARCHAR(255) PRIMARY KEY, email VARCHAR(255) NOT NULL, password_hash VARCHAR(255) NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)`;
    } catch (e) {
      console.error('Init error:', e);
    }

    const identifier = body.identifier;
    const password = body.password;
    const device_id = body.device_id;
    const otp = body.otp;
    const remember_device = body.remember_device;

    if (!identifier || !password) {
      res.status(400).json({ error: 'Missing identifier or password' });
      return;
    }

    const rows = await sql`SELECT username, email, password_hash FROM Users WHERE username = ${identifier} OR email = ${identifier}`;

    if (rows.length === 0) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const user = rows[0];
    if (user.password_hash !== password) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }

    if (otp) {
      const otpRows = await sql`SELECT code, expires_at FROM OTPs WHERE email = ${user.email}`;
      if (otpRows.length === 0) {
        res.status(400).json({ error: 'No OTP found' });
        return;
      }
      
      const otpData = otpRows[0];
      if (otpData.code !== otp || new Date(otpData.expires_at) < new Date()) {
        res.status(400).json({ error: 'Invalid or expired OTP' });
        return;
      }

      await sql`DELETE FROM OTPs WHERE email = ${user.email}`;

      if (remember_device && device_id) {
        await sql`INSERT INTO TrustedDevices (username, device_id) VALUES (${user.username}, ${device_id}) ON CONFLICT DO NOTHING`;
      }

      res.status(200).json({ message: 'Success', username: user.username, email: user.email });
      return;
    }

    const trustRows = device_id ? await sql`SELECT username FROM TrustedDevices WHERE username = ${user.username} AND device_id = ${device_id}` : [];

    if (trustRows.length > 0) {
      res.status(200).json({ message: 'Success', username: user.username, email: user.email });
      return;
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 600000).toISOString();

    await sql`INSERT INTO OTPs (email, code, expires_at) VALUES (${user.email}, ${otpCode}, ${expiresAt}) ON CONFLICT (email) DO UPDATE SET code = EXCLUDED.code, expires_at = EXCLUDED.expires_at`;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: 'Login OTP',
      html: 'Your OTP is: ' + otpCode
    });

    res.status(200).json({ require_otp: true, email: user.email });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Error', details: error.message });
  }
}
